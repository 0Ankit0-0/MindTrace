import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Switch, View } from 'react-native';
import { Circle, Svg } from 'react-native-svg';
import { Button, Snackbar, Surface, Text } from 'react-native-paper';

import { AppHeader } from '@/components/AppHeader';
import { MetricTile } from '@/components/MetricTile';
import { ScreenShell } from '@/components/ScreenShell';
import { SectionHeader } from '@/components/SectionHeader';
import { TestDifficulty, TestQuestion, TestTopic, testQuestionBank, testTopicMeta } from '@/constants/DummyData';
import { palette, radii, shadows, spacing } from '@/constants/theme';
import { useMindTrace } from '@/hooks/useMindTrace';
import {
  calculateTestResults,
  generateTestStudyRecommendations,
  getAdaptiveDifficulty,
} from '@/services/mindtrace-engine';

type ScreenState = 'home' | 'config' | 'active' | 'results';

const DIFF_ORDER: TestDifficulty[] = ['easy', 'medium', 'hard'];

const diffPillStyle = (diff: TestDifficulty, active: boolean) => ({
  backgroundColor: active
    ? diff === 'easy'
      ? palette.primaryMuted
      : diff === 'medium'
        ? palette.warningMuted
        : palette.dangerMuted
    : palette.mist,
  borderColor: active
    ? diff === 'easy'
      ? palette.primary
      : diff === 'medium'
        ? '#1A5C38'
        : palette.danger
    : palette.border,
  borderRadius: radii.pill,
  borderWidth: 1,
  paddingHorizontal: 18,
  paddingVertical: 8,
});

const diffPillTextColor = (diff: TestDifficulty, active: boolean) => {
  if (!active) return palette.slate;
  if (diff === 'easy') return palette.primary;
  if (diff === 'medium') return '#1A5C38';
  return palette.danger;
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]] as [T, T];
  }
  return a;
}

