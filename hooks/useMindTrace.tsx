import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

import {
  AdaptationEvent,
  AffectiveState,
  ChatMode,
  comfortRecordings,
  JournalEntry,
  MoodEmoji,
  PressureLevel,
  StudyTopic,
  SleepTiming,
  TestAnswer,
  TestDifficulty,
  TestQuestion,
  TestSession,
  TestTopic,
  chatStarters,
  journalEntriesSeed,
  moodHistorySeed,
  onboardingQuestions,
  testQuestionBank,
} from '@/constants/DummyData';
import {
  CheckInPayload,
  getAdaptiveDifficulty,
  getAffectiveState,
  getNotificationMessage,
  getReadinessScore,
  getRecommendedIntensity,
  getRescuePlan,
  getStressStatus,
  getVelocityState,
} from '@/services/mindtrace-engine';
import { calculateTestResults } from '@/services/test-analytics';
import {
  AnalyzeSessionResponse,
  AnalyzeResponse,
  ApiError,
  CheckinResponse,
  analyze,
  analyzeSession as analyzeTestSession,
  analyzeBrainDump,
  createCheckin,
  GamificationStatusResponse,
  getGamificationStatus,
  getCheckinHistory,
  getAiChatReply,
  getMe,
  getStudyPlan as getBackendStudyPlan,
  login,
  register,
} from '@/services/mindtrace-api';

type ChatMessage = {
  id: string;
  role: 'bot' | 'user';
  text: string;
};

type AuthUser = {
  fullName: string;
  email: string;
};

type ProfileField =
  | 'fullName'
  | 'institution'
  | 'program'
  | 'semester'
  | 'examWindow'
  | 'sleepGoal'
  | 'studyPreference'
  | 'stressTrigger'
  | 'supportStyle';

type MindTraceContextValue = {
  moodScore: number;
  emoji: MoodEmoji;
  sleepTiming: SleepTiming;
  examPressure: PressureLevel;
  brainDump: string;
  stressScore: number;
  stressStatus: string;
  velocity: 'recovering' | 'stable' | 'declining' | 'critical';
  affectiveState: AffectiveState;
  moodHistory: { day: string; score: number }[];
  studyPlan: StudyTopic[];
  notification: string;
  readinessScore: number;
  recommendedIntensity: string;
  rescuePlan: ReturnType<typeof getRescuePlan>;
  rescueCompletionRate: number;
  completedRescueStepIds: string[];
  completionRate: number;
  completedTopicIds: string[];
  nextStudyTopic: StudyTopic | null;
  studentProfile: {
    name: string;
    cohort: string;
    streakDays: number;
    focusMinutes: number;
    fullName: string;
    institution: string;
    program: string;
    semester: string;
    examWindow: string;
    sleepGoal: string;
    studyPreference: string;
    stressTrigger: string;
    supportStyle: string;
  };
  onboardingQuestions: typeof onboardingQuestions;
  comfortRecordings: typeof comfortRecordings;
  activeComfortRecordingId: string | null;
  chatMode: ChatMode;
  chatMessages: ChatMessage[];
  lastChatRating: number | null;
  journalEntries: JournalEntry[];
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  isSubmittingCheckIn: boolean;
  onboardingCompleted: boolean;
  authUser: AuthUser | null;
  syncError: string | null;
  gamificationStatus: GamificationStatusResponse | null;
  latestSessionAnalysis: AnalyzeSessionResponse | null;
  isAnalyzingSession: boolean;
  testHistory: TestSession[];
  activeTestSession: TestSession | null;
  updateDraft: (input: Partial<CheckInPayload>) => void;
  submitCheckIn: () => Promise<boolean>;
  setChatMode: (mode: ChatMode) => void;
  sendChatMessage: (message: string) => void;
  rateChat: (rating: number) => void;
  toggleTopicCompletion: (topicId: string) => void;
  toggleRescueStepCompletion: (stepId: string) => void;
  updateProfile: (field: ProfileField, value: string) => void;
  playComfortRecording: (recordingId: string) => void;
  addJournalEntry: (entry: { title: string; body: string; mood: JournalEntry['mood']; tags: string[] }) => void;
  updateJournalEntry: (
    entryId: string,
    updates: Partial<Pick<JournalEntry, 'title' | 'body' | 'mood' | 'tags'>>
  ) => void;
  deleteJournalEntry: (entryId: string) => void;
  toggleJournalPin: (entryId: string) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (fullName: string, email: string, password: string) => Promise<boolean>;
  signOut: () => void;
  startTest: (topic: TestTopic | 'mixed', difficulty: TestDifficulty, questionCount: number, adaptive: boolean) => void;
  submitTestAnswer: (questionId: string, selectedIndex: number, timeTaken: number) => void;
  finishTest: () => void;
};

