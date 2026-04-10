export type MoodEmoji = 'drained' | 'tense' | 'steady' | 'bright';
export type SleepTiming = 'late' | 'uneven' | 'steady';
export type PressureLevel = 'low' | 'medium' | 'high';
export type VelocityState = 'recovering' | 'stable' | 'declining' | 'critical';
export type AffectiveState = 'curiosity' | 'confusion' | 'frustration' | 'boredom';
export type ChatMode = 'listener' | 'laugh' | 'brainstorm';

export type MoodLog = {
  day: string;
  score: number;
};

export type StudyTopic = {
  id: string;
  title: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: string;
  reason: string;
  action: string;
};

export type StudentSnapshot = {
  id: string;
  name: string;
  className: string;
  stressScore: number;
  stressStatus: 'green' | 'yellow' | 'red';
  velocity: VelocityState;
  affectiveState: AffectiveState;
  trend: 'up' | 'down' | 'flat';
  lastCheckIn: string;
};

export type PromoBanner = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  cta: string;
};

export type OnboardingQuestion = {
  id: string;
  label: string;
  helper: string;
  placeholder: string;
};

export type ComfortRecording = {
  id: string;
  title: string;
  from: string;
  tag: 'lonely' | 'anxious' | 'before_exam' | 'sleep';
  duration: string;
  note: string;
  image: string;
};

export type RescuePlanStep = {
  id: string;
  title: string;
  duration: string;
  description: string;
  type: 'reset' | 'light' | 'guided' | 'confidence';
};

export type JournalEntry = {
  id: string;
  title: string;
  body: string;
  mood: 'happy' | 'calm' | 'neutral' | 'sad' | 'stressed' | 'anxious';
  tags: string[];
  createdAt: string;
  pinned?: boolean;
};

export const moodOptions: { key: MoodEmoji; label: string; emoji: string; helper: string }[] = [
  { key: 'drained', label: 'Drained', emoji: '😞', helper: 'Low energy, needs relief' },
  { key: 'tense', label: 'Tense', emoji: '😣', helper: 'Anxious or overwhelmed' },
  { key: 'steady', label: 'Steady', emoji: '🙂', helper: 'Ready for guided progress' },
  { key: 'bright', label: 'Bright', emoji: '😄', helper: 'Motivated and curious' },
];

export const sleepOptions: { key: SleepTiming; label: string; impact: number; note: string }[] = [
  { key: 'late', label: 'Past 1 AM', impact: 28, note: 'Sleep debt risk' },
  { key: 'uneven', label: 'Irregular', impact: 16, note: 'Recovery is inconsistent' },
  { key: 'steady', label: 'Before 11 PM', impact: 4, note: 'Recovery is protected' },
];

export const examPressureOptions: { key: PressureLevel; label: string; impact: number }[] = [
  { key: 'low', label: 'Low', impact: 10 },
  { key: 'medium', label: 'Medium', impact: 22 },
  { key: 'high', label: 'High', impact: 36 },
];

export const moodHistorySeed: MoodLog[] = [
  { day: 'Mon', score: 4 },
  { day: 'Tue', score: 5 },
  { day: 'Wed', score: 5 },
  { day: 'Thu', score: 6 },
  { day: 'Fri', score: 5 },
  { day: 'Sat', score: 7 },
  { day: 'Sun', score: 8 },
];

export const chatStarters: Record<ChatMode, string[]> = {
  listener: [
    'You do not need to solve everything tonight. What is weighing on you most right now?',
    'I am here to listen. Was today more draining, more confusing, or more frustrating?',
  ],
  laugh: [
    'Mini reset: if your textbook were a person, what annoying habit would it definitely have?',
    'Mood boost mode on. Want a silly one-liner, a campus joke, or a ridiculous study analogy?',
  ],
  brainstorm: [
    'Let us unpack the task together. What topic feels stuck, and what is the smallest next step?',
    'We can turn this into a tiny plan. Tell me the subject and your exam date.',
  ],
};

export const counselorStudentsSeed: StudentSnapshot[] = [
  {
    id: 'stu-01',
    name: 'Aarav Menon',
    className: 'B.Tech CSE',
    stressScore: 84,
    stressStatus: 'red',
    velocity: 'critical',
    affectiveState: 'frustration',
    trend: 'up',
    lastCheckIn: '20 min ago',
  },
  {
    id: 'stu-02',
    name: 'Diya Shah',
    className: 'BBA',
    stressScore: 63,
    stressStatus: 'yellow',
    velocity: 'declining',
    affectiveState: 'confusion',
    trend: 'up',
    lastCheckIn: '1 hr ago',
  },
  {
    id: 'stu-03',
    name: 'Karan Iyer',
    className: 'B.Des',
    stressScore: 41,
    stressStatus: 'green',
    velocity: 'recovering',
    affectiveState: 'curiosity',
    trend: 'down',
    lastCheckIn: 'Today 7:45 PM',
  },
  {
    id: 'stu-04',
    name: 'Sara Khan',
    className: 'MBBS',
    stressScore: 55,
    stressStatus: 'yellow',
    velocity: 'stable',
    affectiveState: 'boredom',
    trend: 'flat',
    lastCheckIn: 'Today 6:10 PM',
  },
];