export default function TestScreen() {
  const {
    affectiveState,
    stressScore,
    startTest,
    submitTestAnswer,
    finishTest,
    testHistory,
  } = useMindTrace();

  const [screenState, setScreenState] = useState<ScreenState>('home');
  const [selectedTopic, setSelectedTopic] = useState<TestTopic | 'mixed' | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<TestDifficulty>(
    stressScore > 65 ? 'easy' : stressScore > 40 ? 'medium' : 'hard'
  );
  const [questionCount, setQuestionCount] = useState(10);
  const [adaptiveMode, setAdaptiveMode] = useState(true);

  // Active state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentDifficulty, setCurrentDifficulty] = useState<TestDifficulty>(selectedDifficulty);
  const [consecutiveWrong, setConsecutiveWrong] = useState(0);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [adaptationToast, setAdaptationToast] = useState<string | null>(null);
  const [totalElapsed, setTotalElapsed] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(0);
  const [questionQueue, setQuestionQueue] = useState<TestQuestion[]>([]);

  // Results state
  const [showAnswers, setShowAnswers] = useState(false);
  const [expandedAnswerId, setExpandedAnswerId] = useState<string | null>(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  // Timer
  useEffect(() => {
    if (screenState !== 'active') return;
    const interval = setInterval(() => setTotalElapsed((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [screenState]);

  // Build question queue
  useEffect(() => {
    if (screenState !== 'active' || !selectedTopic) return;

    const filtered =
      selectedTopic === 'mixed'
        ? [...testQuestionBank]
        : testQuestionBank.filter((q) => q.topic === selectedTopic);

    const byDiff: Record<TestDifficulty, TestQuestion[]> = { easy: [], medium: [], hard: [] };
    filtered.forEach((q) => byDiff[q.difficulty].push(q));

    const shuffled = {
      easy: shuffle(byDiff.easy),
      medium: shuffle(byDiff.medium),
      hard: shuffle(byDiff.hard),
    };

    const mainCount = Math.ceil(questionCount * 0.6);
    const otherCount = questionCount - mainCount;
    const others = DIFF_ORDER.filter((d) => d !== selectedDifficulty);
    const perOther = Math.ceil(otherCount / Math.max(others.length, 1));

    const queue: TestQuestion[] = [
      ...shuffled[selectedDifficulty].slice(0, mainCount),
      ...others.flatMap((d) => shuffled[d].slice(0, perOther)),
    ];

    setQuestionQueue(queue.slice(0, questionCount));
    setCurrentQuestionIndex(0);
    setCurrentDifficulty(selectedDifficulty);
    setConsecutiveWrong(0);
    setConsecutiveCorrect(0);
    setSelectedAnswer(null);
    setAnswered(false);
    setTotalElapsed(0);
    setQuestionStartTime(Date.now());
  }, [screenState, selectedTopic, selectedDifficulty, questionCount]);

  // Adaptation toast clear
  useEffect(() => {
    if (!adaptationToast) return;
    const t = setTimeout(() => setAdaptationToast(null), 2000);
    return () => clearTimeout(t);
  }, [adaptationToast]);

  const currentQuestion = questionQueue[currentQuestionIndex];

  const handleAnswer = (optionIndex: number) => {
    if (answered || !currentQuestion) return;

    setSelectedAnswer(optionIndex);
    setAnswered(true);

    const timeTaken = Math.round((Date.now() - questionStartTime) / 1000);
    submitTestAnswer(currentQuestion.id, optionIndex, timeTaken);

    const correct = optionIndex === currentQuestion.correctIndex;
    const newConsecWrong = correct ? 0 : consecutiveWrong + 1;
    const newConsecCorrect = correct ? consecutiveCorrect + 1 : 0;

    setConsecutiveWrong(newConsecWrong);
    setConsecutiveCorrect(newConsecCorrect);

    if (adaptiveMode) {
      const { newDifficulty, event } = getAdaptiveDifficulty(
        currentDifficulty,
        newConsecWrong,
        newConsecCorrect
      );
      if (event) {
        const toastMsg =
          event === 'three_wrong'
            ? `Adapting to ${newDifficulty} — let's rebuild momentum.`
            : `Great streak! Moving to ${newDifficulty} questions.`;
        setAdaptationToast(toastMsg);
        setCurrentDifficulty(newDifficulty);
      }
    }

    setTimeout(() => {
      if (currentQuestionIndex < questionQueue.length - 1) {
        setCurrentQuestionIndex((i) => i + 1);
        setSelectedAnswer(null);
        setAnswered(false);
        setQuestionStartTime(Date.now());
      } else {
        finishTest();
        setScreenState('results');
      }
    }, 1200);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // ── Home screen ──────────────────────────────────────────────────────────
  const renderHome = () => (
    <>
      <AppHeader
        eyebrow="Test"
        title="Adaptive Quiz"
        subtitle="Questions that learn from you in real time"
      />

      {stressScore > 60 || affectiveState === 'frustration' ? (
        <Surface style={styles.moodBanner}>
          <View style={styles.moodBannerRow}>
            <Ionicons color={palette.primary} name="leaf-outline" size={20} />
            <Text style={styles.moodBannerText}>
              Your current state is {affectiveState} — we will start with easier questions today.
            </Text>
          </View>
        </Surface>
      ) : null}

      <SectionHeader title="Pick a topic" />

      <View style={styles.topicGrid}>
        {(Object.keys(testTopicMeta) as TestTopic[]).map((topic) => {
          const meta = testTopicMeta[topic];
          return (
            <Pressable
              key={topic}
              onPress={() => {
                setSelectedTopic(topic);
                setScreenState('config');
              }}
              style={styles.topicCard}
            >
              <Ionicons color={palette.primary} name={meta.icon as 'git-branch-outline'} size={24} />
              <Text style={styles.topicLabel}>{meta.label}</Text>
              <Text style={styles.topicDesc}>{meta.description}</Text>
            </Pressable>
          );
        })}
      </View>

      <Button
        mode="outlined"
        onPress={() => {
          setSelectedTopic('mixed');
          setScreenState('config');
        }}
        style={styles.mixedButton}
      >
        Quick Random Mix
      </Button>
    </>
  );

  // ── Config screen ────────────────────────────────────────────────────────
  const renderConfig = () => {
    const topicKey = selectedTopic && selectedTopic !== 'mixed' ? selectedTopic : null;
    const meta = topicKey ? testTopicMeta[topicKey] : null;
    return (
    <>
      <Pressable onPress={() => setScreenState('home')} style={styles.backRow}>
        <Ionicons color={palette.primary} name="arrow-back-outline" size={20} />
        <Text style={styles.backText}>Back</Text>
      </Pressable>

      <Text style={styles.configTitle}>{meta ? meta.label : 'Mixed Topics'}</Text>
      {meta ? <Text style={styles.configDesc}>{meta.description}</Text> : null}

      <Text style={styles.configSectionLabel}>Difficulty</Text>
      <View style={styles.pillRow}>
        {DIFF_ORDER.map((d) => (
          <Pressable key={d} onPress={() => setSelectedDifficulty(d)} style={diffPillStyle(d, selectedDifficulty === d)}>
            <Text style={{ color: diffPillTextColor(d, selectedDifficulty === d), fontWeight: '700', textTransform: 'capitalize' }}>
              {d}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.configSectionLabel}>Questions</Text>
      <View style={styles.pillRow}>
        {[5, 10, 15, 20].map((n) => (
          <Pressable
            key={n}
            onPress={() => setQuestionCount(n)}
            style={[styles.countPill, questionCount === n && styles.countPillActive]}
          >
            <Text style={[styles.countPillText, questionCount === n && styles.countPillTextActive]}>{n}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.adaptiveRow}>
        <View style={styles.adaptiveLeft}>
          <Text style={styles.adaptiveLabel}>Adaptive Mode</Text>
          <Text style={styles.adaptiveHelper}>Difficulty adjusts based on your answers</Text>
        </View>
        <Switch
          onValueChange={setAdaptiveMode}
          trackColor={{ true: palette.primary }}
          value={adaptiveMode}
        />
      </View>

      <Button
        mode="contained"
        onPress={() => {
          if (!selectedTopic) return;
          startTest(selectedTopic, selectedDifficulty, questionCount, adaptiveMode);
          setScreenState('active');
        }}
        style={styles.startButton}
      >
        Start Test
      </Button>
    </>
    );
  };

  // ── Active screen ────────────────────────────────────────────────────────
  const renderActive = () => {
    if (!currentQuestion) return null;
    const progress = (currentQuestionIndex / Math.max(questionQueue.length, 1)) * 100;
    const optionLabels = ['A', 'B', 'C', 'D'] as const;

    return (
    <>
      {/* Top bar */}
      <View style={styles.activeTopBar}>
        <Text style={styles.progressText}>
          {currentQuestionIndex + 1}/{questionQueue.length}
        </Text>
        <View style={[styles.diffBadge, {
          backgroundColor: currentDifficulty === 'easy' ? palette.primaryMuted : currentDifficulty === 'medium' ? palette.warningMuted : palette.dangerMuted,
        }]}>
          <Text style={[styles.diffBadgeText, {
            color: currentDifficulty === 'easy' ? palette.primary : currentDifficulty === 'medium' ? '#1A5C38' : palette.danger,
          }]}>
            {currentDifficulty.toUpperCase()}
          </Text>
        </View>
        <Text style={styles.timerText}>{formatTime(totalElapsed)}</Text>
      </View>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      {/* Adaptation toast */}
      {adaptationToast ? (
        <View style={styles.adaptationToast}>
          <Text style={styles.adaptationToastText}>{adaptationToast}</Text>
        </View>
      ) : null}

      {/* Question card */}
      <Surface style={styles.questionCard}>
        <Text style={styles.questionText}>{currentQuestion.question}</Text>

        {currentQuestion.options.map((option, idx) => {
          let bg = palette.mist;
          let border = palette.border;
          if (answered) {
            if (idx === currentQuestion.correctIndex) {
              bg = palette.primaryMuted;
              border = palette.primary;
            } else if (idx === selectedAnswer && idx !== currentQuestion.correctIndex) {
              bg = palette.dangerMuted;
              border = palette.danger;
            }
          }
          return (
            <Pressable
              key={idx}
              onPress={() => handleAnswer(idx)}
              style={[styles.optionItem, { backgroundColor: bg, borderColor: border }]}
            >
              <View style={[styles.optionBadge, {
                backgroundColor: answered && idx === currentQuestion.correctIndex
                  ? palette.primary
                  : answered && idx === selectedAnswer
                    ? palette.danger
                    : palette.border,
              }]}>
                <Text style={styles.optionBadgeText}>{optionLabels[idx]}</Text>
              </View>
              <Text style={styles.optionText}>{option}</Text>
            </Pressable>
          );
        })}

        {answered ? (
          <View style={styles.explanationBox}>
            <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
          </View>
        ) : null}
      </Surface>

      {/* Dot indicators */}
      <View style={styles.dotsRow}>
        {questionQueue.map((_, idx) => (
          <View
            key={idx}
            style={[
              styles.dot,
              idx < currentQuestionIndex && styles.dotAnswered,
              idx === currentQuestionIndex && styles.dotCurrent,
            ]}
          />
        ))}
      </View>
    </>
    );
  };

  // ── Results screen ───────────────────────────────────────────────────────
  const renderResults = () => {
    const session = testHistory[0];
    if (!session) return null;

    const { score, weakTopics, topicBreakdown, moodCorrelation, peakDifficulty } = calculateTestResults(
      session.answers,
      session.stressScoreAtStart,
      session.affectiveStateAtStart
    );

    const recommendations = generateTestStudyRecommendations(weakTopics, session.affectiveStateAtStart, session.stressScoreAtStart);
    const R = 70;
    const circumference = 2 * Math.PI * R;
    const strokeDashoffset = circumference * (1 - score / 100);
    const correctCount = session.answers.filter((a) => a.correct).length;
    const avgTime = session.answers.length
      ? Math.round(session.answers.reduce((s, a) => s + a.timeTakenSeconds, 0) / session.answers.length)
      : 0;

    return (
    <>
      <SectionHeader title="Your Results" />

      {/* Score circle */}
      <View style={styles.scoreCircleWrap}>
        <Svg height={180} width={180}>
          <Circle cx={90} cy={90} fill="none" r={R} stroke={palette.border} strokeWidth={12} />
          <Circle
            cx={90}
            cy={90}
            fill="none"
            r={R}
            stroke={palette.primary}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            strokeWidth={12}
            transform="rotate(-90, 90, 90)"
          />
        </Svg>
        <View style={styles.scoreOverlay}>
          <Text style={styles.scoreNumber}>{score}%</Text>
          <Text style={styles.scoreLabel}>Score</Text>
        </View>
      </View>

      {/* Metric tiles */}
      <View style={styles.resultMetrics}>
        <MetricTile label="Correct" support={`${correctCount}/${session.answers.length}`} tone="green" value={`${correctCount}`} />
        <MetricTile label="Avg Time" support="per question" tone="blue" value={`${avgTime}s`} />
        <MetricTile label="Peak Level" support="difficulty reached" tone="purple" value={peakDifficulty} />
      </View>

      {/* Mood correlation */}
      <Surface style={styles.resultCard}>
        <SectionHeader title="Mood Correlation" />
        <Text style={styles.corrLabel}>Early accuracy</Text>
        <View style={styles.corrTrack}>
          <View style={[styles.corrFill, { width: `${moodCorrelation.earlyAccuracy}%` }]} />
        </View>
        <Text style={styles.corrLabel}>Late accuracy</Text>
        <View style={styles.corrTrack}>
          <View style={[styles.corrFill, { width: `${moodCorrelation.lateAccuracy}%` }]} />
        </View>
        <Text style={styles.corrInsight}>{moodCorrelation.insight}</Text>
      </Surface>

      {/* Weak topics */}
      <Surface style={styles.resultCard}>
        <SectionHeader title="Weak Topics" />
        {weakTopics.length === 0 ? (
          <Text style={styles.noWeakText}>No critical weak areas — strong session!</Text>
        ) : (
          weakTopics.map((t) => {
            const bd = topicBreakdown[t];
            const pct = bd ? Math.round((bd.correct / bd.total) * 100) : 0;
            return (
              <View key={t} style={styles.weakRow}>
                <Text style={styles.weakLabel}>{testTopicMeta[t].label}</Text>
                <View style={styles.corrTrack}>
                  <View style={[styles.corrFillDanger, { width: `${pct}%` }]} />
                </View>
                <Text style={styles.weakSub}>{bd?.correct ?? 0}/{bd?.total ?? 0} correct</Text>
              </View>
            );
          })
        )}
      </Surface>

      {/* Study recommendations */}
      {recommendations.length > 0 ? (
        <Surface style={styles.resultCard}>
          <SectionHeader title="Study Recommendations" />
          {recommendations.map((rec) => (
            <View key={rec.topic} style={styles.recCard}>
              <Text style={styles.recLabel}>{rec.label}</Text>
              <Text style={styles.recApproach}>{rec.approach}</Text>
              <View style={styles.recFooter}>
                <View style={styles.durationPill}>
                  <Text style={styles.durationText}>{rec.duration}</Text>
                </View>
                <Button
                  mode="contained"
                  onPress={() => setSnackbarVisible(true)}
                  style={styles.saveButton}
                  compact
                >
                  Save to Path
                </Button>
              </View>
            </View>
          ))}
        </Surface>
      ) : null}

      {/* Answers review */}
      <Surface style={styles.resultCard}>
        <Pressable onPress={() => setShowAnswers((v) => !v)} style={styles.answersToggle}>
          <Text style={styles.answersToggleText}>{showAnswers ? 'Hide Answers' : 'Show Answers'}</Text>
          <Ionicons color={palette.primary} name={showAnswers ? 'chevron-up-outline' : 'chevron-down-outline'} size={18} />
        </Pressable>
        {showAnswers
          ? session.answers.map((ans, idx) => {
              const q = testQuestionBank.find((x) => x.id === ans.questionId);
              if (!q) return null;
              const expanded = expandedAnswerId === ans.questionId;
              return (
                <Pressable
                  key={ans.questionId}
                  onPress={() => setExpandedAnswerId(expanded ? null : ans.questionId)}
                  style={styles.answerRow}
                >
                  <View style={styles.answerRowTop}>
                    <Text numberOfLines={2} style={styles.answerQuestion}>
                      {idx + 1}. {q.question.slice(0, 70)}{q.question.length > 70 ? '…' : ''}
                    </Text>
                    <Ionicons
                      color={ans.correct ? palette.primary : palette.danger}
                      name={ans.correct ? 'checkmark-circle-outline' : 'close-circle-outline'}
                      size={20}
                    />
                  </View>
                  {expanded ? (
                    <View style={styles.answerDetail}>
                      <Text style={[styles.answerPick, { color: ans.correct ? palette.primary : palette.danger }]}>
                        Your answer: {q.options[ans.selectedIndex]}
                      </Text>
                      {!ans.correct ? (
                        <Text style={styles.answerCorrect}>Correct: {q.options[q.correctIndex]}</Text>
                      ) : null}
                      <Text style={styles.answerExplain}>{q.explanation}</Text>
                    </View>
                  ) : null}
                </Pressable>
              );
            })
          : null}
      </Surface>

      {/* Bottom buttons */}
      <View style={styles.resultButtons}>
        <Button mode="outlined" onPress={() => setScreenState('config')} style={styles.retakeBtn}>
          Retake
        </Button>
        <Button mode="contained" onPress={() => setScreenState('home')} style={styles.newTopicBtn}>
          New Topic
        </Button>
      </View>

      <Snackbar onDismiss={() => setSnackbarVisible(false)} visible={snackbarVisible}>
        Topic saved to your study path.
      </Snackbar>
    </>
    );
  };

  return (
    <ScreenShell>
      {screenState === 'home' && renderHome()}
      {screenState === 'config' && renderConfig()}
      {screenState === 'active' && renderActive()}
      {screenState === 'results' && renderResults()}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  // Home
  moodBanner: {
    backgroundColor: palette.mintSoft,
    borderLeftColor: palette.primary,
    borderLeftWidth: 4,
    borderRadius: radii.md,
    marginBottom: spacing.md,
    marginTop: spacing.md,
    padding: spacing.md,
  },
  moodBannerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  moodBannerText: {
    color: palette.ink,
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
  },
  topicGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  topicCard: {
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderRadius: radii.md,
    borderWidth: 1,
    padding: spacing.md,
    width: '47%',
    ...shadows.card,
  },
  topicLabel: {
    color: palette.navy,
    fontSize: 15,
    fontWeight: '800',
    marginTop: spacing.sm,
  },
  topicDesc: {
    color: palette.slate,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },
  mixedButton: {
    marginTop: spacing.sm,
  },
  // Config
  backRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  backText: {
    color: palette.primary,
    fontWeight: '700',
  },
  configTitle: {
    color: palette.navy,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  configDesc: {
    color: palette.slate,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: spacing.lg,
  },
  configSectionLabel: {
    color: palette.ink,
    fontWeight: '700',
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  countPill: {
    backgroundColor: palette.mist,
    borderColor: palette.border,
    borderRadius: radii.pill,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  countPillActive: {
    backgroundColor: palette.primaryMuted,
    borderColor: palette.primary,
  },
  countPillText: {
    color: palette.slate,
    fontWeight: '700',
  },
  countPillTextActive: {
    color: palette.primary,
  },
  adaptiveRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },
  adaptiveLeft: {
    flex: 1,
  },
  adaptiveLabel: {
    color: palette.navy,
    fontWeight: '700',
  },
  adaptiveHelper: {
    color: palette.slate,
    fontSize: 13,
    marginTop: 2,
  },
  startButton: {
    marginTop: spacing.xl,
  },
  // Active
  activeTopBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  progressText: {
    color: palette.slate,
    fontWeight: '700',
  },
  diffBadge: {
    borderRadius: radii.pill,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  diffBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  timerText: {
    color: palette.slate,
    fontWeight: '700',
  },
  progressTrack: {
    backgroundColor: palette.border,
    borderRadius: radii.pill,
    height: 6,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: palette.primary,
    borderRadius: radii.pill,
    height: 6,
  },
  adaptationToast: {
    backgroundColor: palette.mintSoft,
    borderRadius: radii.md,
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  adaptationToastText: {
    color: palette.ink,
    fontWeight: '700',
    textAlign: 'center',
  },
  questionCard: {
    backgroundColor: palette.surface,
    borderRadius: radii.xl,
    padding: spacing.lg,
    ...shadows.card,
  },
  questionText: {
    color: palette.navy,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 27,
    marginBottom: spacing.lg,
  },
  optionItem: {
    alignItems: 'center',
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.sm,
    padding: spacing.md,
  },
  optionBadge: {
    alignItems: 'center',
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  optionBadgeText: {
    color: palette.surface,
    fontWeight: '800',
  },
  optionText: {
    color: palette.navy,
    flex: 1,
    lineHeight: 22,
  },
  explanationBox: {
    backgroundColor: palette.mintSoft,
    borderRadius: radii.md,
    marginTop: spacing.md,
    padding: spacing.md,
  },
  explanationText: {
    color: palette.ink,
    fontStyle: 'italic',
    lineHeight: 21,
  },
  dotsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  dot: {
    backgroundColor: palette.border,
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  dotAnswered: {
    backgroundColor: palette.primary,
  },
  dotCurrent: {
    backgroundColor: palette.primary,
    borderRadius: 4,
    width: 20,
  },
  // Results
  scoreCircleWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  scoreOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreNumber: {
    color: palette.navy,
    fontSize: 40,
    fontWeight: '900',
  },
  scoreLabel: {
    color: palette.slate,
    fontSize: 14,
    marginTop: 2,
  },
  resultMetrics: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  resultCard: {
    backgroundColor: palette.surface,
    borderRadius: radii.md,
    marginBottom: spacing.md,
    padding: spacing.md,
    ...shadows.card,
  },
  corrLabel: {
    color: palette.slate,
    fontSize: 13,
    marginBottom: 4,
    marginTop: spacing.sm,
  },
  corrTrack: {
    backgroundColor: palette.border,
    borderRadius: 4,
    height: 8,
    overflow: 'hidden',
  },
  corrFill: {
    backgroundColor: palette.primary,
    borderRadius: 4,
    height: 8,
  },
  corrFillDanger: {
    backgroundColor: palette.danger,
    borderRadius: 4,
    height: 8,
  },
  corrInsight: {
    color: palette.slate,
    fontStyle: 'italic',
    lineHeight: 21,
    marginTop: spacing.md,
  },
  noWeakText: {
    color: palette.primary,
    fontWeight: '700',
  },
  weakRow: {
    marginBottom: spacing.md,
  },
  weakLabel: {
    color: palette.navy,
    fontWeight: '700',
    marginBottom: 4,
  },
  weakSub: {
    color: palette.slate,
    fontSize: 12,
    marginTop: 4,
  },
  recCard: {
    backgroundColor: palette.mintSoft,
    borderRadius: radii.md,
    marginBottom: spacing.sm,
    padding: spacing.md,
  },
  recLabel: {
    color: palette.navy,
    fontWeight: '800',
    marginBottom: 4,
  },
  recApproach: {
    color: palette.ink,
    lineHeight: 21,
  },
  recFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  durationPill: {
    backgroundColor: palette.primaryMuted,
    borderRadius: radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  durationText: {
    color: palette.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  saveButton: {
    borderRadius: radii.pill,
  },
  answersToggle: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  answersToggleText: {
    color: palette.primary,
    fontWeight: '700',
  },
  answerRow: {
    borderTopColor: palette.border,
    borderTopWidth: 1,
    paddingVertical: spacing.sm,
  },
  answerRowTop: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  answerQuestion: {
    color: palette.navy,
    flex: 1,
    fontWeight: '600',
    lineHeight: 20,
  },
  answerDetail: {
    marginTop: spacing.sm,
  },
  answerPick: {
    fontWeight: '700',
    lineHeight: 20,
  },
  answerCorrect: {
    color: palette.primary,
    fontWeight: '700',
    lineHeight: 20,
    marginTop: 2,
  },
  answerExplain: {
    color: palette.slate,
    fontStyle: 'italic',
    lineHeight: 21,
    marginTop: spacing.sm,
  },
  resultButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  retakeBtn: {
    flex: 1,
  },
  newTopicBtn: {
    flex: 1,
  },
});
