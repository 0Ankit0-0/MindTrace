export type StressState = "stable" | "declining" | "critical";

export interface StressInput {
  mood: string;
  sleep: number;
  accuracy: number;
  avgResponseTime: number;
  baselineAccuracy: number;
  baselineResponseTime: number;
  drift: SessionDriftResult;
}

export interface StressResult {
  stressScore: number;
  state: StressState;
  reason: string;
  signals: string[];
  components: {
    pulse: number;
    behavior: number;
    cognitiveDrift: number;
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
  firstHalfMistakeRate: number;
  secondHalfMistakeRate: number;
  driftDetected: boolean;
  driftSeverity: "none" | "mild" | "strong";
  accuracyDrop: number;
  responseTimeIncrease: number;
  mistakeFrequencyIncrease: number;
  longestWrongStreak: number;
}

const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, value));

const average = (values: number[]) => {
  if (!values.length) {
    return 0;
  }

  return values.reduce((total, value) => total + value, 0) / values.length;
};

const getState = (stressScore: number): StressState => {
  if (stressScore >= 70) {
    return "critical";
  }

  if (stressScore >= 50) {
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

const calculateLongestWrongStreak = (answers: boolean[]) => {
  let current = 0;
  let longest = 0;

  answers.forEach((answer) => {
    if (answer) {
      current = 0;
      return;
    }

    current += 1;
    longest = Math.max(longest, current);
  });

  return longest;
};

export const detectSessionDrift = ({ answers, responseTimes }: SessionDriftInput): SessionDriftResult => {
  const midpoint = Math.max(1, Math.floor(answers.length / 2));
  const firstHalfAnswers = answers.slice(0, midpoint);
  const secondHalfAnswers = answers.slice(midpoint);
  const firstHalfTimes = responseTimes.slice(0, midpoint);
  const secondHalfTimes = responseTimes.slice(midpoint);

  const safeSecondHalfAnswers = secondHalfAnswers.length ? secondHalfAnswers : firstHalfAnswers;
  const safeSecondHalfTimes = secondHalfTimes.length ? secondHalfTimes : firstHalfTimes;

  const accuracy = calculateAccuracy(answers);
  const avgResponseTime = average(responseTimes);
  const firstHalfAccuracy = calculateAccuracy(firstHalfAnswers);
  const secondHalfAccuracy = calculateAccuracy(safeSecondHalfAnswers);
  const firstHalfResponseTime = average(firstHalfTimes);
  const secondHalfResponseTime = average(safeSecondHalfTimes);
  const firstHalfMistakeRate = 1 - firstHalfAccuracy;
  const secondHalfMistakeRate = 1 - secondHalfAccuracy;
  const accuracyDrop = clamp(firstHalfAccuracy - secondHalfAccuracy, 0, 1);
  const responseTimeIncrease = Math.max(0, secondHalfResponseTime - firstHalfResponseTime);
  const mistakeFrequencyIncrease = clamp(secondHalfMistakeRate - firstHalfMistakeRate, 0, 1);
  const longestWrongStreak = calculateLongestWrongStreak(answers);

  const responseTimeRatio =
    firstHalfResponseTime > 0 ? responseTimeIncrease / firstHalfResponseTime : responseTimeIncrease > 0 ? 1 : 0;
  const driftSignalScore =
    clamp((accuracyDrop / 0.25) * 45) +
    clamp((responseTimeRatio / 0.35) * 30) +
    clamp((mistakeFrequencyIncrease / 0.3) * 25);
  const driftDetected = answers.length >= 4 && driftSignalScore >= 45;
  const driftSeverity =
    !driftDetected ? "none" : driftSignalScore >= 75 || longestWrongStreak >= 3 ? "strong" : "mild";

  return {
    accuracy,
    avgResponseTime,
    firstHalfAccuracy,
    secondHalfAccuracy,
    firstHalfResponseTime,
    secondHalfResponseTime,
    firstHalfMistakeRate,
    secondHalfMistakeRate,
    driftDetected,
    driftSeverity,
    accuracyDrop,
    responseTimeIncrease,
    mistakeFrequencyIncrease,
    longestWrongStreak,
  };
};

const getPulseScore = (mood: string, sleep: number, signals: string[]) => {
  const normalizedMood = mood.trim().toLowerCase();
  let pulseScore = 38;

  if (normalizedMood.includes("stressed") || normalizedMood.includes("overwhelmed")) {
    pulseScore += 28;
    signals.push("stressed pulse");
  } else if (normalizedMood.includes("sad") || normalizedMood.includes("drained")) {
    pulseScore += 18;
    signals.push("low-energy pulse");
  } else if (normalizedMood.includes("steady")) {
    pulseScore -= 4;
  }

  if (sleep < 5) {
    pulseScore += 22;
    signals.push("severe sleep debt");
  } else if (sleep < 6) {
    pulseScore += 14;
    signals.push("low sleep");
  } else if (sleep >= 8) {
    pulseScore -= 6;
  }

  return clamp(pulseScore);
};

const getBehaviorScore = (
  accuracy: number,
  baselineAccuracy: number,
  avgResponseTime: number,
  baselineResponseTime: number,
  signals: string[],
) => {
  let behaviorScore = 28;
  const accuracyGap = Math.max(0, baselineAccuracy - accuracy);
  const responseTimeGapRatio = Math.max(0, avgResponseTime - baselineResponseTime) / Math.max(baselineResponseTime, 1);

  behaviorScore += clamp((1 - accuracy) * 40);
  behaviorScore += clamp((accuracyGap / 0.3) * 20);
  behaviorScore += clamp((responseTimeGapRatio / 0.5) * 20);

  if (accuracy < 0.55) {
    signals.push("accuracy dropped in session");
  } else if (accuracy < baselineAccuracy) {
    signals.push("accuracy below baseline");
  }

  if (avgResponseTime > baselineResponseTime * 1.15) {
    signals.push("slower than baseline");
  }

  return clamp(behaviorScore);
};

const getDriftScore = (drift: SessionDriftResult, signals: string[]) => {
  let driftScore = 18;

  driftScore += clamp((drift.accuracyDrop / 0.25) * 35);
  driftScore += clamp(
    (drift.responseTimeIncrease / Math.max(drift.firstHalfResponseTime, 1) / 0.35) * 25,
  );
  driftScore += clamp((drift.mistakeFrequencyIncrease / 0.3) * 25);
  driftScore += Math.min(drift.longestWrongStreak * 6, 18);

  if (drift.driftDetected) {
    signals.push("cognitive drift detected");
  }

  if (drift.accuracyDrop >= 0.15) {
    signals.push("late-session accuracy drop");
  }

  if (drift.responseTimeIncrease >= Math.max(250, drift.firstHalfResponseTime * 0.12)) {
    signals.push("response time increased");
  }

  if (drift.mistakeFrequencyIncrease >= 0.15) {
    signals.push("mistake frequency increased");
  }

  if (drift.longestWrongStreak >= 3) {
    signals.push("wrong-answer streak");
  }

  return clamp(driftScore);
};

const buildReason = (
  state: StressState,
  pulse: number,
  behavior: number,
  cognitiveDrift: number,
  drift: SessionDriftResult,
) => {
  const components = [
    { key: "pulse", score: pulse },
    { key: "behavior", score: behavior },
    { key: "cognitiveDrift", score: cognitiveDrift },
  ].sort((left, right) => right.score - left.score);

  if (drift.driftDetected && drift.driftSeverity === "strong") {
    return "Cognitive fatigue detected from lower second-half accuracy, slower responses, and more mistakes.";
  }

  switch (components[0].key) {
    case "behavior":
      return state === "stable"
        ? "Behavior stayed mostly controlled, but there are some answer-quality fluctuations to watch."
        : "Performance behavior slipped during the session and is contributing strongly to the stress score.";
    case "pulse":
      return "Baseline pulse signals are elevated, but the session result also reflects live performance data.";
    default:
      return "Cognitive drift is affecting the result more than baseline pulse alone.";
  }
};

export const getStressRecommendation = (state: StressState, drift: SessionDriftResult): string => {
  if (state === "critical") {
    return drift.driftDetected
      ? "Switch to easier topics, stop timed problem solving for now, and take a 10-minute recovery break."
      : "Stress is high. Reduce load, use one easy revision block, and prioritize recovery before the next test.";
  }

  if (state === "declining") {
    return drift.driftDetected
      ? "Switch to easier topics, shorten the next set, and reset before continuing."
      : "Use a lighter block next and review weak concepts before attempting another timed set.";
  }

  return drift.driftDetected
    ? "You are still stable, but fatigue is starting to show. Take a short break, then continue with a smaller set."
    : "Performance is stable. Keep the same level or step up gradually with one focused challenge set.";
};

export const calculateStressScore = (input: StressInput): StressResult => {
  const signals: string[] = [];
  const accuracy = normalizeAccuracy(input.accuracy);
  const baselineAccuracy = normalizeAccuracy(input.baselineAccuracy || 0.75);
  const avgResponseTime = Math.max(0, input.avgResponseTime);
  const baselineResponseTime = Math.max(1, input.baselineResponseTime || 1200);

  const pulse = getPulseScore(input.mood, input.sleep, signals);
  const behavior = getBehaviorScore(
    accuracy,
    baselineAccuracy,
    avgResponseTime,
    baselineResponseTime,
    signals,
  );
  const cognitiveDrift = getDriftScore(input.drift, signals);
  const stressScore = Math.round(pulse * 0.3 + behavior * 0.4 + cognitiveDrift * 0.3);
  const state = getState(stressScore);
  const reason = buildReason(state, pulse, behavior, cognitiveDrift, input.drift);

  return {
    stressScore,
    state,
    reason,
    signals: Array.from(new Set(signals)),
    components: {
      pulse,
      behavior,
      cognitiveDrift,
      mood: pulse,
      behavioral: behavior,
      drift: cognitiveDrift,
    },
  };
};
