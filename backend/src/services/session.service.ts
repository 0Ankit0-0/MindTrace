import db from "../database/sqlite/db";
import { applySessionGamification, GamificationStatus } from "./gamification.service";
import {
  calculateStressScore,
  detectSessionDrift,
  getStressRecommendation,
  SessionDriftResult,
  StressResult,
} from "./stress.service";

export interface AnalyzeSessionInput {
  answers: boolean[];
  responseTimes: number[];
  mood?: string;
  sleep?: number;
}

export interface AnalyzeSessionResult {
  sessionId: number;
  stressScore: number;
  state: StressResult["state"];
  insight: string;
  recommendation: string;
  drift: SessionDriftResult;
  components: StressResult["components"];
  signals: string[];
  gamification: GamificationStatus;
}

interface ProfileBaselineRow {
  baseline_accuracy: number | null;
  baseline_response_time: number | null;
}

interface SessionRow {
  stress_score: number;
}

const getBaseline = (userId: number) => {
  const row = db
    .prepare("SELECT baseline_accuracy, baseline_response_time FROM profiles WHERE user_id = ?")
    .get(userId) as ProfileBaselineRow | undefined;

  return {
    baselineAccuracy: row?.baseline_accuracy ?? 0.75,
    baselineResponseTime: row?.baseline_response_time ?? 1200,
  };
};

const getPreviousStressScore = (userId: number) => {
  const row = db
    .prepare("SELECT stress_score FROM sessions WHERE user_id = ? ORDER BY created_at DESC, id DESC LIMIT 1")
    .get(userId) as SessionRow | undefined;

  return row?.stress_score;
};

const updateBaseline = (userId: number, accuracy: number, responseTime: number) => {
  const current = getBaseline(userId);
  const blendedAccuracy = current.baselineAccuracy * 0.8 + accuracy * 0.2;
  const blendedResponseTime = current.baselineResponseTime * 0.8 + responseTime * 0.2;

  db.prepare(
    `
      UPDATE profiles
      SET baseline_accuracy = ?, baseline_response_time = ?
      WHERE user_id = ?
    `,
  ).run(blendedAccuracy, blendedResponseTime, userId);
};

export const analyzeSession = (userId: number, input: AnalyzeSessionInput): AnalyzeSessionResult => {
  const drift = detectSessionDrift({
    answers: input.answers,
    responseTimes: input.responseTimes,
  });
  const baseline = getBaseline(userId);
  const stress = calculateStressScore({
    mood: input.mood || "steady",
    sleep: input.sleep ?? 7,
    accuracy: drift.accuracy,
    avgResponseTime: drift.avgResponseTime,
    baselineAccuracy: baseline.baselineAccuracy,
    baselineResponseTime: baseline.baselineResponseTime,
    driftDetected: drift.driftDetected,
  });
  const previousStressScore = getPreviousStressScore(userId);

  const result = db
    .prepare(
      `
        INSERT INTO sessions (user_id, accuracy, response_time, stress_score, drift_detected, mood, sleep)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
    )
    .run(
      userId,
      drift.accuracy,
      drift.avgResponseTime,
      stress.stressScore,
      drift.driftDetected ? 1 : 0,
      input.mood || "steady",
      input.sleep ?? 7,
    );

  updateBaseline(userId, drift.accuracy, drift.avgResponseTime);

  const insight = drift.driftDetected
    ? "Cognitive fatigue detected"
    : stress.state === "stable" && stress.stressScore <= 45
      ? "Low stress and stable performance detected"
      : "Session pattern is stable";

  return {
    sessionId: Number(result.lastInsertRowid),
    stressScore: stress.stressScore,
    state: stress.state,
    insight,
    recommendation: getStressRecommendation(stress.state, drift.driftDetected),
    drift,
    components: stress.components,
    signals: stress.signals,
    gamification: applySessionGamification({
      userId,
      stressScore: stress.stressScore,
      previousStressScore,
    }),
  };
};
