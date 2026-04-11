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

// ─── Adaptive Test Types ────────────────────────────────────────────────────

export type TestDifficulty = 'easy' | 'medium' | 'hard';
export type TestTopic = 'dsa' | 'system_design' | 'dbms' | 'os' | 'networks' | 'oop' | 'webdev' | 'math';

export type TestQuestion = {
  id: string;
  topic: TestTopic;
  difficulty: TestDifficulty;
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
  tags: string[];
};

export type AdaptationEvent = {
  atQuestion: number;
  fromDifficulty: TestDifficulty;
  toDifficulty: TestDifficulty;
  reason: 'three_wrong' | 'four_correct';
};

export type TestAnswer = {
  questionId: string;
  selectedIndex: number;
  correct: boolean;
  timeTakenSeconds: number;
  difficulty: TestDifficulty;
  topic: TestTopic;
};

export type TestSession = {
  id: string;
  topic: TestTopic | 'mixed';
  lockedDifficulty: TestDifficulty;
  questionCount: number;
  adaptiveInsightsEnabled: boolean;
  startedAt: string;
  finishedAt: string | null;
  affectiveStateAtStart: AffectiveState;
  stressScoreAtStart: number;
  answers: TestAnswer[];
  adaptationEvents: AdaptationEvent[];
  finalScore: number | null;
  weakTopics: TestTopic[];
  peakDifficulty: TestDifficulty;
};

export const testTopicMeta: Record<TestTopic, { label: string; icon: string; description: string }> = {
  dsa: { label: 'DSA', icon: 'git-branch-outline', description: 'Arrays, trees, graphs, sorting, DP' },
  system_design: { label: 'System Design', icon: 'layers-outline', description: 'Scalability, caching, databases' },
  dbms: { label: 'DBMS', icon: 'server-outline', description: 'SQL, normalization, transactions' },
  os: { label: 'Operating Systems', icon: 'hardware-chip-outline', description: 'Processes, memory, scheduling' },
  networks: { label: 'Networks', icon: 'globe-outline', description: 'TCP/IP, DNS, HTTP, protocols' },
  oop: { label: 'OOP Concepts', icon: 'cube-outline', description: 'Inheritance, polymorphism, SOLID' },
  webdev: { label: 'Web Dev', icon: 'code-slash-outline', description: 'HTML, CSS, JS, REST APIs' },
  math: { label: 'Math & Discrete', icon: 'calculator-outline', description: 'Sets, logic, probability, graphs' },
};