export const promoBanners: PromoBanner[] = [
  {
    id: 'promo-1',
    title: 'Exam Calm Sprint',
    subtitle: 'A guided reset campaign for high-pressure academic weeks.',
    image: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=900&q=80',
    cta: 'Explore campaign',
  },
  {
    id: 'promo-2',
    title: 'Sleep Recovery Week',
    subtitle: 'Promote healthier sleep rhythms before your next evaluation block.',
    image: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?auto=format&fit=crop&w=900&q=80',
    cta: 'View wellbeing tips',
  },
];

export const onboardingQuestions: OnboardingQuestion[] = [
  {
    id: 'fullName',
    label: 'What is your full name?',
    helper: 'Used for personalization and counselor-facing identification.',
    placeholder: 'Riya Kapoor',
  },
  {
    id: 'institution',
    label: 'Which institution are you studying at?',
    helper: 'Helps contextualize academic rhythm, semester structure, and support workflows.',
    placeholder: 'ABC Institute of Technology',
  },
  {
    id: 'program',
    label: 'What is your course, branch, or program?',
    helper: 'Used to shape the study-plan language and learning context.',
    placeholder: 'B.Tech CSE',
  },
  {
    id: 'semester',
    label: 'Which semester, year, or academic stage are you in?',
    helper: 'Lets the app estimate expected academic load and exam pressure.',
    placeholder: 'Semester 4',
  },
  {
    id: 'examWindow',
    label: 'When is your next major exam or evaluation period?',
    helper: 'Used for high-risk week warnings and adaptive workload pacing.',
    placeholder: 'Mid-May 2026',
  },
  {
    id: 'sleepGoal',
    label: 'What sleep target do you want to maintain on most nights?',
    helper: 'Used to compare stress trends against desired recovery behavior.',
    placeholder: '11:00 PM',
  },
  {
    id: 'studyPreference',
    label: 'When do you usually study best?',
    helper: 'Helps time future nudges and recommended work blocks.',
    placeholder: 'Early morning or evening',
  },
  {
    id: 'stressTrigger',
    label: 'What usually increases your stress the most?',
    helper: 'Improves the quality of support prompts and counselor context.',
    placeholder: 'Deadlines, backlog, low sleep',
  },
  {
    id: 'supportStyle',
    label: 'What type of support helps you most when stressed?',
    helper: 'Shapes the tone of chatbot and recovery suggestions.',
    placeholder: 'Gentle listening, humor, clear action steps',
  },
];

export const comfortRecordings: ComfortRecording[] = [
  {
    id: 'comfort-1',
    title: 'You are not alone tonight',
    from: 'Mom',
    tag: 'lonely',
    duration: '0:42',
    note: 'A grounding note for evenings that feel heavy or quiet.',
    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'comfort-2',
    title: 'Before your exam, breathe first',
    from: 'Dad',
    tag: 'before_exam',
    duration: '0:35',
    note: 'Use this right before revision or entering the exam hall.',
    image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'comfort-3',
    title: 'It is okay to pause',
    from: 'Best Friend',
    tag: 'anxious',
    duration: '0:51',
    note: 'A softer message for anxiety spikes and spiraling thoughts.',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80',
  },
];

export const journalEntriesSeed: JournalEntry[] = [
  {
    id: 'journal-1',
    title: 'Felt better after breaking things down',
    body: 'I was spiraling about tomorrow, but once I wrote down the three topics left, it felt more manageable.',
    mood: 'calm',
    tags: ['study', 'clarity'],
    createdAt: 'Today, 8:20 PM',
    pinned: true,
  },
  {
    id: 'journal-2',
    title: 'Library session felt heavy',
    body: 'I wanted to be productive, but I kept comparing myself to everyone around me. I need a softer evening plan.',
    mood: 'stressed',
    tags: ['comparison', 'energy'],
    createdAt: 'Yesterday, 6:05 PM',
  },
  {
    id: 'journal-3',
    title: 'Small win in class',
    body: 'I finally understood the recursion problem after asking one question. I should remember that confusion does pass.',
    mood: 'happy',
    tags: ['class', 'confidence'],
    createdAt: 'Mon, 5:40 PM',
  },
];
