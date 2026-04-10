import {
  AffectiveState,
  MoodLog,
  PressureLevel,
  RescuePlanStep,
  SleepTiming,
  StudyTopic,
  VelocityState,
  counselorStudentsSeed,
  examPressureOptions,
  moodHistorySeed,
  sleepOptions,
} from '@/constants/DummyData';

export type CheckInPayload = {
  moodScore: number;
  emoji: 'drained' | 'tense' | 'steady' | 'bright';
  sleepTiming: SleepTiming;
  examPressure: PressureLevel;
  brainDump: string;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const keywordScore = (brainDump: string) => {
  const text = brainDump.toLowerCase();
  let score = 0;

  ['panic', 'stuck', 'overwhelmed', 'exhausted', 'burnout'].forEach((word) => {
    if (text.includes(word)) {
      score += 6;
    }
  });

  ['curious', 'ready', 'better', 'focused', 'clear'].forEach((word) => {
    if (text.includes(word)) {
      score -= 4;
    }
  });

  return score;
};

export const calculateStressScore = (payload: CheckInPayload) => {
  const sleepImpact = sleepOptions.find((option) => option.key === payload.sleepTiming)?.impact ?? 12;
  const pressureImpact =
    examPressureOptions.find((option) => option.key === payload.examPressure)?.impact ?? 20;
  const moodImpact = (10 - payload.moodScore) * 4.2;
  const emojiImpact = payload.emoji === 'tense' ? 8 : payload.emoji === 'drained' ? 10 : 0;
  const raw = moodImpact + sleepImpact + pressureImpact + emojiImpact + keywordScore(payload.brainDump);

  return clamp(Math.round(raw), 0, 100);
};

export const getStressStatus = (stressScore: number) => {
  if (stressScore >= 80) return 'High Risk';
  if (stressScore >= 55) return 'Elevated';
  if (stressScore >= 30) return 'Watchful';
  return 'Calm';
};

export const buildMoodHistory = (latestMoodScore: number): MoodLog[] =>
  moodHistorySeed.map((entry, index, array) =>
    index === array.length - 1 ? { ...entry, score: latestMoodScore } : entry
  );

export const getVelocityState = (history: MoodLog[], stressScore: number): VelocityState => {
  const firstHalf = history.slice(0, 3).reduce((sum, item) => sum + item.score, 0) / 3;
  const secondHalf = history.slice(-3).reduce((sum, item) => sum + item.score, 0) / 3;
  const delta = Number((secondHalf - firstHalf).toFixed(1));

  if (stressScore >= 80 || (delta <= -1.4 && stressScore >= 65)) return 'critical';
  if (delta >= 1.2) return 'recovering';
  if (delta <= -0.6) return 'declining';
  return 'stable';
};

export const getAffectiveState = (payload: CheckInPayload): AffectiveState => {
  const text = payload.brainDump.toLowerCase();

  if (payload.moodScore >= 7 && text.includes('why')) return 'curiosity';
  if (payload.moodScore <= 4 || text.includes('frustrat') || text.includes('stuck')) return 'frustration';
  if (text.includes('confus') || payload.examPressure === 'medium') return 'confusion';
  if (text.includes('bor') || payload.moodScore === 5) return 'boredom';
  return payload.moodScore >= 7 ? 'curiosity' : 'confusion';
};

export const getStudyPlan = (affectiveState: AffectiveState): StudyTopic[] => {
  if (affectiveState === 'frustration') {
    return [
      {
        id: 'easy-1',
        title: 'Flashcards and recall sprint',
        subject: 'Current weak topic',
        difficulty: 'easy',
        duration: '15 min',
        reason: 'Keeps momentum high without cognitive overload.',
        action: 'Review summary notes and answer 5 quick questions.',
      },
      {
        id: 'easy-2',
        title: 'Worked-example walkthrough',
        subject: 'Problem solving',
        difficulty: 'easy',
        duration: '20 min',
        reason: 'Reduces friction by learning from a solved path.',
        action: 'Annotate one solved example and highlight each step.',
      },
    ];
  }

  if (affectiveState === 'confusion') {
    return [
      {
        id: 'medium-1',
        title: 'Concept map session',
        subject: 'Core chapter',
        difficulty: 'medium',
        duration: '25 min',
        reason: 'Turns scattered understanding into a structure.',
        action: 'Map 4 subtopics and write one explanation under each.',
      },
      {
        id: 'medium-2',
        title: 'Guided practice set',
        subject: 'Application questions',
        difficulty: 'medium',
        duration: '30 min',
        reason: 'Builds clarity through supported practice.',
        action: 'Solve 3 mixed problems and compare with notes.',
      },
    ];
  }

  if (affectiveState === 'curiosity') {
    return [
      {
        id: 'hard-1',
        title: 'Challenge block',
        subject: 'Advanced topic',
        difficulty: 'hard',
        duration: '35 min',
        reason: 'High motivation can be converted into deeper learning.',
        action: 'Attempt an exam-level problem before opening hints.',
      },
      {
        id: 'hard-2',
        title: 'Teach-back sprint',
        subject: 'Integration review',
        difficulty: 'hard',
        duration: '20 min',
        reason: 'Explaining the concept cements mastery.',
        action: 'Record a 2-minute explanation in your own words.',
      },
    ];
  }

  return [
    {
      id: 'mixed-1',
      title: 'Novel format refresh',
      subject: 'Revision',
      difficulty: 'easy',
      duration: '15 min',
      reason: 'Boredom responds well to short variety.',
      action: 'Use a quiz or rapid-fire oral recall round.',
    },
    {
      id: 'mixed-2',
      title: 'Timed micro-test',
      subject: 'Focus rebuild',
      difficulty: 'medium',
      duration: '20 min',
      reason: 'Adds challenge without creating a long session.',
      action: 'Complete one timed set and stop for a reset.',
    },
  ];
};

export const getNotificationMessage = (stressScore: number, velocity: VelocityState) => {
  if (stressScore >= 75) {
    return 'Upcoming high-risk week detected. Reduce load, sleep earlier, and flag counselor support.';
  }

  if (velocity === 'declining' || velocity === 'critical') {
    return 'Stress alert: your emotional trend is dipping. Shift to lighter tasks tonight.';
  }

  return 'You are in a manageable zone. Keep the routine consistent to preserve progress.';
};

export const getReadinessScore = (stressScore: number, affectiveState: AffectiveState) => {
  const base = 100 - stressScore;
  const affectiveBonus =
    affectiveState === 'curiosity' ? 12 : affectiveState === 'confusion' ? 2 : affectiveState === 'boredom' ? -4 : -10;

  return clamp(base + affectiveBonus, 0, 100);
};

export const getRecommendedIntensity = (readinessScore: number) => {
  if (readinessScore >= 70) return 'High Focus';
  if (readinessScore >= 45) return 'Balanced Pace';
  return 'Recovery Mode';
};

export const getRescuePlan = (
  affectiveState: AffectiveState,
  stressScore: number,
  recommendedIntensity: string
): RescuePlanStep[] => {
  if (affectiveState === 'frustration' || stressScore >= 70) {
    return [
      {
        id: 'rescue-reset',
        title: 'Reset your breathing and posture',
        duration: '5 min',
        description: 'Step away from the task, loosen your shoulders, and do one calm breathing cycle before restarting.',
        type: 'reset',
      },
      {
        id: 'rescue-light',
        title: 'Do one easy recall round',
        duration: '10 min',
        description: 'Pick the easiest topic available and answer short recall prompts to restore movement.',
        type: 'light',
      },
      {
        id: 'rescue-guided',
        title: 'Follow one worked example',
        duration: '10 min',
        description: 'Study one solved example line by line rather than forcing full independent problem solving.',
        type: 'guided',
      },
      {
        id: 'rescue-close',
        title: 'End with one win',
        duration: '5 min',
        description: 'Write one thing you understood better today and stop before overload returns.',
        type: 'confidence',
      },
    ];
  }

  if (affectiveState === 'confusion') {
    return [
      {
        id: 'rescue-map',
        title: 'Map the concept',
        duration: '8 min',
        description: 'Draw the topic and its 3 or 4 sub-parts to reduce mental clutter.',
        type: 'guided',
      },
      {
        id: 'rescue-explain',
        title: 'Explain one part in plain words',
        duration: '7 min',
        description: 'Use simple language as if teaching a classmate with no background.',
        type: 'confidence',
      },
      {
        id: 'rescue-practice',
        title: 'Try two guided questions',
        duration: '10 min',
        description: 'Attempt small practice items with notes open so confusion turns into structure.',
        type: 'guided',
      },
      {
        id: 'rescue-review',
        title: 'Review what still feels unclear',
        duration: '5 min',
        description: 'List the exact points you should revisit next instead of carrying vague confusion forward.',
        type: 'reset',
      },
    ];
  }

  if (affectiveState === 'curiosity' && recommendedIntensity === 'High Focus') {
    return [
      {
        id: 'rescue-focus',
        title: 'Warm up with fast recall',
        duration: '5 min',
        description: 'Activate the topic with a short memory jog before deep work.',
        type: 'reset',
      },
      {
        id: 'rescue-deep',
        title: 'Do one challenge problem',
        duration: '15 min',
        description: 'Use your higher energy for one meaningful stretch task.',
        type: 'guided',
      },
      {
        id: 'rescue-teach',
        title: 'Teach back the idea',
        duration: '5 min',
        description: 'Say the concept out loud or record a short summary in your own words.',
        type: 'confidence',
      },
      {
        id: 'rescue-next',
        title: 'Queue the next topic',
        duration: '5 min',
        description: 'Capture your next step while your momentum is still strong.',
        type: 'light',
      },
    ];
  }

  return [
    {
      id: 'rescue-arrive',
      title: 'Arrive slowly',
      duration: '5 min',
      description: 'Clear distractions, sip water, and decide on a very small goal for the next half hour.',
      type: 'reset',
    },
    {
      id: 'rescue-recall',
      title: 'Do a light revision pass',
      duration: '10 min',
      description: 'Use short notes, flashcards, or oral recall to re-enter study mode without strain.',
      type: 'light',
    },
    {
      id: 'rescue-guided-core',
      title: 'Spend time on one guided task',
      duration: '10 min',
      description: 'Work through one medium-effort task with structure instead of trying to cover everything.',
      type: 'guided',
    },
    {
      id: 'rescue-finish',
      title: 'Close with one confidence note',
      duration: '5 min',
      description: 'Write what you completed and what the next best step should be when you return.',
      type: 'confidence',
    },
  ];
};

export const getCounselorStudents = () => counselorStudentsSeed;