export const testQuestionBank: TestQuestion[] = [
  // ── DSA Easy ──────────────────────────────────────────────────────────────
  {
    id: 'dsa-e-1',
    topic: 'dsa',
    difficulty: 'easy',
    question: 'What is the time complexity of accessing an element in an array by index?',
    options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
    correctIndex: 0,
    explanation: 'Array index access is a direct memory calculation, giving constant time O(1) regardless of size.',
    tags: ['arrays', 'complexity'],
  },
  {
    id: 'dsa-e-2',
    topic: 'dsa',
    difficulty: 'easy',
    question: 'Which data structure follows the Last-In-First-Out (LIFO) principle?',
    options: ['Queue', 'Stack', 'Deque', 'Linked List'],
    correctIndex: 1,
    explanation: 'A stack follows LIFO — the last element pushed is the first to be popped.',
    tags: ['stack', 'linear'],
  },
  {
    id: 'dsa-e-3',
    topic: 'dsa',
    difficulty: 'easy',
    question: 'What is the time complexity of linear search in an unsorted array of n elements?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
    correctIndex: 2,
    explanation: 'Linear search checks each element one by one, giving O(n) worst-case time.',
    tags: ['search', 'arrays'],
  },
  {
    id: 'dsa-e-4',
    topic: 'dsa',
    difficulty: 'easy',
    question: 'Which tree traversal visits nodes in Left → Root → Right order?',
    options: ['Pre-order', 'In-order', 'Post-order', 'Level-order'],
    correctIndex: 1,
    explanation: 'In-order traversal visits the left subtree first, then the root, then the right subtree.',
    tags: ['trees', 'traversal'],
  },
  {
    id: 'dsa-e-5',
    topic: 'dsa',
    difficulty: 'easy',
    question: 'What is the maximum number of nodes in a complete binary tree of height h?',
    options: ['2h', '2^h', '2^h - 1', '2^(h+1) - 1'],
    correctIndex: 3,
    explanation: 'A full binary tree of height h has at most 2^(h+1) - 1 nodes.',
    tags: ['trees', 'binary-tree'],
  },
  // ── DSA Medium ────────────────────────────────────────────────────────────
  {
    id: 'dsa-m-1',
    topic: 'dsa',
    difficulty: 'medium',
    question: 'What is the average-case time complexity of quicksort?',
    options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
    correctIndex: 1,
    explanation: 'Quicksort has an average-case time complexity of O(n log n) with good pivot selection.',
    tags: ['sorting', 'divide-conquer'],
  },
  {
    id: 'dsa-m-2',
    topic: 'dsa',
    difficulty: 'medium',
    question: 'Which data structure is best for implementing an efficient priority queue?',
    options: ['Sorted array', 'Unsorted array', 'Binary heap', 'Doubly linked list'],
    correctIndex: 2,
    explanation: 'A binary heap supports O(log n) insertion and extraction, making it ideal for priority queues.',
    tags: ['heap', 'priority-queue'],
  },
  {
    id: 'dsa-m-3',
    topic: 'dsa',
    difficulty: 'medium',
    question: 'Which algorithm detects a cycle in a linked list using O(1) extra space?',
    options: ['DFS traversal', 'Hash set method', "Floyd's cycle detection", 'BFS traversal'],
    correctIndex: 2,
    explanation: "Floyd's tortoise-and-hare algorithm uses two pointers at different speeds to detect cycles.",
    tags: ['linked-list', 'two-pointers'],
  },
  {
    id: 'dsa-m-4',
    topic: 'dsa',
    difficulty: 'medium',
    question: 'What is the time complexity of inserting an element into a balanced BST?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    correctIndex: 1,
    explanation: 'Balanced BSTs maintain O(log n) height, so insertion takes O(log n) comparisons.',
    tags: ['bst', 'trees'],
  },
  {
    id: 'dsa-m-5',
    topic: 'dsa',
    difficulty: 'medium',
    question: 'What type of problem can dynamic programming solve that plain recursion cannot efficiently?',
    options: ['Problems with no base case', 'Problems with overlapping subproblems', 'Problems requiring sorting', 'Graph traversal only'],
    correctIndex: 1,
    explanation: 'DP memoizes overlapping subproblem results, avoiding exponential redundant computation.',
    tags: ['dp', 'memoization'],
  },
  // ── DSA Hard ──────────────────────────────────────────────────────────────
  {
    id: 'dsa-h-1',
    topic: 'dsa',
    difficulty: 'hard',
    question: "What is the time complexity of Dijkstra's algorithm using a binary min-heap?",
    options: ['O(V²)', 'O(E log V)', 'O((V + E) log V)', 'O(VE)'],
    correctIndex: 2,
    explanation: 'With a binary heap, each edge relaxation and heap operation costs O(log V), giving O((V+E) log V).',
    tags: ['graphs', 'shortest-path'],
  },
  {
    id: 'dsa-h-2',
    topic: 'dsa',
    difficulty: 'hard',
    question: "Which problem does Bellman-Ford solve that Dijkstra's algorithm cannot?",
    options: ['Shortest path in DAGs only', 'Shortest path with negative edge weights', 'Minimum spanning tree', 'All-pairs shortest path'],
    correctIndex: 1,
    explanation: "Bellman-Ford handles negative edge weights and detects negative-weight cycles, unlike Dijkstra's.",
    tags: ['graphs', 'bellman-ford'],
  },
  {
    id: 'dsa-h-3',
    topic: 'dsa',
    difficulty: 'hard',
    question: 'What is the time complexity of building a segment tree over an array of n elements?',
    options: ['O(n)', 'O(n log n)', 'O(log n)', 'O(n²)'],
    correctIndex: 0,
    explanation: 'Building a segment tree visits each of the O(n) nodes once, giving O(n) total build time.',
    tags: ['segment-tree', 'range-queries'],
  },
  {
    id: 'dsa-h-4',
    topic: 'dsa',
    difficulty: 'hard',
    question: 'What is the worst-case time complexity of the KMP string matching algorithm for a text of length n and pattern of length m?',
    options: ['O(n·m)', 'O(n + m)', 'O(m log n)', 'O(n log m)'],
    correctIndex: 1,
    explanation: 'KMP preprocesses the pattern in O(m) and searches in O(n), giving O(n + m) total, avoiding backtracking.',
    tags: ['strings', 'kmp'],
  },
  {
    id: 'dsa-h-5',
    topic: 'dsa',
    difficulty: 'hard',
    question: 'In the context of graph algorithms, what does topological sorting require?',
    options: ['An undirected graph', 'A directed acyclic graph (DAG)', 'A weighted graph', 'A complete graph'],
    correctIndex: 1,
    explanation: 'Topological sort produces a linear ordering of vertices in a DAG where each vertex precedes its dependents.',
    tags: ['graphs', 'topological-sort'],
  },
  // ── System Design Easy ────────────────────────────────────────────────────
  {
    id: 'sd-e-1',
    topic: 'system_design',
    difficulty: 'easy',
    question: 'What does CDN stand for and what is its primary purpose?',
    options: ['Central Data Node — encrypts data', 'Content Delivery Network — caches content at edge servers to reduce latency', 'Cloud Distribution Node — backs up data', 'Content Distribution Node — manages databases'],
    correctIndex: 1,
    explanation: 'A CDN caches content at geographically distributed servers close to users, reducing latency.',
    tags: ['cdn', 'caching'],
  },
  {
    id: 'sd-e-2',
    topic: 'system_design',
    difficulty: 'easy',
    question: 'What is horizontal scaling?',
    options: ['Adding more RAM to a single server', 'Adding more servers to distribute load', 'Upgrading the CPU of a server', 'Increasing disk storage'],
    correctIndex: 1,
    explanation: 'Horizontal scaling (scaling out) adds more servers, while vertical scaling adds more resources to existing servers.',
    tags: ['scalability', 'scaling'],
  },
  {
    id: 'sd-e-3',
    topic: 'system_design',
    difficulty: 'easy',
    question: 'What is a load balancer?',
    options: ['A database replication tool', 'A server that distributes incoming requests across multiple backend servers', 'A caching layer', 'A message queue'],
    correctIndex: 1,
    explanation: 'A load balancer distributes client requests across backend servers so no single server is overwhelmed.',
    tags: ['load-balancing', 'availability'],
  },
  {
    id: 'sd-e-4',
    topic: 'system_design',
    difficulty: 'easy',
    question: 'What does ACID stand for in database transactions?',
    options: ['Atomicity, Concurrency, Isolation, Durability', 'Atomicity, Consistency, Isolation, Durability', 'Availability, Consistency, Integrity, Durability', 'Atomicity, Consistency, Integrity, Distribution'],
    correctIndex: 1,
    explanation: 'ACID ensures reliable transactions: Atomicity, Consistency, Isolation, and Durability.',
    tags: ['databases', 'transactions'],
  },
  {
    id: 'sd-e-5',
    topic: 'system_design',
    difficulty: 'easy',
    question: 'What is caching in system design?',
    options: ['Storing frequently accessed data in fast memory to reduce latency', 'Encrypting data for security', 'Backing up data to disk', 'Distributing data across shards'],
    correctIndex: 0,
    explanation: 'Caching stores frequently accessed data in fast memory (RAM) to reduce database load and response latency.',
    tags: ['caching', 'performance'],
  },
  // ── System Design Medium ──────────────────────────────────────────────────
  {
    id: 'sd-m-1',
    topic: 'system_design',
    difficulty: 'medium',
    question: 'What does the CAP theorem state?',
    options: ['A distributed system can guarantee all three: Consistency, Availability, and Partition tolerance', 'A distributed system can guarantee at most two of: Consistency, Availability, and Partition tolerance', 'CAP applies only to SQL databases', 'CAP is a caching strategy'],
    correctIndex: 1,
    explanation: 'CAP theorem states a distributed system cannot simultaneously guarantee consistency, availability, and partition tolerance.',
    tags: ['distributed-systems', 'cap'],
  },
  {
    id: 'sd-m-2',
    topic: 'system_design',
    difficulty: 'medium',
    question: 'Which database type is best suited for highly connected data like social networks?',
    options: ['Relational database', 'Document store', 'Graph database', 'Key-value store'],
    correctIndex: 2,
    explanation: 'Graph databases are optimized for storing and querying complex relationships between entities.',
    tags: ['databases', 'graph-db'],
  },
  {
    id: 'sd-m-3',
    topic: 'system_design',
    difficulty: 'medium',
    question: 'What is database sharding?',
    options: ['Replicating data across multiple servers', 'Partitioning data horizontally across multiple database nodes', 'Creating database backups', 'Building indexes on large tables'],
    correctIndex: 1,
    explanation: 'Sharding splits large datasets horizontally across multiple nodes to improve scalability.',
    tags: ['sharding', 'scalability'],
  },
  {
    id: 'sd-m-4',
    topic: 'system_design',
    difficulty: 'medium',
    question: 'What is the purpose of a message queue in a distributed system?',
    options: ['To cache API responses', 'To decouple producers and consumers and handle asynchronous communication', 'To replicate databases', 'To manage SSL certificates'],
    correctIndex: 1,
    explanation: 'Message queues like Kafka enable async communication and decouple services, improving resilience.',
    tags: ['messaging', 'async'],
  },
  {
    id: 'sd-m-5',
    topic: 'system_design',
    difficulty: 'medium',
    question: 'What is the difference between synchronous and asynchronous replication?',
    options: ['Synchronous waits for all replicas to confirm; asynchronous does not wait', 'Async is faster at reads; sync is faster at writes', 'They are identical in modern systems', 'Sync only works on SQL databases'],
    correctIndex: 0,
    explanation: 'Synchronous replication ensures all replicas confirm before responding; async replicates later for higher throughput.',
    tags: ['replication', 'consistency'],
  },
  // ── System Design Hard ────────────────────────────────────────────────────
  {
    id: 'sd-h-1',
    topic: 'system_design',
    difficulty: 'hard',
    question: 'In consistent hashing, what problem do virtual nodes (vnodes) solve?',
    options: ['Reducing memory usage', 'Uneven load distribution when nodes are added or removed', 'Preventing data corruption', 'Improving write throughput'],
    correctIndex: 1,
    explanation: 'Virtual nodes ensure more even data distribution across physical nodes, reducing hotspots on topology changes.',
    tags: ['consistent-hashing', 'distributed'],
  },
  {
    id: 'sd-h-2',
    topic: 'system_design',
    difficulty: 'hard',
    question: 'What is the two-phase commit (2PC) protocol used for?',
    options: ['Encrypting distributed transactions', 'Ensuring atomicity of distributed transactions across multiple nodes', 'Replicating data in real time', 'Managing leader election'],
    correctIndex: 1,
    explanation: '2PC coordinates distributed transactions by preparing all participants, then committing only if all agree.',
    tags: ['distributed-transactions', '2pc'],
  },
  {
    id: 'sd-h-3',
    topic: 'system_design',
    difficulty: 'hard',
    question: 'What distinguishes event-driven architecture from request-response?',
    options: ['Event-driven is always faster', 'Services communicate via events asynchronously without tight coupling', 'Event-driven requires GraphQL', 'Request-response cannot scale'],
    correctIndex: 1,
    explanation: 'Event-driven systems produce and consume events asynchronously, allowing loose coupling and independent scalability.',
    tags: ['event-driven', 'architecture'],
  },
  {
    id: 'sd-h-4',
    topic: 'system_design',
    difficulty: 'hard',
    question: 'What is the purpose of the circuit breaker pattern in microservices?',
    options: ['To route traffic between services', 'To prevent cascading failures by stopping calls to a failing service', 'To encrypt service-to-service communication', 'To manage API versioning'],
    correctIndex: 1,
    explanation: 'The circuit breaker monitors failure rates and short-circuits requests to failing services, preventing cascading failures.',
    tags: ['microservices', 'resilience'],
  },
  {
    id: 'sd-h-5',
    topic: 'system_design',
    difficulty: 'hard',
    question: 'Which consistency model allows reads to return stale data but guarantees eventual convergence?',
    options: ['Strong consistency', 'Linearizability', 'Eventual consistency', 'Serializability'],
    correctIndex: 2,
    explanation: 'Eventual consistency allows temporary stale reads but guarantees all replicas converge to the same value given no new updates.',
    tags: ['consistency', 'distributed'],
  },
  // ── DBMS Easy ─────────────────────────────────────────────────────────────
  {
    id: 'dbms-e-1',
    topic: 'dbms',
    difficulty: 'easy',
    question: 'What does SQL stand for?',
    options: ['Structured Query Language', 'Simple Query Logic', 'Sequential Query Layer', 'Standard Question Language'],
    correctIndex: 0,
    explanation: 'SQL (Structured Query Language) is the standard language for managing and querying relational databases.',
    tags: ['sql', 'basics'],
  },
  {
    id: 'dbms-e-2',
    topic: 'dbms',
    difficulty: 'easy',
    question: 'Which SQL command is used to retrieve data from a table?',
    options: ['INSERT', 'UPDATE', 'SELECT', 'DELETE'],
    correctIndex: 2,
    explanation: 'The SELECT statement retrieves rows from one or more tables based on specified conditions.',
    tags: ['sql', 'dml'],
  },
  {
    id: 'dbms-e-3',
    topic: 'dbms',
    difficulty: 'easy',
    question: 'What is a primary key in a relational database?',
    options: ['A key that can have duplicate values', 'A column or set of columns that uniquely identifies each row', 'A foreign key reference', 'An index on all columns'],
    correctIndex: 1,
    explanation: 'A primary key uniquely identifies each record in a table and cannot contain NULL values.',
    tags: ['keys', 'constraints'],
  },
  {
    id: 'dbms-e-4',
    topic: 'dbms',
    difficulty: 'easy',
    question: 'What is the purpose of the WHERE clause in SQL?',
    options: ['To sort results', 'To filter rows based on a condition', 'To join two tables', 'To group rows'],
    correctIndex: 1,
    explanation: 'The WHERE clause filters records that meet a specified condition, applied before grouping.',
    tags: ['sql', 'filtering'],
  },
  {
    id: 'dbms-e-5',
    topic: 'dbms',
    difficulty: 'easy',
    question: 'What is a foreign key?',
    options: ['A key in another database', 'A column that references the primary key of another table', 'A key used for encryption', 'A composite key'],
    correctIndex: 1,
    explanation: 'A foreign key establishes referential integrity by referencing the primary key of another table.',
    tags: ['keys', 'referential-integrity'],
  },
  // ── DBMS Medium ───────────────────────────────────────────────────────────
  {
    id: 'dbms-m-1',
    topic: 'dbms',
    difficulty: 'medium',
    question: 'Which normal form eliminates transitive dependencies?',
    options: ['1NF', '2NF', '3NF', 'BCNF'],
    correctIndex: 2,
    explanation: 'Third Normal Form (3NF) requires all non-key attributes to be non-transitively dependent on the primary key.',
    tags: ['normalization', '3nf'],
  },
  {
    id: 'dbms-m-2',
    topic: 'dbms',
    difficulty: 'medium',
    question: 'What is the difference between INNER JOIN and LEFT JOIN?',
    options: ['LEFT JOIN only returns left table rows; INNER JOIN returns all rows', 'INNER JOIN returns only matching rows from both tables; LEFT JOIN includes all left rows with NULLs for unmatched right rows', 'They are functionally identical', 'INNER JOIN is always faster'],
    correctIndex: 1,
    explanation: 'INNER JOIN returns only matched rows; LEFT JOIN returns all left rows and matched (or NULL) right rows.',
    tags: ['joins', 'sql'],
  },
  {
    id: 'dbms-m-3',
    topic: 'dbms',
    difficulty: 'medium',
    question: 'What is a database index and why is it used?',
    options: ['A backup of the database', 'A data structure that speeds up data retrieval at the cost of additional storage', 'A constraint to enforce uniqueness', 'A view of aggregated data'],
    correctIndex: 1,
    explanation: 'An index allows faster row lookups by building a B-tree structure, reducing full table scans at extra storage cost.',
    tags: ['indexes', 'performance'],
  },
  {
    id: 'dbms-m-4',
    topic: 'dbms',
    difficulty: 'medium',
    question: 'What does the HAVING clause do in SQL?',
    options: ['Filters rows before grouping', 'Filters groups after a GROUP BY based on aggregate conditions', 'Joins two tables', 'Sorts the result set'],
    correctIndex: 1,
    explanation: 'HAVING filters groups created by GROUP BY, similar to WHERE but applied after aggregation.',
    tags: ['sql', 'aggregation'],
  },
  {
    id: 'dbms-m-5',
    topic: 'dbms',
    difficulty: 'medium',
    question: 'What is a database transaction?',
    options: ['A single SQL query', 'A unit of work executed atomically — all operations succeed or none do', 'A stored procedure', 'A database backup'],
    correctIndex: 1,
    explanation: 'A transaction groups multiple SQL operations with ACID guarantees — all commit or all roll back.',
    tags: ['transactions', 'acid'],
  },
  // ── DBMS Hard ─────────────────────────────────────────────────────────────
  {
    id: 'dbms-h-1',
    topic: 'dbms',
    difficulty: 'hard',
    question: 'What is the difference between pessimistic and optimistic locking?',
    options: ['Pessimistic locks data immediately; optimistic checks for conflicts only at commit time', 'Optimistic locking uses more memory', 'Pessimistic locking is always slower', 'They are two names for the same mechanism'],
    correctIndex: 0,
    explanation: 'Pessimistic locking prevents conflicts upfront; optimistic assumes rarity and validates at commit, rolling back on conflict.',
    tags: ['locking', 'concurrency'],
  },
  {
    id: 'dbms-h-2',
    topic: 'dbms',
    difficulty: 'hard',
    question: 'Which isolation level prevents dirty reads but allows non-repeatable reads?',
    options: ['Read Uncommitted', 'Read Committed', 'Repeatable Read', 'Serializable'],
    correctIndex: 1,
    explanation: 'Read Committed prevents dirty reads but allows a second read in the same transaction to see different values if another transaction committed between reads.',
    tags: ['isolation', 'transactions'],
  },
  {
    id: 'dbms-h-3',
    topic: 'dbms',
    difficulty: 'hard',
    question: 'What is the purpose of Write-Ahead Logging (WAL) in databases?',
    options: ['To compress data before writing', 'To ensure atomicity and durability by recording changes before applying them to disk', 'To replicate data asynchronously', 'To manage index updates'],
    correctIndex: 1,
    explanation: 'WAL ensures crash recovery by writing log records before data pages, allowing redo or undo operations after a failure.',
    tags: ['wal', 'recovery'],
  },
  {
    id: 'dbms-h-4',
    topic: 'dbms',
    difficulty: 'hard',
    question: 'Why is a B+ tree preferred over a B-tree for database indexes?',
    options: ['B+ trees store data only in leaf nodes linked for efficient range scans; B-trees store data in all nodes', 'B+ trees are always smaller', 'B-trees support range queries better', 'They are identical structures'],
    correctIndex: 0,
    explanation: 'B+ trees store all data in linked leaf nodes, enabling efficient sequential range scans without traversing internal nodes.',
    tags: ['b-plus-tree', 'indexes'],
  },
  {
    id: 'dbms-h-5',
    topic: 'dbms',
    difficulty: 'hard',
    question: 'What does MVCC (Multi-Version Concurrency Control) do?',
    options: ['Allows multiple databases to sync', 'Maintains multiple versions of data so readers do not block writers', 'Encrypts concurrent transactions', 'Reduces index size'],
    correctIndex: 1,
    explanation: 'MVCC creates a new data version on each update so readers see a consistent snapshot without locking, improving concurrency.',
    tags: ['mvcc', 'concurrency'],
  },
  // ── OS Easy ───────────────────────────────────────────────────────────────
  {
    id: 'os-e-1',
    topic: 'os',
    difficulty: 'easy',
    question: 'What is a process in an operating system?',
    options: ['A program stored on disk', 'An instance of a program in execution', 'A file system directory', 'A hardware driver'],
    correctIndex: 1,
    explanation: 'A process is a program in execution with its own memory space, stack, heap, and program counter.',
    tags: ['process', 'basics'],
  },
  {
    id: 'os-e-2',
    topic: 'os',
    difficulty: 'easy',
    question: 'What is the key difference between a process and a thread?',
    options: ['They are the same', 'A thread is a lightweight unit of execution within a process sharing its memory space', 'A process is faster', 'Threads cannot be parallelized'],
    correctIndex: 1,
    explanation: 'Threads share the process address space; each process has its own separate address space.',
    tags: ['threads', 'process'],
  },
  {
    id: 'os-e-3',
    topic: 'os',
    difficulty: 'easy',
    question: 'What is a deadlock?',
    options: ['A process that runs too long', 'A situation where processes wait indefinitely for resources held by each other', 'A memory leak', 'A CPU scheduling error'],
    correctIndex: 1,
    explanation: 'Deadlock occurs when processes form a circular wait where each holds a resource needed by another.',
    tags: ['deadlock', 'synchronization'],
  },
  {
    id: 'os-e-4',
    topic: 'os',
    difficulty: 'easy',
    question: 'Which scheduling algorithm runs the process with the highest priority first?',
    options: ['FCFS', 'Round Robin', 'Priority Scheduling', 'SJF'],
    correctIndex: 2,
    explanation: 'Priority Scheduling selects the highest-priority process for CPU execution, which can cause starvation of low-priority processes.',
    tags: ['scheduling', 'priority'],
  },
  {
    id: 'os-e-5',
    topic: 'os',
    difficulty: 'easy',
    question: 'What does CPU burst time mean?',
    options: ['Total execution time of a process', 'The time a process spends doing CPU computation before making an I/O request', 'Time waiting in the ready queue', 'Time to context switch'],
    correctIndex: 1,
    explanation: 'CPU burst time is the duration a process executes on the CPU before performing an I/O operation or completing.',
    tags: ['cpu-burst', 'scheduling'],
  },
  // ── OS Medium ─────────────────────────────────────────────────────────────
  {
    id: 'os-m-1',
    topic: 'os',
    difficulty: 'medium',
    question: 'What is virtual memory?',
    options: ['RAM that is very fast', 'A technique that uses disk space to extend the apparent RAM available to processes', 'A type of cache', 'GPU memory'],
    correctIndex: 1,
    explanation: 'Virtual memory uses disk (swap) space to extend addressable memory, allowing processes larger than physical RAM to run.',
    tags: ['virtual-memory', 'paging'],
  },
  {
    id: 'os-m-2',
    topic: 'os',
    difficulty: 'medium',
    question: 'What is the purpose of a page table in an OS?',
    options: ['To list running processes', 'To translate virtual addresses to physical addresses', 'To store file metadata', 'To manage I/O queues'],
    correctIndex: 1,
    explanation: 'The page table maps virtual page numbers to physical frame numbers, enabling the OS to implement virtual memory.',
    tags: ['page-table', 'memory'],
  },
  {
    id: 'os-m-3',
    topic: 'os',
    difficulty: 'medium',
    question: 'Which page replacement algorithm replaces the page not needed for the longest future time?',
    options: ['LRU', 'FIFO', 'Optimal (OPT)', 'Clock'],
    correctIndex: 2,
    explanation: 'The Optimal algorithm gives the lowest page fault rate by replacing the page needed furthest in the future (theoretical).',
    tags: ['page-replacement', 'memory'],
  },
  {
    id: 'os-m-4',
    topic: 'os',
    difficulty: 'medium',
    question: 'What is a semaphore used for in an OS?',
    options: ['Memory allocation', 'Synchronizing access to shared resources between concurrent processes or threads', 'CPU scheduling', 'Disk management'],
    correctIndex: 1,
    explanation: 'Semaphores are integer variables for signaling and mutual exclusion to coordinate concurrent access to shared resources.',
    tags: ['semaphore', 'synchronization'],
  },
  {
    id: 'os-m-5',
    topic: 'os',
    difficulty: 'medium',
    question: 'What is thrashing in an OS?',
    options: ['High CPU utilization', 'A state where the OS spends more time swapping pages than executing processes', 'A disk defragmentation process', 'CPU overheating'],
    correctIndex: 1,
    explanation: 'Thrashing occurs when processes have too few frames, causing constant page faults and excessive paging, severely reducing CPU utilization.',
    tags: ['thrashing', 'virtual-memory'],
  },
  // ── OS Hard ───────────────────────────────────────────────────────────────
  {
    id: 'os-h-1',
    topic: 'os',
    difficulty: 'hard',
    question: 'What is the difference between internal and external fragmentation?',
    options: ['They are the same', 'Internal fragmentation wastes space inside allocated blocks; external creates unusable gaps between blocks', 'External is always worse', 'Internal only occurs in virtual memory'],
    correctIndex: 1,
    explanation: 'Internal fragmentation is wasted space within an allocated block; external fragmentation is unusable free memory scattered between allocations.',
    tags: ['fragmentation', 'memory-management'],
  },
  {
    id: 'os-h-2',
    topic: 'os',
    difficulty: 'hard',
    question: 'How does a TLB (Translation Lookaside Buffer) improve memory access performance?',
    options: ['It stores compressed pages', 'It caches recent virtual-to-physical address translations, reducing page table lookups', 'It increases RAM size', 'It reduces disk I/O'],
    correctIndex: 1,
    explanation: 'The TLB is a fast associative cache for page table entries; a TLB hit avoids a multi-level page table walk.',
    tags: ['tlb', 'memory'],
  },
  {
    id: 'os-h-3',
    topic: 'os',
    difficulty: 'hard',
    question: 'Which of the four Coffman conditions is NOT required for deadlock?',
    options: ['Mutual exclusion', 'Hold and wait', 'Preemption allowed', 'Circular wait'],
    correctIndex: 2,
    explanation: 'The four deadlock conditions are mutual exclusion, hold-and-wait, no preemption, and circular wait. Allowing preemption prevents deadlock.',
    tags: ['deadlock', 'coffman'],
  },
  {
    id: 'os-h-4',
    topic: 'os',
    difficulty: 'hard',
    question: 'What is the difference between cooperative and preemptive multitasking?',
    options: ['They are identical', 'Cooperative requires processes to voluntarily yield; preemptive OS can forcibly remove a process from the CPU', 'Preemptive is older', 'Cooperative is used in modern OSes'],
    correctIndex: 1,
    explanation: 'In cooperative multitasking, processes yield voluntarily; in preemptive, the OS interrupts and context-switches processes at any time.',
    tags: ['multitasking', 'scheduling'],
  },
  {
    id: 'os-h-5',
    topic: 'os',
    difficulty: 'hard',
    question: 'What is the purpose of the buddy system in memory allocation?',
    options: ['To share memory between processes', 'To split and merge power-of-2 memory blocks to reduce external fragmentation', 'To manage virtual memory pages', 'To allocate stack memory'],
    correctIndex: 1,
    explanation: 'The buddy system allocates power-of-2 blocks and merges adjacent free buddies, efficiently reducing external fragmentation.',
    tags: ['buddy-system', 'memory'],
  },
  // ── Networks Easy ─────────────────────────────────────────────────────────
  {
    id: 'net-e-1',
    topic: 'networks',
    difficulty: 'easy',
    question: 'What does HTTP stand for?',
    options: ['HyperText Transfer Protocol', 'High Transfer Text Protocol', 'HyperText Transport Package', 'Host Transfer Text Protocol'],
    correctIndex: 0,
    explanation: 'HTTP (HyperText Transfer Protocol) is the foundation of data communication on the World Wide Web.',
    tags: ['http', 'protocols'],
  },
  {
    id: 'net-e-2',
    topic: 'networks',
    difficulty: 'easy',
    question: 'What is the purpose of DNS?',
    options: ['To assign IP addresses dynamically', 'To translate domain names into IP addresses', 'To encrypt network traffic', 'To route packets between networks'],
    correctIndex: 1,
    explanation: 'DNS (Domain Name System) resolves human-readable domain names like google.com to IP addresses.',
    tags: ['dns', 'networking'],
  },
  {
    id: 'net-e-3',
    topic: 'networks',
    difficulty: 'easy',
    question: 'What is the key difference between TCP and UDP?',
    options: ['TCP is faster; UDP is reliable', 'TCP is reliable and connection-oriented; UDP is faster and connectionless', 'They are the same protocol', 'UDP guarantees delivery'],
    correctIndex: 1,
    explanation: 'TCP provides reliable, ordered delivery with connection setup; UDP is connectionless and faster but does not guarantee delivery.',
    tags: ['tcp', 'udp'],
  },
  {
    id: 'net-e-4',
    topic: 'networks',
    difficulty: 'easy',
    question: 'What is an IP address?',
    options: ['A MAC address alternative', 'A unique numerical label assigned to each device on a network', 'A website URL', 'A network cable type'],
    correctIndex: 1,
    explanation: 'An IP address identifies a device on a network and enables routing of packets to the correct destination.',
    tags: ['ip', 'addressing'],
  },
  {
    id: 'net-e-5',
    topic: 'networks',
    difficulty: 'easy',
    question: 'What port does HTTPS use by default?',
    options: ['80', '21', '443', '8080'],
    correctIndex: 2,
    explanation: 'HTTPS uses port 443 by default; HTTP uses port 80.',
    tags: ['https', 'ports'],
  },
  // ── Networks Medium ───────────────────────────────────────────────────────
  {
    id: 'net-m-1',
    topic: 'networks',
    difficulty: 'medium',
    question: 'What is the OSI model?',
    options: ['A network cable standard', 'A conceptual 7-layer framework describing how data is transmitted over a network', 'A routing protocol', 'A security standard'],
    correctIndex: 1,
    explanation: 'The OSI model defines 7 layers (Physical, Data Link, Network, Transport, Session, Presentation, Application) for network communication.',
    tags: ['osi', 'model'],
  },
  {
    id: 'net-m-2',
    topic: 'networks',
    difficulty: 'medium',
    question: 'What is the difference between a router and a switch?',
    options: ['They are the same device', 'A router connects different networks using IP; a switch connects devices within a LAN using MAC addresses', 'A switch is used in WANs', 'Routers operate at Layer 2'],
    correctIndex: 1,
    explanation: 'Routers operate at Layer 3 connecting networks; switches operate at Layer 2 connecting devices within the same LAN.',
    tags: ['router', 'switch'],
  },
  {
    id: 'net-m-3',
    topic: 'networks',
    difficulty: 'medium',
    question: 'What does the TCP three-way handshake accomplish?',
    options: ['Encrypts the connection', 'Establishes a reliable connection by exchanging SYN, SYN-ACK, and ACK packets', 'Terminates the connection', 'Negotiates the MTU'],
    correctIndex: 1,
    explanation: 'The TCP three-way handshake (SYN → SYN-ACK → ACK) establishes a synchronized, reliable connection between client and server.',
    tags: ['tcp', 'handshake'],
  },
  {
    id: 'net-m-4',
    topic: 'networks',
    difficulty: 'medium',
    question: 'What is NAT (Network Address Translation)?',
    options: ['A DNS caching technique', 'A method of mapping private IPs to a public IP for outbound internet traffic', 'A routing protocol', 'A firewall rule type'],
    correctIndex: 1,
    explanation: 'NAT allows multiple private-IP devices to share a single public IP, conserving IPv4 address space.',
    tags: ['nat', 'ip-addressing'],
  },
  {
    id: 'net-m-5',
    topic: 'networks',
    difficulty: 'medium',
    question: 'What is the purpose of ARP (Address Resolution Protocol)?',
    options: ['To resolve IP addresses to MAC addresses on a local network', 'To assign IP addresses dynamically', 'To encrypt traffic', 'To route packets across subnets'],
    correctIndex: 0,
    explanation: 'ARP maps a known IP address to the MAC address of the device on the same local network.',
    tags: ['arp', 'mac-address'],
  },
  // ── Networks Hard ─────────────────────────────────────────────────────────
  {
    id: 'net-h-1',
    topic: 'networks',
    difficulty: 'hard',
    question: 'What is BGP and what is it used for?',
    options: ['A local routing protocol', 'The path vector protocol used between autonomous systems to exchange routing information on the internet', 'A transport layer protocol', 'A DNS query protocol'],
    correctIndex: 1,
    explanation: 'BGP (Border Gateway Protocol) exchanges routing information between autonomous systems (ISPs) on the internet.',
    tags: ['bgp', 'routing'],
  },
  {
    id: 'net-h-2',
    topic: 'networks',
    difficulty: 'hard',
    question: 'What problem does TCP slow start address?',
    options: ['Slow DNS resolution', 'Preventing congestion by starting with a small window and doubling each RTT until loss', 'Reducing latency on encrypted connections', 'Decreasing retransmission timeout'],
    correctIndex: 1,
    explanation: 'TCP slow start prevents network congestion by beginning with a small congestion window and exponentially increasing it, backing off on packet loss.',
    tags: ['tcp', 'congestion-control'],
  },
  {
    id: 'net-h-3',
    topic: 'networks',
    difficulty: 'hard',
    question: 'How does QUIC improve upon TCP+TLS?',
    options: ['A DNS extension only', 'A transport protocol over UDP that combines transport and encryption, reducing connection setup to 0-RTT', 'A routing algorithm', 'A compression algorithm'],
    correctIndex: 1,
    explanation: 'QUIC (used in HTTP/3) combines transport and TLS in UDP, eliminating TCP handshake overhead and achieving 0-RTT resumption.',
    tags: ['quic', 'http3'],
  },
  {
    id: 'net-h-4',
    topic: 'networks',
    difficulty: 'hard',
    question: 'What is the difference between a stateful and stateless firewall?',
    options: ['They are the same', 'A stateful firewall tracks connection state; a stateless firewall inspects each packet independently', 'Stateless is more secure', 'Stateful firewalls cannot block UDP'],
    correctIndex: 1,
    explanation: 'Stateful firewalls maintain connection tracking tables; stateless firewalls apply rules per packet without session context.',
    tags: ['firewall', 'security'],
  },
  {
    id: 'net-h-5',
    topic: 'networks',
    difficulty: 'hard',
    question: 'What is the purpose of OSPF in networking?',
    options: ['Encrypting routing tables', 'A link-state routing protocol that calculates shortest paths within an AS using Dijkstra', 'A BGP extension', 'A DNS security protocol'],
    correctIndex: 1,
    explanation: "OSPF is an interior gateway protocol where routers flood link-state info and independently compute shortest paths via Dijkstra's algorithm.",
    tags: ['ospf', 'routing'],
  },
  // ── OOP Easy ──────────────────────────────────────────────────────────────
  {
    id: 'oop-e-1',
    topic: 'oop',
    difficulty: 'easy',
    question: 'What is encapsulation in OOP?',
    options: ['Breaking code into functions', 'Bundling data and methods within a class and restricting direct access to internal state', 'Inheriting from a parent class', 'Creating multiple objects'],
    correctIndex: 1,
    explanation: 'Encapsulation hides internal implementation details by exposing only public interfaces, protecting object state integrity.',
    tags: ['encapsulation', 'oop-basics'],
  },
  {
    id: 'oop-e-2',
    topic: 'oop',
    difficulty: 'easy',
    question: 'What is inheritance in OOP?',
    options: ['Creating objects from a class', 'A mechanism where a child class acquires properties and behaviors of a parent class', 'Overriding a method', 'Implementing an interface'],
    correctIndex: 1,
    explanation: 'Inheritance allows a subclass to reuse and extend the functionality of its superclass, promoting code reuse.',
    tags: ['inheritance', 'oop-basics'],
  },
  {
    id: 'oop-e-3',
    topic: 'oop',
    difficulty: 'easy',
    question: 'What is polymorphism?',
    options: ['Having multiple constructors', 'The ability for different classes to be treated as the same type with behavior determined at runtime', 'Using multiple inheritance only', 'Creating abstract classes'],
    correctIndex: 1,
    explanation: 'Polymorphism allows objects of different types to be used interchangeably via a common interface.',
    tags: ['polymorphism', 'oop-basics'],
  },
  {
    id: 'oop-e-4',
    topic: 'oop',
    difficulty: 'easy',
    question: 'What is an abstract class?',
    options: ['A class with no methods', 'A class that cannot be instantiated and may contain abstract methods subclasses must implement', 'A class with only static methods', 'A final class'],
    correctIndex: 1,
    explanation: 'An abstract class declares common structure for subclasses but cannot itself be instantiated.',
    tags: ['abstract', 'oop-basics'],
  },
  {
    id: 'oop-e-5',
    topic: 'oop',
    difficulty: 'easy',
    question: 'What is the difference between a class and an object?',
    options: ['They are the same thing', 'A class is a blueprint; an object is a concrete instance of that class', 'An object has no methods', 'A class exists only at runtime'],
    correctIndex: 1,
    explanation: 'A class defines the structure and behavior; an object is a concrete instance created in memory.',
    tags: ['class', 'object'],
  },
  // ── OOP Medium ────────────────────────────────────────────────────────────
  {
    id: 'oop-m-1',
    topic: 'oop',
    difficulty: 'medium',
    question: 'What does the Liskov Substitution Principle state?',
    options: ['A principle about code formatting', 'Objects of a superclass should be replaceable with objects of a subclass without altering correctness', 'Every class must have a single responsibility', 'Interfaces should be small and focused'],
    correctIndex: 1,
    explanation: 'LSP (L in SOLID) states that subclasses must be usable wherever their superclass is expected without breaking behavior.',
    tags: ['solid', 'lsp'],
  },
  {
    id: 'oop-m-2',
    topic: 'oop',
    difficulty: 'medium',
    question: 'What does the Open/Closed Principle state?',
    options: ['Classes should be open source', 'Software entities should be open for extension but closed for modification', 'Methods should have few parameters', 'All classes must be public'],
    correctIndex: 1,
    explanation: 'The Open/Closed Principle (O in SOLID) encourages extending behavior without modifying existing code.',
    tags: ['solid', 'ocp'],
  },
  {
    id: 'oop-m-3',
    topic: 'oop',
    difficulty: 'medium',
    question: 'What is the difference between method overriding and method overloading?',
    options: ['They are the same', 'Overriding replaces a parent method in a subclass; overloading defines same-name methods with different parameter lists', 'Overloading only works in interfaces', 'Overriding requires the same parameter types'],
    correctIndex: 1,
    explanation: 'Overriding provides a new implementation of an inherited method; overloading defines multiple methods with the same name but different signatures.',
    tags: ['overriding', 'overloading'],
  },
  {
    id: 'oop-m-4',
    topic: 'oop',
    difficulty: 'medium',
    question: 'What is a design pattern?',
    options: ['A UI layout template', 'A reusable solution to a commonly occurring software design problem', 'A compiler optimization', 'A database schema pattern'],
    correctIndex: 1,
    explanation: 'Design patterns are proven, reusable solutions to common OOP design problems, categorized as creational, structural, and behavioral.',
    tags: ['design-patterns', 'oop'],
  },
  {
    id: 'oop-m-5',
    topic: 'oop',
    difficulty: 'medium',
    question: 'What is the purpose of the Singleton design pattern?',
    options: ['To create copies of objects', 'To ensure only one instance of a class exists and provide a global access point', 'To define object creation through subclasses', 'To compose objects into tree structures'],
    correctIndex: 1,
    explanation: 'The Singleton pattern restricts instantiation to one object, useful for global state like configuration managers.',
    tags: ['singleton', 'creational'],
  },
  // ── OOP Hard ──────────────────────────────────────────────────────────────
  {
    id: 'oop-h-1',
    topic: 'oop',
    difficulty: 'hard',
    question: 'What is the Dependency Inversion Principle?',
    options: ['Low-level modules should depend on high-level modules', 'High-level and low-level modules should both depend on abstractions, not concrete implementations', 'All dependencies must be injected via constructor', 'Classes cannot have more than five dependencies'],
    correctIndex: 1,
    explanation: 'DIP (D in SOLID) decouples high-level and low-level modules by making both depend on abstractions (interfaces).',
    tags: ['solid', 'dip'],
  },
  {
    id: 'oop-h-2',
    topic: 'oop',
    difficulty: 'hard',
    question: 'What is the key advantage of composition over inheritance?',
    options: ['They achieve identical results', 'Composition achieves reuse via contained instances, providing more flexibility and avoiding tight coupling', 'Composition is always faster', 'Inheritance is deprecated'],
    correctIndex: 1,
    explanation: 'Composition (has-a) is often preferred over inheritance (is-a) because it provides flexibility and avoids brittle deep class hierarchies.',
    tags: ['composition', 'inheritance'],
  },
  {
    id: 'oop-h-3',
    topic: 'oop',
    difficulty: 'hard',
    question: 'What problem does the Observer design pattern solve?',
    options: ['Creating objects without specifying concrete class', 'Defining a one-to-many dependency so dependents are notified when one object changes state', 'Providing a simplified interface to a complex subsystem', 'Ensuring only one instance'],
    correctIndex: 1,
    explanation: 'Observer defines publish-subscribe where subjects notify all registered observers of state changes, used in events and MVC.',
    tags: ['observer', 'behavioral'],
  },
  {
    id: 'oop-h-4',
    topic: 'oop',
    difficulty: 'hard',
    question: 'What is covariance in the context of generics?',
    options: ['Two identical types', 'A generic type parameterized with a subtype can be used where the supertype is expected (read-only positions)', 'Making all types generic', 'Preventing type casting'],
    correctIndex: 1,
    explanation: 'Covariance allows e.g. List<Dog> where List<Animal> is expected, valid only for read-only (producer) positions.',
    tags: ['generics', 'covariance'],
  },
  {
    id: 'oop-h-5',
    topic: 'oop',
    difficulty: 'hard',
    question: 'What is the key difference between the Strategy and State design patterns?',
    options: ['They are identical', 'Strategy selects an interchangeable algorithm at runtime; State changes behavior based on internal state with internal transitions', 'Strategy uses inheritance; State uses composition', 'State is only for UI components'],
    correctIndex: 1,
    explanation: 'Strategy encapsulates interchangeable algorithms chosen by the client; State encapsulates state-specific behavior with internally managed transitions.',
    tags: ['strategy', 'state', 'behavioral'],
  },
  // ── Web Dev Easy ──────────────────────────────────────────────────────────
  {
    id: 'web-e-1',
    topic: 'webdev',
    difficulty: 'easy',
    question: 'What is the DOM?',
    options: ['A JavaScript framework', 'The Document Object Model — a tree-based representation of a web page that JavaScript can manipulate', 'A CSS preprocessor', 'A server-side concept'],
    correctIndex: 1,
    explanation: 'The DOM represents HTML as a tree of nodes that JavaScript can read and modify dynamically.',
    tags: ['dom', 'browser'],
  },
  {
    id: 'web-e-2',
    topic: 'webdev',
    difficulty: 'easy',
    question: 'What does CSS stand for?',
    options: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style System', 'Coded Style Syntax'],
    correctIndex: 1,
    explanation: 'CSS (Cascading Style Sheets) defines the visual presentation of HTML documents.',
    tags: ['css', 'basics'],
  },
  {
    id: 'web-e-3',
    topic: 'webdev',
    difficulty: 'easy',
    question: 'What is the difference between GET and POST HTTP methods?',
    options: ['They are identical', 'GET retrieves data via URL params; POST sends data in the request body for creating or updating resources', 'POST is more secure on all networks', 'GET can only be used with forms'],
    correctIndex: 1,
    explanation: 'GET is idempotent and safe for fetching; POST sends body data and is used for submitting data that changes server state.',
    tags: ['http', 'rest'],
  },
  {
    id: 'web-e-4',
    topic: 'webdev',
    difficulty: 'easy',
    question: 'What is a REST API?',
    options: ['A JavaScript library', 'An architectural style for APIs using standard HTTP methods and stateless communication', 'A database technology', 'A CSS framework'],
    correctIndex: 1,
    explanation: 'REST (Representational State Transfer) communicates via HTTP methods (GET, POST, PUT, DELETE) with resources as URLs.',
    tags: ['rest', 'api'],
  },
  {
    id: 'web-e-5',
    topic: 'webdev',
    difficulty: 'easy',
    question: 'What is the purpose of localStorage in browsers?',
    options: ['To store session cookies', 'To persist key-value data on the client-side with no expiration', 'To cache HTTP responses', 'To manage DOM events'],
    correctIndex: 1,
    explanation: 'localStorage stores key-value pairs in the browser with no expiry, persisting across sessions unlike sessionStorage.',
    tags: ['storage', 'browser'],
  },
  // ── Web Dev Medium ────────────────────────────────────────────────────────
  {
    id: 'web-m-1',
    topic: 'webdev',
    difficulty: 'medium',
    question: 'What is CORS and why is it needed?',
    options: ['A CSS layout system', 'A browser security mechanism restricting cross-origin HTTP requests unless the server explicitly allows them', 'A caching protocol', 'A JavaScript module system'],
    correctIndex: 1,
    explanation: 'CORS prevents malicious scripts from making unauthorized cross-origin requests; servers opt in via Access-Control-Allow-Origin headers.',
    tags: ['cors', 'security'],
  },
  {
    id: 'web-m-2',
    topic: 'webdev',
    difficulty: 'medium',
    question: 'What is the event loop in JavaScript?',
    options: ['A for-loop alternative', 'The mechanism allowing JavaScript to handle async operations by checking the call stack and callback queue', 'A CSS animation feature', 'A DOM traversal method'],
    correctIndex: 1,
    explanation: "The event loop dequeues callbacks (setTimeout, Promises) when the call stack is empty, enabling JavaScript's non-blocking behavior.",
    tags: ['event-loop', 'async'],
  },
  {
    id: 'web-m-3',
    topic: 'webdev',
    difficulty: 'medium',
    question: 'What is the difference between == and === in JavaScript?',
    options: ['They are identical', '== compares values with type coercion; === compares value and type without coercion', '=== is slower', '== only works with numbers'],
    correctIndex: 1,
    explanation: '== performs type coercion (0 == false is true); === checks strict equality with no coercion (0 === false is false).',
    tags: ['javascript', 'equality'],
  },
  {
    id: 'web-m-4',
    topic: 'webdev',
    difficulty: 'medium',
    question: 'What is a Promise in JavaScript?',
    options: ['A synchronous callback', 'An object representing the eventual completion or failure of an asynchronous operation', 'A CSS animation', 'A DOM event'],
    correctIndex: 1,
    explanation: 'Promises represent async operations with pending, fulfilled, or rejected states, enabling .then()/.catch() and async/await.',
    tags: ['promise', 'async'],
  },
  {
    id: 'web-m-5',
    topic: 'webdev',
    difficulty: 'medium',
    question: 'What does semantic HTML mean?',
    options: ['HTML with inline styles', 'Using HTML elements that convey meaning about their content (e.g., article, nav, header)', 'Minified HTML', 'Server-rendered HTML'],
    correctIndex: 1,
    explanation: 'Semantic HTML uses meaningful tags describing content structure, improving accessibility, SEO, and code readability.',
    tags: ['html', 'semantics'],
  },
  // ── Web Dev Hard ──────────────────────────────────────────────────────────
  {
    id: 'web-h-1',
    topic: 'webdev',
    difficulty: 'hard',
    question: 'What is the critical rendering path in a browser?',
    options: ['The fastest CSS property to animate', 'The steps to convert HTML/CSS/JS into pixels: DOM → CSSOM → Render Tree → Layout → Paint', 'A JavaScript compilation step', 'A network caching mechanism'],
    correctIndex: 1,
    explanation: 'The critical rendering path includes parsing HTML into DOM, CSS into CSSOM, combining into render tree, layout, and painting pixels.',
    tags: ['performance', 'browser'],
  },
  {
    id: 'web-h-2',
    topic: 'webdev',
    difficulty: 'hard',
    question: 'What is the key difference between Server-Side Rendering (SSR) and Client-Side Rendering (CSR)?',
    options: ['SSR is only for mobile', 'SSR generates HTML on the server for faster initial load; CSR renders HTML in the browser via JavaScript', 'CSR is always faster', 'They produce different HTML output permanently'],
    correctIndex: 1,
    explanation: 'SSR sends fully rendered HTML improving FCP and SEO; CSR sends a minimal shell and renders content in the browser via JavaScript.',
    tags: ['ssr', 'csr'],
  },
  {
    id: 'web-h-3',
    topic: 'webdev',
    difficulty: 'hard',
    question: 'What is a service worker and what can it do?',
    options: ['A Node.js background thread', 'A browser script running separately from the page, enabling offline caching, push notifications, and background sync', 'A CSS worker thread', 'A React component lifecycle'],
    correctIndex: 1,
    explanation: 'Service workers intercept network requests, enabling offline-first experiences via caching, and power push notifications.',
    tags: ['service-worker', 'pwa'],
  },
  {
    id: 'web-h-4',
    topic: 'webdev',
    difficulty: 'hard',
    question: 'What is the purpose of the Content Security Policy (CSP) header?',
    options: ['To cache static assets', 'To prevent XSS by specifying which content sources the browser is allowed to load', 'To compress responses', 'To manage CORS preflight'],
    correctIndex: 1,
    explanation: 'CSP is an HTTP response header telling the browser which scripts, styles, and resources are trusted, mitigating XSS.',
    tags: ['csp', 'security'],
  },
  {
    id: 'web-h-5',
    topic: 'webdev',
    difficulty: 'hard',
    question: 'What is tree shaking in the context of JavaScript bundlers?',
    options: ['A DOM manipulation technique', 'Removing unused (dead) code from a bundle by analyzing ES module import/export graphs', 'A CSS optimization', 'A React reconciliation technique'],
    correctIndex: 1,
    explanation: 'Tree shaking uses static ES module analysis to eliminate code never imported or used, reducing bundle size.',
    tags: ['bundling', 'optimization'],
  },
  // ── Math Easy ─────────────────────────────────────────────────────────────
  {
    id: 'math-e-1',
    topic: 'math',
    difficulty: 'easy',
    question: 'What is a set in discrete mathematics?',
    options: ['An ordered list of elements', 'An unordered collection of distinct elements', 'A function from integers to integers', 'A sequence with repetition'],
    correctIndex: 1,
    explanation: 'A set is an unordered collection of distinct objects, e.g., {1, 2, 3}. Order and repetition do not matter.',
    tags: ['sets', 'discrete-math'],
  },
  {
    id: 'math-e-2',
    topic: 'math',
    difficulty: 'easy',
    question: 'What is a proposition in logic?',
    options: ['A question', 'A statement that is either true or false but not both', 'A mathematical function', 'An assumption'],
    correctIndex: 1,
    explanation: 'A proposition has a definite truth value — it is either true or false, never both or neither.',
    tags: ['logic', 'propositions'],
  },
  {
    id: 'math-e-3',
    topic: 'math',
    difficulty: 'easy',
    question: 'What is the probability of rolling an even number on a fair six-sided die?',
    options: ['1/6', '1/3', '1/2', '2/3'],
    correctIndex: 2,
    explanation: 'Even numbers on a die are {2, 4, 6} — 3 out of 6 equally likely outcomes gives probability 1/2.',
    tags: ['probability', 'basics'],
  },
  {
    id: 'math-e-4',
    topic: 'math',
    difficulty: 'easy',
    question: 'What does n! (n factorial) represent?',
    options: ['The nth prime number', 'The product of all positive integers from 1 to n', 'The sum of integers from 1 to n', 'The number of primes up to n'],
    correctIndex: 1,
    explanation: 'n! = n × (n-1) × ... × 2 × 1. For example, 5! = 120.',
    tags: ['factorial', 'combinatorics'],
  },
  {
    id: 'math-e-5',
    topic: 'math',
    difficulty: 'easy',
    question: 'What is a graph in discrete mathematics?',
    options: ['A plotted function on axes', 'A set of vertices connected by edges representing pairwise relationships', 'A matrix of numbers', 'A tree structure only'],
    correctIndex: 1,
    explanation: 'A graph G = (V, E) consists of a set of vertices V and edges E representing pairwise relationships.',
    tags: ['graphs', 'discrete-math'],
  },
  // ── Math Medium ───────────────────────────────────────────────────────────
  {
    id: 'math-m-1',
    topic: 'math',
    difficulty: 'medium',
    question: 'What is the principle of mathematical induction?',
    options: ['Proving a statement for a specific case', 'A proof technique showing a statement is true for a base case and that if it holds for k it holds for k+1', 'A statistical method', 'A combinatorial identity'],
    correctIndex: 1,
    explanation: 'Mathematical induction proves P(n) for all n ≥ base by showing P(base) and proving P(k) → P(k+1).',
    tags: ['induction', 'proof'],
  },
  {
    id: 'math-m-2',
    topic: 'math',
    difficulty: 'medium',
    question: 'What is the difference between a permutation and a combination?',
    options: ['They are the same', 'A permutation is an ordered arrangement; a combination is an unordered selection', 'A combination considers order', 'Permutations cannot repeat elements'],
    correctIndex: 1,
    explanation: 'Permutations P(n,r) count ordered arrangements; combinations C(n,r) count unordered selections — C(n,r) = P(n,r)/r!.',
    tags: ['combinatorics', 'permutations'],
  },
  {
    id: 'math-m-3',
    topic: 'math',
    difficulty: 'medium',
    question: 'What is Bayes\' theorem used for?',
    options: ['Sorting numbers', 'Updating the probability of a hypothesis given new evidence using conditional probabilities', 'Calculating permutations', 'Solving differential equations'],
    correctIndex: 1,
    explanation: "Bayes' theorem: P(A|B) = P(B|A)·P(A)/P(B), allowing you to update prior beliefs with new evidence.",
    tags: ['probability', 'bayes'],
  },
  {
    id: 'math-m-4',
    topic: 'math',
    difficulty: 'medium',
    question: 'What is an equivalence relation?',
    options: ['A partial order', 'A relation that is reflexive, symmetric, and transitive', 'A bijective function', 'A surjective mapping'],
    correctIndex: 1,
    explanation: 'An equivalence relation satisfies reflexivity, symmetry, and transitivity, partitioning the set into equivalence classes.',
    tags: ['relations', 'equivalence'],
  },
  {
    id: 'math-m-5',
    topic: 'math',
    difficulty: 'medium',
    question: 'What is a tree in graph theory?',
    options: ['A graph with cycles', 'A connected acyclic undirected graph', 'A directed graph', 'A complete graph'],
    correctIndex: 1,
    explanation: 'A tree is a connected graph with no cycles; for n vertices it has exactly n-1 edges.',
    tags: ['trees', 'graph-theory'],
  },
  // ── Math Hard ─────────────────────────────────────────────────────────────
  {
    id: 'math-h-1',
    topic: 'math',
    difficulty: 'hard',
    question: 'What does the Pigeonhole Principle state?',
    options: ['Birds should be distributed evenly', 'If n+1 objects are placed into n containers, at least one container must hold more than one object', 'All pigeons have unique homes', 'Probabilities must sum to 1'],
    correctIndex: 1,
    explanation: 'The Pigeonhole Principle guarantees some bin has at least 2 items when n+1 items are placed into n bins.',
    tags: ['pigeonhole', 'combinatorics'],
  },
  {
    id: 'math-h-2',
    topic: 'math',
    difficulty: 'hard',
    question: 'What is the expected value of a random variable?',
    options: ['Its most likely value (mode)', 'The weighted average of all possible values, each weighted by its probability', 'The median value', 'The variance'],
    correctIndex: 1,
    explanation: 'E[X] = Σ x·P(X=x), the probability-weighted sum of all outcomes, representing the long-run average.',
    tags: ['expected-value', 'probability'],
  },
  {
    id: 'math-h-3',
    topic: 'math',
    difficulty: 'hard',
    question: 'What is a bijection?',
    options: ['A function that is only injective', 'A function that is both injective (one-to-one) and surjective (onto)', 'A function with multiple outputs', 'A partial function'],
    correctIndex: 1,
    explanation: 'A bijection is a perfect pairing — every domain element maps to a unique codomain element and vice versa.',
    tags: ['bijection', 'functions'],
  },
  {
    id: 'math-h-4',
    topic: 'math',
    difficulty: 'hard',
    question: 'What is the inclusion-exclusion principle for two sets A and B?',
    options: ['|A ∪ B| = |A| + |B|', '|A ∪ B| = |A| + |B| - |A ∩ B|', '|A ∩ B| = |A| - |B|', '|A ∪ B| = |A| × |B|'],
    correctIndex: 1,
    explanation: 'Inclusion-exclusion corrects double-counting: |A ∪ B| = |A| + |B| - |A ∩ B|, extensible to n sets.',
    tags: ['inclusion-exclusion', 'sets'],
  },
  {
    id: 'math-h-5',
    topic: 'math',
    difficulty: 'hard',
    question: 'What is a recurrence relation?',
    options: ['A closed-form formula', 'An equation defining each sequence term using one or more previous terms', 'A type of mathematical function', 'A probability distribution'],
    correctIndex: 1,
    explanation: 'A recurrence relation defines terms from previous ones (e.g., Fibonacci: F(n) = F(n-1) + F(n-2)), solved via Master Theorem or generating functions.',
    tags: ['recurrence', 'sequences'],
  },
];