const initialPayload: CheckInPayload = {
  moodScore: 6,
  emoji: 'steady',
  sleepTiming: 'uneven',
  examPressure: 'medium',
  brainDump: '',
};

const createWelcomeMessages = (mode: ChatMode): ChatMessage[] =>
  chatStarters[mode].map((text, index) => ({
    id: `${mode}-${index}`,
    role: 'bot',
    text,
  }));

const localChatResponses: Record<ChatMode, string> = {
  listener:
    'That sounds like a lot to carry. Let us name the toughest part first, then we can lighten the plan.',
  laugh:
    'Emergency comedy intervention: your syllabus is not a villain origin story, even if it is trying its best.',
  brainstorm:
    'Here is a gentle next move: pick one concept, one worked example, and one short recall round.',
};

const affectiveStateToSessionMood = (state: AffectiveState) => {
  switch (state) {
    case 'frustration':
      return 'stressed';
    case 'confusion':
      return 'stressed';
    case 'boredom':
      return 'sad';
    default:
      return 'steady';
  }
};

const moodToTags = (payload: CheckInPayload) => {
  const tags = new Set<string>();
  const note = payload.brainDump.toLowerCase();

  if (
    payload.emoji === 'tense' ||
    payload.emoji === 'drained' ||
    payload.examPressure === 'high' ||
    payload.moodScore <= 4 ||
    ['panic', 'overwhelmed', 'burnout', 'stress', 'stressed', 'anxious'].some((word) => note.includes(word))
  ) {
    tags.add('stressed');
  }

  if (
    payload.moodScore <= 3 ||
    ['sad', 'down', 'lonely', 'empty', 'hopeless'].some((word) => note.includes(word))
  ) {
    tags.add('sad');
  }

  return Array.from(tags);
};

const sleepTimingToHours = (sleepTiming: SleepTiming) => {
  switch (sleepTiming) {
    case 'late':
      return 5;
    case 'steady':
      return 8;
    default:
      return 7;
  }
};

const hoursToSleepTiming = (sleep: number): SleepTiming => {
  if (sleep < 6) {
    return 'late';
  }

  if (sleep >= 8) {
    return 'steady';
  }

  return 'uneven';
};

const serializeMoodPayload = (
  payload: CheckInPayload,
  aiInsights?: {
    summary: string;
    stressSignals: string[];
    affectiveState: string;
    suggestedAction: string;
    provider: 'gemini' | 'local';
  },
) =>
  JSON.stringify({
    emoji: payload.emoji,
    score: payload.moodScore,
    pressure: payload.examPressure,
    note: payload.brainDump.trim(),
    tags: moodToTags(payload),
    aiSummary: aiInsights?.summary,
    aiSignals: aiInsights?.stressSignals,
    aiAffectiveState: aiInsights?.affectiveState,
    aiSuggestedAction: aiInsights?.suggestedAction,
    aiProvider: aiInsights?.provider,
  });

const parseMoodPayload = (mood: string, sleep: number): CheckInPayload => {
  try {
    const parsed = JSON.parse(mood) as {
      emoji?: MoodEmoji;
      note?: string;
      pressure?: PressureLevel;
      score?: number;
    };

    return {
      moodScore: parsed.score && parsed.score >= 1 && parsed.score <= 10 ? parsed.score : initialPayload.moodScore,
      emoji: parsed.emoji || initialPayload.emoji,
      sleepTiming: hoursToSleepTiming(sleep),
      examPressure: parsed.pressure || initialPayload.examPressure,
      brainDump: parsed.note || '',
    };
  } catch {
    return {
      ...initialPayload,
      sleepTiming: hoursToSleepTiming(sleep),
      brainDump: mood,
    };
  }
};

