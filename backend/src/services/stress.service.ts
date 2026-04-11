export type StressState = "stable" | "declining" | "critical";

export interface StressInput {
  mood: string;
  sleep: number;
  accuracy: number;
  avgResponseTime: number;
  baselineAccuracy: number;
  baselineResponseTime: number;
  driftDetected?: boolean;
}

export interface StressResult {
  stressScore: number;
  state: StressState;
  signals: string[];
  components: {
    mood: number;
    behavioral: number;
    drift: number;
  };
}

export interface SessionDriftInput {
  answers: boolean[];
  responseTimes: number[];
}

export interface SessionDriftResult {
  accuracy: number;
  avgResponseTime: number;
  firstHalfAccuracy: number;
  secondHalfAccuracy: number;
  firstHalfResponseTime: number;
  secondHalfResponseTime: number;
  driftDetected: boolean;
}

const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, value));

const average = (values: number[]) => {
  if (!values.length) {
    return 0;
  }

  return values.reduce((total, value) => total + value, 0) / values.length;
};

const getState = (stressScore: number): StressState => {
  if (stressScore > 70) {
    return "critical";
  }

  if (stressScore > 60) {
    return "declining";
  }

  return "stable";
};

const normalizeAccuracy = (accuracy: number) => {
  if (accuracy > 1) {
    return clamp(accuracy, 0, 100) / 100;
  }

  return clamp(accuracy, 0, 1);
};

const calculateAccuracy = (answers: boolean[]) => {
  if (!answers.length) {
    return 0;
  }

  return answers.filter(Boolean).length / answers.length;
};

export const detectSessionDrift = ({ answers, responseTimes }: SessionDriftInput): SessionDriftResult => {
  const midpoint = Math.max(1, Math.floor(answers.length / 2));
  const firstHalfAnswers = answers.slice(0, midpoint);
  const secondHalfAnswers = answers.slice(midpoint);
  const firstHalfTimes = responseTimes.slice(0, midpoint);
  const secondHalfTimes = responseTimes.slice(midpoint);

  const accuracy = calculateAccuracy(answers);
  const avgResponseTime = average(responseTimes);
  const firstHalfAccuracy = calculateAccuracy(firstHalfAnswers);
  const secondHalfAccuracy = calculateAccuracy(secondHalfAnswers.length ? secondHalfAnswers : firstHalfAnswers);
  const firstHalfResponseTime = average(firstHalfTimes);
  const secondHalfResponseTime = average(secondHalfTimes.length ? secondHalfTimes : firstHalfTimes);
  const driftDetected = secondHalfAccuracy < firstHalfAccuracy && secondHalfResponseTime > firstHalfResponseTime;

  return {
    accuracy,
    avgResponseTime,
    firstHalfAccuracy,
    secondHalfAccuracy,
    firstHalfResponseTime,
    secondHalfResponseTime,
    driftDetected,
  };
};

export const getStressRecommendation = (state: StressState, driftDetected = false): string => {
  if (state === "critical") {
    return driftDetected
      ? "Cognitive fatigue detected. Stop timed questions, take a 10-minute reset, then resume with one easy recall item."
      : "Stress is high. Switch to a recovery-first block and avoid intense problem solving for now.";
  }

  if (state === "declining") {
    return driftDetected
      ? "Your pace is slipping. Reduce difficulty, use shorter sets, and add a reset before the next attempt."
      : "Use a lighter study block with short breaks and one clear task.";
  }

  return "You look stable. Continue with a steady study block and keep breaks scheduled.";
};

export const calculateStressScore = (input: StressInput): StressResult => {
  const mood = input.mood.trim().toLowerCase();
  const accuracy = normalizeAccuracy(input.accuracy);
  const baselineAccuracy = normalizeAccuracy(input.baselineAccuracy || 0.75);
  const avgResponseTime = Math.max(0, input.avgResponseTime);
  const baselineResponseTime = Math.max(1, input.baselineResponseTime || 1200);
  const signals: string[] = [];

  let moodScore = 50;
  if (mood === "stressed" || mood.includes("stressed")) {
    moodScore += 20;
    signals.push("stressed mood");
  }

  if (mood === "sad" || mood.includes("sad")) {
    moodScore += 15;
    signals.push("sad mood");
  }

  if (input.sleep < 6) {
    moodScore += 15;
    signals.push("low sleep");
  }

  let behavioralScore = 50;
  if (accuracy < baselineAccuracy) {
    behavioralScore += 15;
    signals.push("accuracy below baseline");
  }

  if (avgResponseTime > baselineResponseTime) {
    behavioralScore += 15;
    signals.push("response time above baseline");
  }

  const driftScore = input.driftDetected ? 85 : 45;
  if (input.driftDetected) {
    signals.push("cognitive drift");
  }

  const stressScore = Math.round(
    clamp(moodScore) * 0.3 + clamp(behavioralScore) * 0.4 + clamp(driftScore) * 0.3,
  );
  const state = getState(stressScore);

  return {
    stressScore,
    state,
    signals,
    components: {
      mood: Math.round(clamp(moodScore)),
      behavioral: Math.round(clamp(behavioralScore)),
      drift: Math.round(clamp(driftScore)),
    },
  };
};
