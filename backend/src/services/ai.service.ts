import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";

type ChatMode = "listener" | "laugh" | "brainstorm";

interface ChatInput {
  message: string;
  mode: ChatMode;
  affectiveState?: string;
  stressScore?: number;
  name?: string;
  weakTopics?: string[];
  recentMistakes?: string[];
}

interface BrainDumpInput {
  text: string;
  mood?: string;
  sleep?: number;
}

interface RecommendationInput {
  weakTopics: string[];
  recentMistakes: string[];
}

interface RecommendationOutput {
  suggestions: string[];
  explanation: string;
  fallbackUsed: boolean;
  provider: "gemini" | "local";
}

const geminiApiKey = process.env.GEMINI_API_KEY?.trim();
const geminiModelName = process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";
const geminiMaxAttempts = Math.max(1, Number(process.env.GEMINI_MAX_ATTEMPTS || 2));
let geminiModel: GenerativeModel | null = null;

const responseBank: Record<ChatMode, string> = {
  listener:
    "That sounds like a lot to carry. Let us name the toughest part first, then we can lighten the plan.",
  laugh:
    "Emergency comedy intervention: your syllabus is not a villain origin story, even if it is trying its best.",
  brainstorm:
    "Here is a gentle next move: pick one concept, one worked example, and one short recall round.",
};

const buildChatPrompt = ({
  affectiveState,
  message,
  mode,
  name,
  recentMistakes,
  stressScore,
  weakTopics,
}: ChatInput) => `
You are MindTrace Shift, a calm student-support assistant for a hackathon demo.
Reply in 2 to 4 sentences only.
Do not mention policies.
Do not diagnose.
Keep the tone supportive, practical, and concise.
Mode: ${mode}
Student name: ${name || "Student"}
Current affective state: ${affectiveState || "unknown"}
Current stress score: ${stressScore ?? "unknown"}
Recent weak topics: ${weakTopics?.length ? weakTopics.join(", ") : "unknown"}
Recent mistakes: ${recentMistakes?.length ? recentMistakes.join(" | ") : "unknown"}

Mode behavior:
- listener: empathetic, reflective, grounding
- laugh: light and warm, but never mocking the student
- brainstorm: actionable and specific, focused on the next step

If recent weak topics or mistakes are available, use them to suggest 1 to 2 exact revision areas.

Student message:
${message}
`;

const buildBrainDumpPrompt = ({ mood, sleep, text }: BrainDumpInput) => `
You are analyzing a student's brain dump for a hackathon demo app called MindTrace.
Return strict JSON only with this shape:
{
  "summary": "short summary",
  "stressSignals": ["signal1", "signal2"],
  "affectiveState": "curiosity" | "confusion" | "frustration" | "boredom",
  "suggestedAction": "short action"
}

Use the text primarily. Optional context:
- mood: ${mood || "unknown"}
- sleep hours: ${sleep ?? "unknown"}

Brain dump:
${text}
`;

const buildRecommendationPrompt = ({ recentMistakes, weakTopics }: RecommendationInput) => `
You are generating study recommendations for a hackathon demo app called MindTrace.
Return strict JSON only with this shape:
{
  "suggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"],
  "explanation": "One concise explanation"
}

Rules:
- Suggest 2 to 4 items.
- Each suggestion must be specific and action-oriented.
- Use exact concepts, not generic advice.
- Keep the explanation to one sentence.

Weak topics:
${weakTopics.length ? weakTopics.map((topic) => `- ${topic}`).join("\n") : "- none"}

Recent mistakes:
${recentMistakes.length ? recentMistakes.map((mistake) => `- ${mistake}`).join("\n") : "- none"}
`;

const tryParseJson = <T>(value: string): T | null => {
  try {
    return JSON.parse(value) as T;
  } catch {
    const jsonMatch = value.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return null;
    }

    try {
      return JSON.parse(jsonMatch[0]) as T;
    } catch {
      return null;
    }
  }
};

const getGeminiModel = () => {
  if (!geminiApiKey) {
    return null;
  }

  if (!geminiModel) {
    const client = new GoogleGenerativeAI(geminiApiKey);
    geminiModel = client.getGenerativeModel({ model: geminiModelName });
  }

  return geminiModel;
};