const formatHistory = (checkins: CheckinResponse[]) => {
  if (!checkins.length) {
    return moodHistorySeed;
  }

  const recent = [...checkins].slice(0, 7).reverse();
  const derivedHistory = recent.map((entry) => {
    const parsed = parseMoodPayload(entry.mood, entry.sleep);

    return {
      day: new Date(entry.timestamp).toLocaleDateString('en-US', { weekday: 'short' }),
      score: parsed.moodScore,
    };
  });

  if (derivedHistory.length >= 7) {
    return derivedHistory;
  }

  return [...moodHistorySeed.slice(0, 7 - derivedHistory.length), ...derivedHistory];
};

const mapBackendStudyPlan = (
  response: { plan: string[]; state: 'stable' | 'declining' | 'critical' } | null
): StudyTopic[] => {
  if (!response) {
    return [
      {
        id: 'placeholder-1',
        title: 'Take your first check-in',
        subject: 'Pulse',
        difficulty: 'easy',
        duration: '2 min',
        reason: 'Your first backend study plan appears after you save a pulse check-in.',
        action: 'Open Pulse, submit a check-in, and MindTrace will refresh your study path.',
      },
    ];
  }

  const difficultyByState = {
    stable: 'medium',
    declining: 'easy',
    critical: 'easy',
  } as const;

  const subjectByState = {
    stable: 'Focused Study',
    declining: 'Gentle Recovery',
    critical: 'Recovery First',
  } as const;

  const durationByState = {
    stable: ['45 min', '35 min', '20 min'],
    declining: ['25 min', '10 min', '20 min'],
    critical: ['10 min', '20 min', '15 min'],
  } as const;

  return response.plan.map((step, index) => ({
    id: `plan-${response.state}-${index + 1}`,
    title: `Step ${index + 1}`,
    subject: subjectByState[response.state],
    difficulty: difficultyByState[response.state],
    duration: durationByState[response.state][index] || '15 min',
    reason: step,
    action: step,
  }));
};

const createDerivedState = ({
  analysis,
  checkins,
  payload,
  studyPlan,
}: {
  analysis: AnalyzeResponse | null;
  checkins: CheckinResponse[];
  payload: CheckInPayload;
  studyPlan: StudyTopic[];
}) => {
  const stressScore = analysis?.stressScore ?? 50;
  const moodHistory = formatHistory(checkins.length ? checkins : [{ id: 0, mood: serializeMoodPayload(payload), sleep: sleepTimingToHours(payload.sleepTiming), timestamp: new Date().toISOString() }]);
  const velocity = getVelocityState(moodHistory, stressScore);
  const affectiveState = getAffectiveState(payload);
  const notification = analysis?.recommendation ?? getNotificationMessage(stressScore, velocity);
  const readinessScore = getReadinessScore(stressScore, affectiveState);
  const recommendedIntensity = getRecommendedIntensity(readinessScore);
  const rescuePlan = getRescuePlan(affectiveState, stressScore, recommendedIntensity);

  return {
    stressScore,
    stressStatus: getStressStatus(stressScore),
    moodHistory,
    velocity,
    affectiveState,
    studyPlan,
    notification,
    readinessScore,
    recommendedIntensity,
    rescuePlan,
  };
};

const MindTraceContext = createContext<MindTraceContextValue | null>(null);

