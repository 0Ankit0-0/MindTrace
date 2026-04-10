import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

import {
  ChatMode,
  comfortRecordings,
  JournalEntry,
  MoodEmoji,
  PressureLevel,
  SleepTiming,
  chatStarters,
  journalEntriesSeed,
  onboardingQuestions,
} from '@/constants/DummyData';
import {
  CheckInPayload,
  buildMoodHistory,
  calculateStressScore,
  getAffectiveState,
  getNotificationMessage,
  getReadinessScore,
  getRecommendedIntensity,
  getRescuePlan,
  getStressStatus,
  getStudyPlan,
  getVelocityState,
} from '@/services/mindtrace-engine';

type ChatMessage = {
  id: string;
  role: 'bot' | 'user';
  text: string;
};

type AuthUser = {
  fullName: string;
  email: string;
};

type MindTraceContextValue = {
  moodScore: number;
  emoji: MoodEmoji;
  sleepTiming: SleepTiming;
  examPressure: PressureLevel;
  brainDump: string;
  stressScore: number;
  stressStatus: string;
  velocity: 'recovering' | 'stable' | 'declining' | 'critical';
  affectiveState: 'curiosity' | 'confusion' | 'frustration' | 'boredom';
  moodHistory: { day: string; score: number }[];
  studyPlan: ReturnType<typeof getStudyPlan>;
  notification: string;
  readinessScore: number;
  recommendedIntensity: string;
  rescuePlan: ReturnType<typeof getRescuePlan>;
  rescueCompletionRate: number;
  completedRescueStepIds: string[];
  completionRate: number;
  completedTopicIds: string[];
  nextStudyTopic: ReturnType<typeof getStudyPlan>[number] | null;
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
  onboardingCompleted: boolean;
  authUser: AuthUser | null;
  updateDraft: (input: Partial<CheckInPayload>) => void;
  submitCheckIn: () => void;
  setChatMode: (mode: ChatMode) => void;
  sendChatMessage: (message: string) => void;
  rateChat: (rating: number) => void;
  toggleTopicCompletion: (topicId: string) => void;
  toggleRescueStepCompletion: (stepId: string) => void;
  updateProfile: (
    field:
      | 'fullName'
      | 'institution'
      | 'program'
      | 'semester'
      | 'examWindow'
      | 'sleepGoal'
      | 'studyPreference'
      | 'stressTrigger'
      | 'supportStyle',
    value: string
  ) => void;
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
  signIn: (email: string, password: string) => boolean;
  signUp: (fullName: string, email: string, password: string) => boolean;
  signOut: () => void;
};

const initialPayload: CheckInPayload = {
  moodScore: 6,
  emoji: 'steady',
  sleepTiming: 'uneven',
  examPressure: 'medium',
  brainDump: '',
};

const createDerivedState = (payload: CheckInPayload) => {
  const stressScore = calculateStressScore(payload);
  const moodHistory = buildMoodHistory(payload.moodScore);
  const velocity = getVelocityState(moodHistory, stressScore);
  const affectiveState = getAffectiveState(payload);
  const studyPlan = getStudyPlan(affectiveState);
  const notification = getNotificationMessage(stressScore, velocity);
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

const createWelcomeMessages = (mode: ChatMode): ChatMessage[] =>
  chatStarters[mode].map((text, index) => ({
    id: `${mode}-${index}`,
    role: 'bot',
    text,
  }));

const MindTraceContext = createContext<MindTraceContextValue | null>(null);

export function MindTraceProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<CheckInPayload>(initialPayload);
  const [committed, setCommitted] = useState<CheckInPayload>(initialPayload);
  const [chatMode, setChatModeState] = useState<ChatMode>('listener');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(createWelcomeMessages('listener'));
  const [lastChatRating, setLastChatRating] = useState<number | null>(4);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
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

  const derived = useMemo(() => createDerivedState(committed), [committed]);
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

  const signIn = (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password.trim()) {
      return false;
    }

    setAuthUser({
      fullName: studentProfile.fullName || studentProfile.name,
      email: normalizedEmail,
    });
    return true;
  };

  const signUp = (fullName: string, email: string, password: string) => {
    const normalizedName = fullName.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedName || !normalizedEmail || password.trim().length < 6) {
      return false;
    }

    setAuthUser({
      fullName: normalizedName,
      email: normalizedEmail,
    });
    setStudentProfile((current) => ({
      ...current,
      fullName: normalizedName,
      name: normalizedName,
    }));
    setOnboardingCompleted(false);
    return true;
  };

  const signOut = () => {
    setAuthUser(null);
  };

  const submitCheckIn = () => {
    setCommitted(draft);
    setCompletedTopicIds([]);
    setCompletedRescueStepIds([]);
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

    const responseBank: Record<ChatMode, string> = {
      listener: 'That sounds like a lot to carry. Let us name the toughest part first, then we can lighten the plan.',
      laugh: 'Emergency comedy intervention: your syllabus is not a villain origin story, even if it is trying its best.',
      brainstorm: 'Here is a gentle next move: pick one concept, one worked example, and one short recall round.',
    };

    setChatMessages((current) => [
      ...current,
      { id: `user-${Date.now()}`, role: 'user', text: trimmed },
      { id: `bot-${Date.now() + 1}`, role: 'bot', text: responseBank[chatMode] },
    ]);
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
      onboardingCompleted,
      authUser,
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
    }),
    [
      activeComfortRecordingId,
      authUser,
      chatMessages,
      chatMode,
      completedRescueStepIds,
      completedTopicIds,
      completionRate,
      derived,
      draft,
      journalEntries,
      lastChatRating,
      nextStudyTopic,
      onboardingCompleted,
      rescueCompletionRate,
      studentProfile,
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