const isRetryableGeminiError = (error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  return /\[(500|502|503|504) /.test(message);
};

const wait = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const generateGeminiText = async (prompt: string) => {
  const model = getGeminiModel();

  if (!model) {
    return null;
  }

  let lastError: unknown;

  for (let attempt = 1; attempt <= geminiMaxAttempts; attempt += 1) {
    try {
      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    } catch (error) {
      lastError = error;

      if (attempt >= geminiMaxAttempts || !isRetryableGeminiError(error)) {
        break;
      }

      await wait(650 * attempt);
    }
  }

  throw lastError;
};

const toTitleCase = (value: string) =>
  value
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const topicSuggestionBank: Array<{
  matcher: RegExp;
  suggestions: string[];
}> = [
  {
    matcher: /\bdsa\b|array|stack|queue|tree|graph|heap|dp|dynamic programming/i,
    suggestions: ["Revise Time Complexity", "Practice Recursion Basics", "Review Core Data Structures"],
  },
  {
    matcher: /time complexity|big o|complexity/i,
    suggestions: ["Revise Time Complexity", "Compare O(n), O(log n), and O(n log n) patterns"],
  },
  {
    matcher: /space complexity|memory/i,
    suggestions: ["Revise Space Complexity", "Practice In-Place Optimization Basics"],
  },
  {
    matcher: /recursion|recursive/i,
    suggestions: ["Practice Recursion Basics", "Trace Recursive Calls by Hand"],
  },
  {
    matcher: /sql|join|normalization|transaction|index|dbms/i,
    suggestions: ["Revise SQL Joins", "Review Normalization Rules", "Practice Transaction and Indexing Basics"],
  },
  {
    matcher: /system design|cache|load balancer|shard|scal/i,
    suggestions: ["Review Caching Fundamentals", "Revise Scalability Patterns", "Practice Database vs Cache Tradeoffs"],
  },
  {
    matcher: /process|thread|deadlock|scheduling|memory management|\bos\b|operating system/i,
    suggestions: ["Revise CPU Scheduling", "Review Deadlock Conditions", "Practice Process vs Thread Concepts"],
  },
  {
    matcher: /tcp|udp|http|dns|network/i,
    suggestions: ["Revise TCP vs UDP", "Review HTTP Request Flow", "Practice DNS Resolution Basics"],
  },
  {
    matcher: /inheritance|polymorphism|solid|encapsulation|oop/i,
    suggestions: ["Revise OOP Pillars", "Review SOLID Principles", "Practice Inheritance vs Composition"],
  },
  {
    matcher: /javascript|promise|async|event loop|web dev|dom|css|rest api/i,
    suggestions: ["Practice Async JavaScript", "Review DOM and Event Loop Basics", "Revise REST API Fundamentals"],
  },
  {
    matcher: /probability|graph theory|set|logic|induction|math|discrete/i,
    suggestions: ["Revise Core Discrete Math", "Practice Logic and Set Theory", "Review Probability Basics"],
  },
];

const dedupeSuggestions = (suggestions: string[]) => Array.from(new Set(suggestions)).slice(0, 4);

const generateRuleBasedRecommendations = ({ recentMistakes, weakTopics }: RecommendationInput): RecommendationOutput => {
  const combinedSignals = [...weakTopics, ...recentMistakes].map((value) => value.trim()).filter(Boolean);
  const matchedSuggestions = combinedSignals.flatMap((signal) =>
    topicSuggestionBank.flatMap((entry) => (entry.matcher.test(signal) ? entry.suggestions : [])),
  );

  const fallbackTopics = weakTopics.length
    ? weakTopics.flatMap((topic) => [`Revise ${toTitleCase(topic)}`, `Practice ${toTitleCase(topic)} Basics`])
    : ["Revise Core Concepts", "Practice One Timed Recall Round", "Review Your Last Wrong Answers"];

  const suggestions = dedupeSuggestions([...matchedSuggestions, ...fallbackTopics]).slice(0, 3);
  const explanation = recentMistakes.length
    ? "Based on your recent mistakes and weak-topic pattern, these are the fastest concepts to tighten before the next test."
    : "Based on your recent weak-topic pattern, these are the best next concepts to revise.";

  return {
    suggestions,
    explanation,
    fallbackUsed: true,
    provider: "local",
  };
};

export const generateChatReply = async (input: ChatInput) => {
  const fallbackReply = responseBank[input.mode];
  const prompt = buildChatPrompt(input);

  if (!geminiApiKey) {
    return {
      reply: fallbackReply,
      fallbackUsed: true,
      provider: "local",
    };
  }

  try {
    const reply = (await generateGeminiText(prompt)) || "";

    return {
      reply: reply || fallbackReply,
      fallbackUsed: !reply,
      provider: "gemini",
    };
  } catch (error) {
    console.warn("Gemini chat fallback used:", error instanceof Error ? error.message : error);
    return {
      reply: fallbackReply,
      fallbackUsed: true,
      provider: "local",
    };
  }
};

export const extractBrainDumpInsights = async (input: BrainDumpInput) => {
  const fallback = {
    summary: input.text.slice(0, 140),
    stressSignals: ["overwhelm"],
    affectiveState: "confusion",
    suggestedAction: "Break the problem into one small task and take a short reset before continuing.",
    fallbackUsed: true,
    provider: "local",
  } as const;

  if (!geminiApiKey) {
    return fallback;
  }

  try {
    const raw = (await generateGeminiText(buildBrainDumpPrompt(input))) || "";
    const parsed = tryParseJson<{
      summary?: string;
      stressSignals?: string[];
      affectiveState?: "curiosity" | "confusion" | "frustration" | "boredom";
      suggestedAction?: string;
    }>(raw);

    if (!parsed) {
      return fallback;
    }

    return {
      summary: parsed.summary || fallback.summary,
      stressSignals: parsed.stressSignals?.length ? parsed.stressSignals : fallback.stressSignals,
      affectiveState: parsed.affectiveState || fallback.affectiveState,
      suggestedAction: parsed.suggestedAction || fallback.suggestedAction,
      fallbackUsed: false,
      provider: "gemini",
    };
  } catch (error) {
    console.warn("Gemini brain dump fallback used:", error instanceof Error ? error.message : error);
    return fallback;
  }
};

export const generateRecommendations = async (
  input: RecommendationInput,
): Promise<RecommendationOutput> => {
  const fallback = generateRuleBasedRecommendations(input);

  if (!geminiApiKey) {
    return fallback;
  }

  try {
    const raw = (await generateGeminiText(buildRecommendationPrompt(input))) || "";
    const parsed = tryParseJson<{
      suggestions?: string[];
      explanation?: string;
    }>(raw);

    if (!parsed?.suggestions?.length) {
      return fallback;
    }

    return {
      suggestions: dedupeSuggestions(parsed.suggestions),
      explanation: parsed.explanation || fallback.explanation,
      fallbackUsed: false,
      provider: "gemini",
    };
  } catch (error) {
    console.warn("Gemini recommend fallback used:", error instanceof Error ? error.message : error);
    return fallback;
  }
};