export function MindTraceProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<CheckInPayload>(initialPayload);
  const [committed, setCommitted] = useState<CheckInPayload>(initialPayload);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [chatMode, setChatModeState] = useState<ChatMode>('listener');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(createWelcomeMessages('listener'));
  const [lastChatRating, setLastChatRating] = useState<number | null>(4);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [serverAnalysis, setServerAnalysis] = useState<AnalyzeResponse | null>(null);
  const [serverCheckins, setServerCheckins] = useState<CheckinResponse[]>([]);
  const [serverStudyPlan, setServerStudyPlan] = useState<StudyTopic[]>(mapBackendStudyPlan(null));
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [isSubmittingCheckIn, setIsSubmittingCheckIn] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [gamificationStatus, setGamificationStatus] = useState<GamificationStatusResponse | null>(null);
  const [latestSessionAnalysis, setLatestSessionAnalysis] = useState<AnalyzeSessionResponse | null>(null);
  const [isAnalyzingSession, setIsAnalyzingSession] = useState(false);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(journalEntriesSeed);
  const [completedTopicIds, setCompletedTopicIds] = useState<string[]>([]);
  const [completedRescueStepIds, setCompletedRescueStepIds] = useState<string[]>([]);
  const [activeComfortRecordingId, setActiveComfortRecordingId] = useState<string | null>('comfort-1');
  const [studentProfile, setStudentProfile] = useState({
    name: 'Riya Kapoor',
    cohort: 'Semester 4 - CSE',
    streakDays: 9,
    focusMinutes: 86,
    fullName: 'Riya Kapoor',
    institution: 'ABC Institute of Technology',
    program: 'B.Tech CSE',
    semester: 'Semester 4',
    examWindow: 'Mid-May 2026',
    sleepGoal: '11:00 PM',
    studyPreference: 'Evening',
    stressTrigger: 'Deadlines and unfinished backlog',
    supportStyle: 'Gentle listening with clear next steps',
  });

  // Test state
  const [testHistory, setTestHistory] = useState<TestSession[]>([]);
  const [activeTestSession, setActiveTestSession] = useState<TestSession | null>(null);

  const derived = useMemo(
    () =>
      createDerivedState({
        analysis: serverAnalysis,
        checkins: serverCheckins,
        payload: committed,
        studyPlan: serverStudyPlan,
      }),
    [committed, serverAnalysis, serverCheckins, serverStudyPlan]
  );
  const completionRate = useMemo(() => {
    if (!derived.studyPlan.length) {
      return 0;
    }

    return Math.round((completedTopicIds.length / derived.studyPlan.length) * 100);
  }, [completedTopicIds.length, derived.studyPlan.length]);
  const rescueCompletionRate = useMemo(() => {
    if (!derived.rescuePlan.length) {
      return 0;
    }

    return Math.round((completedRescueStepIds.length / derived.rescuePlan.length) * 100);
  }, [completedRescueStepIds.length, derived.rescuePlan.length]);
  const nextStudyTopic = useMemo(
    () => derived.studyPlan.find((topic) => !completedTopicIds.includes(topic.id)) ?? derived.studyPlan[0] ?? null,
    [completedTopicIds, derived.studyPlan]
  );

  const updateDraft = (input: Partial<CheckInPayload>) => {
    setDraft((current) => ({ ...current, ...input }));
  };

  const hydrateFromBackend = async (token: string) => {
    const historyResponse = await getCheckinHistory(token);
    const gamificationResponse = await getGamificationStatus(token).catch(() => null);
    const latestCheckin = historyResponse.checkins[0];

    setServerCheckins(historyResponse.checkins);
    setGamificationStatus(gamificationResponse);

    if (!latestCheckin) {
      setCommitted(initialPayload);
      setDraft(initialPayload);
      setServerAnalysis(null);
      setServerStudyPlan(mapBackendStudyPlan(null));
      return;
    }

    const restoredPayload = parseMoodPayload(latestCheckin.mood, latestCheckin.sleep);
    const [analysisResponse, studyPlanResponse] = await Promise.all([
      analyze({
        mood: latestCheckin.mood,
        sleep: latestCheckin.sleep,
      }),
      getBackendStudyPlan(token).catch((error: unknown) => {
        if (error instanceof ApiError && error.status === 404) {
          return null;
        }

        throw error;
      }),
    ]);

    setCommitted(restoredPayload);
    setDraft(restoredPayload);
    setServerAnalysis(analysisResponse);
    setServerStudyPlan(mapBackendStudyPlan(studyPlanResponse));
  };

  useEffect(() => {
    if (!authToken) {
      return;
    }

    hydrateFromBackend(authToken).catch((error: unknown) => {
      setSyncError(error instanceof Error ? error.message : 'Failed to sync with backend');
    });
  }, [authToken]);

  const signIn = async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password.trim()) {
      setSyncError('Enter a valid email and password.');
      return false;
    }

    setIsAuthLoading(true);
    setSyncError(null);

    try {
      const authResponse = await login({ email: normalizedEmail, password });
      const meResponse = await getMe(authResponse.token);

      setAuthToken(authResponse.token);
      setAuthUser({
        fullName: meResponse.user.name,
        email: meResponse.user.email,
      });
      setStudentProfile((current) => ({
        ...current,
        fullName: meResponse.user.name,
        name: meResponse.user.name,
      }));
      setOnboardingCompleted(true);
      return true;
    } catch (error) {
      setSyncError(error instanceof Error ? error.message : 'Unable to sign in');
      return false;
    } finally {
      setIsAuthLoading(false);
    }
  };

  const signUp = async (fullName: string, email: string, password: string) => {
    const normalizedName = fullName.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedName || !normalizedEmail || password.trim().length < 6) {
      setSyncError('Use a full name, valid email, and a password with at least 6 characters.');
      return false;
    }

    setIsAuthLoading(true);
    setSyncError(null);

    try {
      const authResponse = await register({
        name: normalizedName,
        email: normalizedEmail,
        password,
      });
      const meResponse = await getMe(authResponse.token);

      setAuthToken(authResponse.token);
      setAuthUser({
        fullName: meResponse.user.name,
        email: meResponse.user.email,
      });
      setStudentProfile((current) => ({
        ...current,
        fullName: meResponse.user.name,
        name: meResponse.user.name,
      }));
      setOnboardingCompleted(false);
      return true;
    } catch (error) {
      setSyncError(error instanceof Error ? error.message : 'Unable to create account');
      return false;
    } finally {
      setIsAuthLoading(false);
    }
  };

  const signOut = () => {
    setAuthToken(null);
    setAuthUser(null);
    setSyncError(null);
    setGamificationStatus(null);
    setLatestSessionAnalysis(null);
    setIsAnalyzingSession(false);
    setServerAnalysis(null);
    setServerCheckins([]);
    setServerStudyPlan(mapBackendStudyPlan(null));
    setCommitted(initialPayload);
    setDraft(initialPayload);
    setOnboardingCompleted(false);
    setCompletedTopicIds([]);
    setCompletedRescueStepIds([]);
  };

  const submitCheckIn = async () => {
    if (!authToken) {
      setSyncError('Sign in before saving a pulse check-in.');
      return false;
    }

    setIsSubmittingCheckIn(true);
    setSyncError(null);

    const sleep = sleepTimingToHours(draft.sleepTiming);

    try {
      const brainDumpInsights =
        draft.brainDump.trim().length > 0
          ? await analyzeBrainDump(authToken, {
              text: draft.brainDump,
              mood: draft.emoji,
              sleep,
            }).catch(() => null)
          : null;
      const mood = serializeMoodPayload(draft, brainDumpInsights || undefined);

      await createCheckin(authToken, { mood, sleep });

      const [historyResponse, analysisResponse, studyPlanResponse] = await Promise.all([
        getCheckinHistory(authToken),
        analyze({ mood, sleep }),
        getBackendStudyPlan(authToken),
      ]);

      setCommitted(draft);
      setServerCheckins(historyResponse.checkins);
      setServerAnalysis(analysisResponse);
      setServerStudyPlan(mapBackendStudyPlan(studyPlanResponse));
      setCompletedTopicIds([]);
      setCompletedRescueStepIds([]);
      return true;
    } catch (error) {
      setSyncError(error instanceof Error ? error.message : 'Unable to save pulse');
      return false;
    } finally {
      setIsSubmittingCheckIn(false);
    }
  };

  const setChatMode = (mode: ChatMode) => {
    setChatModeState(mode);
    setChatMessages(createWelcomeMessages(mode));
  };

  const sendChatMessage = (message: string) => {
    const trimmed = message.trim();

    if (!trimmed) {
      return;
    }
    const userMessageId = `user-${Date.now()}`;

    setChatMessages((current) => [...current, { id: userMessageId, role: 'user', text: trimmed }]);

    const appendBotReply = (text: string) => {
      setChatMessages((current) => [...current, { id: `bot-${Date.now()}`, role: 'bot', text }]);
    };

    if (!authToken) {
      appendBotReply(localChatResponses[chatMode]);
      return;
    }

    void getAiChatReply(authToken, {
      message: trimmed,
      mode: chatMode,
      affectiveState: derived.affectiveState,
      stressScore: derived.stressScore,
      name: studentProfile.name,
    })
      .then((response) => {
        appendBotReply(response.reply || localChatResponses[chatMode]);
      })
      .catch(() => {
        appendBotReply(localChatResponses[chatMode]);
      });
  };

  // ── Test methods ────────────────────────────────────────────────────────

  const startTest = (
    topic: TestTopic | 'mixed',
    difficulty: TestDifficulty,
    questionCount: number,
    _adaptive: boolean
  ) => {
    const newSession: TestSession = {
      id: Date.now().toString(),
      topic,
      startedAt: new Date().toISOString(),
      finishedAt: null,
      affectiveStateAtStart: derived.affectiveState,
      stressScoreAtStart: derived.stressScore,
      answers: [],
      adaptationEvents: [],
      finalScore: null,
      weakTopics: [],
      peakDifficulty: difficulty,
    };
    setActiveTestSession(newSession);
  };

  const submitTestAnswer = (questionId: string, selectedIndex: number, timeTaken: number) => {
    setActiveTestSession((current) => {
      if (!current) return null;
      const question = testQuestionBank.find((q) => q.id === questionId);
      if (!question) return current;

      const correct = selectedIndex === question.correctIndex;
      const newAnswer: TestAnswer = {
        questionId,
        selectedIndex,
        correct,
        timeTakenSeconds: timeTaken,
        difficulty: question.difficulty,
        topic: question.topic,
      };
      const allAnswers = [...current.answers, newAnswer];

      // Count consecutive wrong/correct from the end
      let consWrong = 0;
      let consCorrect = 0;
      for (let i = allAnswers.length - 1; i >= 0; i--) {
        if (!allAnswers[i].correct) consWrong++;
        else break;
      }
      for (let i = allAnswers.length - 1; i >= 0; i--) {
        if (allAnswers[i].correct) consCorrect++;
        else break;
      }

      const { newDifficulty, event } = getAdaptiveDifficulty(question.difficulty, consWrong, consCorrect);

      const newEvents: AdaptationEvent[] = event
        ? [
            ...current.adaptationEvents,
            {
              atQuestion: allAnswers.length,
              fromDifficulty: question.difficulty,
              toDifficulty: newDifficulty,
              reason: event,
            },
          ]
        : current.adaptationEvents;

      const diffOrder: TestDifficulty[] = ['easy', 'medium', 'hard'];
      const peakDifficulty: TestDifficulty =
        diffOrder.indexOf(newDifficulty) > diffOrder.indexOf(current.peakDifficulty)
          ? newDifficulty
          : current.peakDifficulty;

      return { ...current, answers: allAnswers, adaptationEvents: newEvents, peakDifficulty };
    });
  };

  const finishTest = () => {
    if (!activeTestSession) return;

    const results = calculateTestResults(
      activeTestSession.answers,
      activeTestSession.stressScoreAtStart,
      activeTestSession.affectiveStateAtStart
    );

    const finished: TestSession = {
      ...activeTestSession,
      finishedAt: new Date().toISOString(),
      finalScore: results.score,
      weakTopics: results.weakTopics,
      peakDifficulty: results.peakDifficulty,
    };

    setTestHistory((prev) => [finished, ...prev]);
    setActiveTestSession(null);

    if (!authToken) {
      return;
    }

    setIsAnalyzingSession(true);
    setLatestSessionAnalysis(null);

    void analyzeTestSession(authToken, {
      answers: finished.answers.map((answer) => answer.correct),
      responseTimes: finished.answers.map((answer) => answer.timeTakenSeconds * 1000),
      mood: affectiveStateToSessionMood(finished.affectiveStateAtStart),
      sleep: sleepTimingToHours(committed.sleepTiming),
    })
      .then((response) => {
        setLatestSessionAnalysis(response);
        setGamificationStatus(response.gamification);
      })
      .catch((error) => {
        setSyncError(error instanceof Error ? error.message : 'Unable to analyze session');
      })
      .finally(() => {
        setIsAnalyzingSession(false);
      });
  };

  const value = useMemo<MindTraceContextValue>(
    () => ({
      ...draft,
      ...derived,
      rescueCompletionRate,
      completedRescueStepIds,
      completionRate,
      completedTopicIds,
      nextStudyTopic,
      studentProfile,
      onboardingQuestions,
      comfortRecordings,
      activeComfortRecordingId,
      chatMode,
      chatMessages,
      lastChatRating,
      journalEntries,
      isAuthenticated: Boolean(authUser),
      isAuthLoading,
      isSubmittingCheckIn,
      onboardingCompleted,
      authUser,
      syncError,
      gamificationStatus,
      latestSessionAnalysis,
      isAnalyzingSession,
      testHistory,
      activeTestSession,
      updateDraft,
      submitCheckIn,
      setChatMode,
      sendChatMessage,
      rateChat: setLastChatRating,
      toggleTopicCompletion: (topicId: string) =>
        setCompletedTopicIds((current) =>
          current.includes(topicId) ? current.filter((id) => id !== topicId) : [...current, topicId]
        ),
      toggleRescueStepCompletion: (stepId: string) =>
        setCompletedRescueStepIds((current) =>
          current.includes(stepId) ? current.filter((id) => id !== stepId) : [...current, stepId]
        ),
      updateProfile: (field, value) =>
        setStudentProfile((current) => ({
          ...current,
          [field]: value,
          name: field === 'fullName' ? value || current.name : current.name,
          cohort:
            field === 'semester' || field === 'program'
              ? `${field === 'semester' ? value || current.semester : current.semester} - ${
                  field === 'program' ? value || current.program : current.program
                }`
              : current.cohort,
        })),
      playComfortRecording: setActiveComfortRecordingId,
      addJournalEntry: ({ title, body, mood, tags }) =>
        setJournalEntries((current) => [
          {
            id: `journal-${Date.now()}`,
            title: title.trim() || 'Untitled reflection',
            body: body.trim(),
            mood,
            tags,
            createdAt: 'Just now',
          },
          ...current,
        ]),
      updateJournalEntry: (entryId, updates) =>
        setJournalEntries((current) =>
          current.map((entry) => (entry.id === entryId ? { ...entry, ...updates } : entry))
        ),
      deleteJournalEntry: (entryId) =>
        setJournalEntries((current) => current.filter((entry) => entry.id !== entryId)),
      toggleJournalPin: (entryId) =>
        setJournalEntries((current) =>
          current.map((entry) => (entry.id === entryId ? { ...entry, pinned: !entry.pinned } : entry))
        ),
      completeOnboarding: () => setOnboardingCompleted(true),
      resetOnboarding: () => setOnboardingCompleted(false),
      signIn,
      signUp,
      signOut,
      startTest,
      submitTestAnswer,
      finishTest,
    }),
    [
      activeComfortRecordingId,
      activeTestSession,
      authUser,
      chatMessages,
      chatMode,
      completedRescueStepIds,
      completedTopicIds,
      completionRate,
      derived,
      draft,
      isAuthLoading,
      isSubmittingCheckIn,
      journalEntries,
      lastChatRating,
      latestSessionAnalysis,
      nextStudyTopic,
      onboardingCompleted,
      rescueCompletionRate,
      syncError,
      gamificationStatus,
      isAnalyzingSession,
      studentProfile,
      testHistory,
    ]
  );

  return <MindTraceContext.Provider value={value}>{children}</MindTraceContext.Provider>;
}

export function useMindTrace() {
  const context = useContext(MindTraceContext);

  if (!context) {
    throw new Error('useMindTrace must be used within MindTraceProvider');
  }

  return context;
}
