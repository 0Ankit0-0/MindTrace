import {
  AffectiveState,
  TestAnswer,
  TestDifficulty,
  TestTopic,
  testQuestionBank,
  testTopicMeta,
} from '@/constants/DummyData';

export type AiRecommendationPayload = {
  weakTopics: string[];
  recentMistakes: string[];
};

export const calculateTestResults = (
  answers: TestAnswer[],
  sessionStressScore: number,
  sessionAffectiveState: AffectiveState
): {
  score: number;
  weakTopics: TestTopic[];
  topicBreakdown: Record<string, { correct: number; total: number; wrong: number; accuracy: number }>;
  moodCorrelation: { earlyAccuracy: number; lateAccuracy: number; insight: string };
  peakDifficulty: TestDifficulty;
} => {
  if (!answers.length) {
    return {
      score: 0,
      weakTopics: [],
      topicBreakdown: {},
      moodCorrelation: { earlyAccuracy: 0, lateAccuracy: 0, insight: 'No answers recorded.' },
      peakDifficulty: 'easy',
    };
  }

  const correct = answers.filter((answer) => answer.correct).length;
  const score = Math.round((correct / answers.length) * 100);
  const topicBreakdown: Record<string, { correct: number; total: number; wrong: number; accuracy: number }> = {};

  answers.forEach((answer) => {
    if (!topicBreakdown[answer.topic]) {
      topicBreakdown[answer.topic] = { correct: 0, total: 0, wrong: 0, accuracy: 0 };
    }

    topicBreakdown[answer.topic].total += 1;
    if (answer.correct) {
      topicBreakdown[answer.topic].correct += 1;
    } else {
      topicBreakdown[answer.topic].wrong += 1;
    }
  });

  (Object.keys(topicBreakdown) as TestTopic[]).forEach((topic) => {
    topicBreakdown[topic].accuracy = topicBreakdown[topic].correct / Math.max(topicBreakdown[topic].total, 1);
  });

  const weakTopics = (Object.keys(topicBreakdown) as TestTopic[])
    .filter((topic) => {
      const stats = topicBreakdown[topic];

      if (stats.wrong === 0) {
        return false;
      }

      if (stats.total <= 2) {
        return true;
      }

      return stats.accuracy < 0.75 || stats.wrong >= 2;
    })
    .sort((left, right) => {
      const leftStats = topicBreakdown[left];
      const rightStats = topicBreakdown[right];

      if (rightStats.wrong !== leftStats.wrong) {
        return rightStats.wrong - leftStats.wrong;
      }

      return leftStats.accuracy - rightStats.accuracy;
    });

  const midpoint = Math.ceil(answers.length / 2);
  const earlyAnswers = answers.slice(0, midpoint);
  const lateAnswers = answers.slice(midpoint);
  const earlyAccuracy = Math.round(
    (earlyAnswers.filter((answer) => answer.correct).length / Math.max(earlyAnswers.length, 1)) * 100
  );
  const lateAccuracy = Math.round(
    (lateAnswers.filter((answer) => answer.correct).length / Math.max(lateAnswers.length, 1)) * 100
  );
  const earlyAvgTime = Math.round(
    earlyAnswers.reduce((sum, answer) => sum + answer.timeTakenSeconds, 0) / Math.max(earlyAnswers.length, 1)
  );
  const lateAvgTime = Math.round(
    lateAnswers.reduce((sum, answer) => sum + answer.timeTakenSeconds, 0) / Math.max(lateAnswers.length, 1)
  );
  const driftDetected =
    answers.length >= 4 &&
    lateAccuracy <= earlyAccuracy - 15 &&
    lateAvgTime >= earlyAvgTime + Math.max(4, Math.round(earlyAvgTime * 0.15));

  const insight = driftDetected
    ? 'Cognitive drift detected: accuracy dropped while response time slowed in the second half.'
    : lateAccuracy > earlyAccuracy
      ? 'Your accuracy improved as the test progressed. You warm up well under pressure.'
      : lateAccuracy < earlyAccuracy
        ? 'Your accuracy dipped later in the test. A short reset or smaller block may preserve performance better.'
        : sessionStressScore > 60
          ? 'High stress at test start may have affected performance. Lighter blocks should improve consistency.'
          : sessionAffectiveState === 'curiosity'
            ? 'Consistent performance throughout. Your focus stayed steady, so you can push one level harder next time.'
            : 'Consistent performance throughout. Your preparation is solid.';

  const peakDifficulty: TestDifficulty = answers.some((answer) => answer.difficulty === 'hard')
    ? 'hard'
    : answers.some((answer) => answer.difficulty === 'medium')
      ? 'medium'
      : 'easy';

  return {
    score,
    weakTopics,
    topicBreakdown,
    moodCorrelation: {
      earlyAccuracy,
      lateAccuracy,
      insight,
    },
    peakDifficulty,
  };
};

export const generateTestStudyRecommendations = (
  weakTopics: TestTopic[],
  affectiveState: AffectiveState,
  stressScore: number
): { topic: TestTopic; label: string; approach: string; duration: string }[] => {
  const approachByState: Record<AffectiveState, string> = {
    curiosity: 'Deep dive with challenge problems',
    confusion: 'Concept map plus one worked example',
    frustration: 'Flashcards and easy recall only',
    boredom: 'Quick quiz format with timed rounds',
  };

  const fallbackTopics = (Object.keys(testTopicMeta) as TestTopic[]).slice(0, 2);
  const topicsToRecommend = weakTopics.length ? weakTopics.slice(0, 3) : fallbackTopics;
  const duration = stressScore > 65 ? '15 min max' : stressScore > 40 ? '25 min' : '30-35 min';

  return topicsToRecommend.map((topic) => ({
    topic,
    label: testTopicMeta[topic].label,
    approach:
      stressScore <= 40
        ? 'Stress is low, so use one challenge set and a short teach-back summary to deepen retention.'
        : approachByState[affectiveState],
    duration,
  }));
};

export const buildAiRecommendationPayload = (answers: TestAnswer[]): AiRecommendationPayload => {
  const wrongAnswers = answers.filter((answer) => !answer.correct);
  const weakTopicCounts = new Map<string, number>();

  wrongAnswers.forEach((answer) => {
    const label = testTopicMeta[answer.topic].label;
    weakTopicCounts.set(label, (weakTopicCounts.get(label) || 0) + 1);
  });

  const weakTopics = Array.from(weakTopicCounts.entries())
    .sort((left, right) => right[1] - left[1])
    .slice(0, 3)
    .map(([topic]) => topic);

  const recentMistakes = wrongAnswers.slice(-5).map((answer) => {
    const question = testQuestionBank.find((item) => item.id === answer.questionId);
    const label = testTopicMeta[answer.topic].label;
    const primaryTags = question?.tags?.slice(0, 2).map((tag) =>
      tag
        .split(/[-_]+/)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ')
    );

    if (primaryTags?.length) {
      return `${label}: ${primaryTags.join(', ')}`;
    }

    return `${label}: ${question?.question || 'Concept review needed'}`;
  });

  return {
    weakTopics,
    recentMistakes,
  };
};
