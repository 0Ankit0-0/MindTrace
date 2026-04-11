import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Switch, View, useWindowDimensions } from 'react-native';
import { Button, Snackbar, Surface, Text } from 'react-native-paper';

import { AppHeader } from '@/components/AppHeader';
import { MetricTile } from '@/components/MetricTile';
import { ScreenShell } from '@/components/ScreenShell';
import { SectionHeader } from '@/components/SectionHeader';
import { TestDifficulty, TestQuestion, TestTopic, testQuestionBank, testTopicMeta } from '@/constants/DummyData';
import { palette, radii, shadows, spacing } from '@/constants/theme';
import { useMindTrace } from '@/hooks/useMindTrace';
import { calculateTestResults, generateTestStudyRecommendations } from '@/services/test-analytics';

type ScreenState = 'home' | 'config' | 'active' | 'results';

const DIFFICULTIES: TestDifficulty[] = ['easy', 'medium', 'hard'];
const COUNT_OPTIONS = [5, 10, 15, 20];

const shuffle = <T,>(items: T[]) => {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
};

const getPool = (topic: TestTopic | 'mixed' | null, difficulty: TestDifficulty) =>
  testQuestionBank.filter(
    (question) => question.difficulty === difficulty && (topic === 'mixed' || topic === null || question.topic === topic)
  );

export default function TestScreen() {
  const { width } = useWindowDimensions();
  const isWide = width >= 720;
  const {
    affectiveState,
    gamificationStatus,
    isAnalyzingSession,
    latestAiRecommendations,
    latestSessionAnalysis,
    startTest,
    submitTestAnswer,
    finishTest,
    stressScore,
    syncError,
    testHistory,
  } = useMindTrace();
  const [screenState, setScreenState] = useState<ScreenState>('home');
  const [selectedTopic, setSelectedTopic] = useState<TestTopic | 'mixed' | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<TestDifficulty>(
    stressScore >= 70 ? 'easy' : stressScore >= 50 ? 'medium' : 'hard'
  );
  const [questionCount, setQuestionCount] = useState(5);
  const [adaptiveInsights, setAdaptiveInsights] = useState(true);
  const [questionQueue, setQuestionQueue] = useState<TestQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showAnswers, setShowAnswers] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const availableQuestions = useMemo(() => getPool(selectedTopic, selectedDifficulty), [selectedDifficulty, selectedTopic]);
  const countOptions = COUNT_OPTIONS.filter((count) => count <= availableQuestions.length);
  const lockedQuestionCount = countOptions.includes(questionCount) ? questionCount : countOptions[countOptions.length - 1] ?? 0;
  const currentQuestion = questionQueue[currentQuestionIndex];
  const latestSession = testHistory[0];

  useEffect(() => {
    if (screenState !== 'active') {
      return undefined;
    }
    const timer = setInterval(() => setElapsedSeconds((current) => current + 1), 1000);
    return () => clearInterval(timer);
  }, [screenState]);

  useEffect(() => {
    if (countOptions.length && !countOptions.includes(questionCount)) {
      setQuestionCount(countOptions[countOptions.length - 1]);
    }
  }, [countOptions, questionCount]);

  const beginTest = () => {
    if (!selectedTopic || !countOptions.length) {
      return;
    }
    const queue = shuffle(getPool(selectedTopic, selectedDifficulty)).slice(0, lockedQuestionCount);
    startTest(selectedTopic, selectedDifficulty, queue.length, adaptiveInsights);
    setQuestionQueue(queue);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setAnswered(false);
    setQuestionStartTime(Date.now());
    setElapsedSeconds(0);
    setScreenState('active');
  };

  const handleAnswer = (optionIndex: number) => {
    if (!currentQuestion || answered) {
      return;
    }
    setSelectedAnswer(optionIndex);
    setAnswered(true);
    const timeTakenSeconds = Math.max(1, Math.round((Date.now() - questionStartTime) / 1000));
    submitTestAnswer(currentQuestion.id, optionIndex, timeTakenSeconds);
    setTimeout(() => {
      if (currentQuestionIndex >= questionQueue.length - 1) {
        finishTest();
        setScreenState('results');
        return;
      }
      setCurrentQuestionIndex((current) => current + 1);
      setSelectedAnswer(null);
      setAnswered(false);
      setQuestionStartTime(Date.now());
    }, 800);
  };

  const metricWrap = [styles.metricWrap, isWide && styles.metricWrapWide];

  if (screenState === 'home') {
    return (
      <ScreenShell>
        <AppHeader eyebrow="Test" title="Stable Quiz Flow" subtitle="Difficulty and question count lock before the test starts." />
        {(stressScore >= 60 || affectiveState === 'frustration') && (
          <Surface style={styles.banner}>
            <Ionicons color={palette.primary} name="leaf-outline" size={18} />
            <Text style={styles.bannerText}>You look a bit strained. Starting easier will produce cleaner results.</Text>
          </Surface>
        )}
        <SectionHeader title="Choose a topic" />
        <View style={styles.grid}>
          {(Object.keys(testTopicMeta) as TestTopic[]).map((topic) => (
            <Pressable key={topic} onPress={() => { setSelectedTopic(topic); setScreenState('config'); }} style={styles.topicCard}>
              <Ionicons color={palette.primary} name={testTopicMeta[topic].icon as keyof typeof Ionicons.glyphMap} size={20} />
              <Text style={styles.topicTitle}>{testTopicMeta[topic].label}</Text>
              <Text style={styles.muted}>{testTopicMeta[topic].description}</Text>
            </Pressable>
          ))}
        </View>
        <Button mode="outlined" onPress={() => { setSelectedTopic('mixed'); setScreenState('config'); }} style={styles.topButton}>
          Mixed Mock Test
        </Button>
      </ScreenShell>
    );
  }

  if (screenState === 'config') {
    return (
      <ScreenShell>
        <Pressable onPress={() => setScreenState('home')} style={styles.backRow}>
          <Ionicons color={palette.primary} name="arrow-back-outline" size={18} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <Surface style={styles.card}>
          <Text style={styles.titleText}>
            {selectedTopic === 'mixed' ? 'Mixed Topics' : selectedTopic ? testTopicMeta[selectedTopic].label : 'Topic'}
          </Text>
          <Text style={styles.muted}>
            {selectedTopic === 'mixed'
              ? 'Fixed-difficulty questions pulled from multiple topics.'
              : selectedTopic
                ? testTopicMeta[selectedTopic].description
                : 'Choose a topic.'}
          </Text>
          <Text style={styles.sectionLabel}>Difficulty</Text>
          <View style={styles.rowWrap}>
            {DIFFICULTIES.map((difficulty) => (
              <Pressable
                key={difficulty}
                onPress={() => setSelectedDifficulty(difficulty)}
                style={[styles.pill, selectedDifficulty === difficulty && styles.pillActive]}
              >
                <Text style={[styles.pillText, selectedDifficulty === difficulty && styles.pillTextActive]}>{difficulty}</Text>
              </Pressable>
            ))}
          </View>
          <Text style={styles.sectionLabel}>Question Count</Text>
          <View style={styles.rowWrap}>
            {countOptions.map((count) => (
              <Pressable key={count} onPress={() => setQuestionCount(count)} style={[styles.pill, lockedQuestionCount === count && styles.pillActive]}>
                <Text style={[styles.pillText, lockedQuestionCount === count && styles.pillTextActive]}>{count}</Text>
              </Pressable>
            ))}
          </View>
          <Text style={styles.muted}>{availableQuestions.length} questions available at this locked difficulty.</Text>
          <View style={styles.switchRow}>
            <View style={styles.switchCopy}>
              <Text style={styles.switchTitle}>Adaptive AI coaching</Text>
              <Text style={styles.muted}>Shift uses your mistakes after the test. It does not change live difficulty.</Text>
            </View>
            <Switch onValueChange={setAdaptiveInsights} trackColor={{ true: palette.primary }} value={adaptiveInsights} />
          </View>
          <Button disabled={!selectedTopic || !countOptions.length} mode="contained" onPress={beginTest} style={styles.topButton}>
            Start Fixed Test
          </Button>
        </Surface>
      </ScreenShell>
    );
  }

  if (screenState === 'active' && currentQuestion) {
    return (
      <ScreenShell>
        <View style={styles.topBar}>
          <Text style={styles.progressText}>{currentQuestionIndex + 1}/{questionQueue.length}</Text>
          <View style={styles.badge}><Text style={styles.badgeText}>{selectedDifficulty.toUpperCase()}</Text></View>
          <Text style={styles.progressText}>{elapsedSeconds}s</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${((currentQuestionIndex + 1) / questionQueue.length) * 100}%` }]} />
        </View>
        <Surface style={styles.card}>
          <Text style={styles.questionTopic}>{testTopicMeta[currentQuestion.topic].label}</Text>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
          {currentQuestion.options.map((option, index) => {
            const correct = answered && index === currentQuestion.correctIndex;
            const wrong = answered && index === selectedAnswer && index !== currentQuestion.correctIndex;
            return (
              <Pressable key={`${currentQuestion.id}-${option}`} onPress={() => handleAnswer(index)} style={[styles.option, correct && styles.optionCorrect, wrong && styles.optionWrong]}>
                <Text style={styles.optionText}>{option}</Text>
              </Pressable>
            );
          })}
          {answered && <Text style={styles.explanation}>{currentQuestion.explanation}</Text>}
        </Surface>
      </ScreenShell>
    );
  }

  if (!latestSession) {
    return <ScreenShell><Text style={styles.muted}>No session results available.</Text></ScreenShell>;
  }

  const results = calculateTestResults(
    latestSession.answers,
    latestSession.stressScoreAtStart,
    latestSession.affectiveStateAtStart
  );
  const studyRecommendations = generateTestStudyRecommendations(
    results.weakTopics,
    latestSession.affectiveStateAtStart,
    latestSession.stressScoreAtStart
  );
  const correctCount = latestSession.answers.filter((answer) => answer.correct).length;
  const averageTime = latestSession.answers.length
    ? Math.round(latestSession.answers.reduce((total, answer) => total + answer.timeTakenSeconds, 0) / latestSession.answers.length)
    : 0;

  return (
    <ScreenShell>
      <SectionHeader title="Results" />
      <Surface style={styles.card}>
        <Text style={styles.score}>{results.score}%</Text>
        <Text style={styles.titleText}>Difficulty stayed locked at {latestSession.lockedDifficulty}</Text>
        <Text style={styles.muted}>{latestSession.questionCount} questions, {correctCount} correct, average time {averageTime}s.</Text>
        <Text style={styles.muted}>{results.moodCorrelation.insight}</Text>
      </Surface>

      <View style={styles.metrics}>
        <View style={metricWrap}><MetricTile label="Correct" support={`${correctCount}/${latestSession.answers.length}`} tone="green" value={`${correctCount}`} /></View>
        <View style={metricWrap}><MetricTile label="Avg Time" support="Per question" tone="blue" value={`${averageTime}s`} /></View>
        <View style={metricWrap}><MetricTile label="Peak Level" support="Locked for full test" tone="purple" value={latestSession.lockedDifficulty} /></View>
      </View>

      {latestAiRecommendations && (
        <Surface style={styles.card}>
          <SectionHeader title="Shift Recommendations" />
          <Text style={styles.titleText}>{latestAiRecommendations.explanation}</Text>
          <View style={styles.rowWrap}>
            {latestAiRecommendations.suggestions.map((suggestion) => (
              <View key={suggestion} style={styles.chip}><Text style={styles.chipText}>{suggestion}</Text></View>
            ))}
          </View>
        </Surface>
      )}

      {isAnalyzingSession ? (
        <Surface style={styles.card}><Text style={styles.muted}>Analyzing session stress, behavior, and cognitive drift...</Text></Surface>
      ) : latestSessionAnalysis ? (
        <Surface style={styles.card}>
          <SectionHeader title="Session Analysis" />
          <View style={styles.metrics}>
            <View style={metricWrap}><MetricTile label="Stress" support={latestSessionAnalysis.state} tone={latestSessionAnalysis.state === 'critical' ? 'red' : latestSessionAnalysis.state === 'declining' ? 'yellow' : 'green'} value={`${latestSessionAnalysis.stressScore}`} /></View>
            <View style={metricWrap}><MetricTile label="Drift" support={latestSessionAnalysis.drift.driftSeverity} tone={latestSessionAnalysis.drift.driftDetected ? 'red' : 'blue'} value={latestSessionAnalysis.drift.driftDetected ? 'Detected' : 'Stable'} /></View>
            <View style={metricWrap}><MetricTile label="Pulse" support="30% weight" tone="blue" value={`${latestSessionAnalysis.components.pulse}`} /></View>
          </View>
          <Text style={styles.titleText}>{latestSessionAnalysis.reason}</Text>
          <Text style={styles.muted}>{latestSessionAnalysis.recommendation}</Text>
          <Text style={styles.muted}>Accuracy drop {Math.round(latestSessionAnalysis.drift.accuracyDrop * 100)}%, response time +{Math.round(latestSessionAnalysis.drift.responseTimeIncrease / 1000)}s, mistakes +{Math.round(latestSessionAnalysis.drift.mistakeFrequencyIncrease * 100)}%.</Text>
          <View style={styles.rowWrap}>
            {latestSessionAnalysis.signals.map((signal) => (
              <View key={signal} style={styles.signalChip}><Text style={styles.signalChipText}>{signal}</Text></View>
            ))}
          </View>
        </Surface>
      ) : syncError ? (
        <Surface style={styles.card}><Text style={styles.muted}>{syncError}</Text></Surface>
      ) : null}

      {gamificationStatus && (
        <Surface style={styles.card}>
          <SectionHeader title="Progress" />
          <View style={styles.metrics}>
            <View style={metricWrap}><MetricTile label="XP" support="Recovery progress" tone="green" value={`${gamificationStatus.xp}`} /></View>
            <View style={metricWrap}><MetricTile label="Streak" support="Consistent sessions" tone="blue" value={`${gamificationStatus.streak}`} /></View>
          </View>
          <View style={styles.rowWrap}>
            {gamificationStatus.badges.length ? gamificationStatus.badges.map((badge) => (
              <View key={badge} style={styles.chip}><Text style={styles.chipText}>{badge}</Text></View>
            )) : <Text style={styles.muted}>No badges yet.</Text>}
          </View>
        </Surface>
      )}

      <Surface style={styles.card}>
        <SectionHeader title="Weak Areas" />
        {results.weakTopics.length ? results.weakTopics.map((topic) => (
          <View key={topic} style={styles.reviewRow}>
            <Text style={styles.titleText}>{testTopicMeta[topic].label}</Text>
            <Text style={styles.muted}>{results.topicBreakdown[topic].correct}/{results.topicBreakdown[topic].total} correct</Text>
          </View>
        )) : <Text style={styles.muted}>No major weak area surfaced.</Text>}
      </Surface>

      {!!studyRecommendations.length && (
        <Surface style={styles.card}>
          <SectionHeader title="Focus Plan" />
          {studyRecommendations.map((recommendation) => (
            <View key={recommendation.topic} style={styles.reviewRow}>
              <Text style={styles.titleText}>{recommendation.label}</Text>
              <Text style={styles.muted}>{recommendation.approach}</Text>
              <Button compact mode="contained-tonal" onPress={() => setSnackbarVisible(true)}>Save</Button>
            </View>
          ))}
        </Surface>
      )}

      <Surface style={styles.card}>
        <Pressable onPress={() => setShowAnswers((current) => !current)} style={styles.backRow}>
          <Text style={styles.backText}>{showAnswers ? 'Hide answers' : 'Show answers'}</Text>
          <Ionicons color={palette.primary} name={showAnswers ? 'chevron-up-outline' : 'chevron-down-outline'} size={18} />
        </Pressable>
        {showAnswers && latestSession.answers.map((answer, index) => {
          const question = testQuestionBank.find((item) => item.id === answer.questionId);
          if (!question) {
            return null;
          }
          return (
            <View key={answer.questionId} style={styles.reviewRow}>
              <Text style={styles.titleText}>{index + 1}. {question.question}</Text>
              <Text style={styles.muted}>Your answer: {question.options[answer.selectedIndex]}</Text>
              {!answer.correct && <Text style={styles.correctText}>Correct: {question.options[question.correctIndex]}</Text>}
            </View>
          );
        })}
      </Surface>

      <View style={[styles.actions, isWide && styles.actionsWide]}>
        <Button mode="outlined" onPress={() => setScreenState('config')} style={styles.actionButton}>Retake</Button>
        <Button mode="contained" onPress={() => setScreenState('home')} style={styles.actionButton}>New Topic</Button>
      </View>
      <Snackbar onDismiss={() => setSnackbarVisible(false)} visible={snackbarVisible}>Topic saved to your study path.</Snackbar>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  banner: { alignItems: 'center', backgroundColor: palette.surface, borderRadius: radii.md, flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md, padding: spacing.md, ...shadows.card },
  bannerText: { color: palette.ink, flex: 1, lineHeight: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.sm },
  topicCard: { backgroundColor: palette.surface, borderColor: palette.border, borderRadius: radii.md, borderWidth: 1, flexGrow: 1, minWidth: 150, padding: spacing.md, ...shadows.card },
  topicTitle: { color: palette.navy, fontSize: 16, fontWeight: '800', marginTop: spacing.sm },
  topButton: { marginTop: spacing.lg },
  backRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.xs, justifyContent: 'space-between' },
  backText: { color: palette.primary, fontWeight: '700' },
  card: { backgroundColor: palette.surface, borderRadius: radii.lg, marginTop: spacing.md, padding: spacing.lg, ...shadows.card },
  titleText: { color: palette.navy, fontSize: 16, fontWeight: '800', lineHeight: 24 },
  muted: { color: palette.slate, lineHeight: 21, marginTop: spacing.xs },
  sectionLabel: { color: palette.navy, fontWeight: '800', marginTop: spacing.lg },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.sm },
  pill: { borderColor: palette.border, borderRadius: radii.pill, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 10 },
  pillActive: { backgroundColor: palette.primaryMuted, borderColor: palette.primary },
  pillText: { color: palette.slate, fontWeight: '700', textTransform: 'capitalize' },
  pillTextActive: { color: palette.primary },
  switchRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
  switchCopy: { flex: 1 },
  switchTitle: { color: palette.navy, fontWeight: '800' },
  topBar: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md },
  progressText: { color: palette.slate, fontWeight: '700' },
  badge: { backgroundColor: palette.primaryMuted, borderRadius: radii.pill, paddingHorizontal: 12, paddingVertical: 8 },
  badgeText: { color: palette.primary, fontWeight: '800' },
  progressTrack: { backgroundColor: palette.border, borderRadius: radii.pill, height: 10, overflow: 'hidden' },
  progressFill: { backgroundColor: palette.primary, height: '100%' },
  questionTopic: { color: palette.primary, fontSize: 12, fontWeight: '800', textTransform: 'uppercase' },
  questionText: { color: palette.navy, fontSize: 22, fontWeight: '800', lineHeight: 30, marginTop: spacing.sm },
  option: { backgroundColor: palette.mist, borderColor: palette.border, borderRadius: radii.md, borderWidth: 1, marginTop: spacing.md, padding: spacing.md },
  optionCorrect: { backgroundColor: palette.primaryMuted, borderColor: palette.primary },
  optionWrong: { backgroundColor: palette.dangerMuted, borderColor: palette.danger },
  optionText: { color: palette.ink, lineHeight: 21 },
  explanation: { color: palette.slate, lineHeight: 21, marginTop: spacing.md },
  score: { color: palette.primary, fontSize: 42, fontWeight: '900' },
  metrics: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.md },
  metricWrap: { width: '100%' },
  metricWrapWide: { flex: 1, width: 'auto' },
  chip: { backgroundColor: palette.primaryMuted, borderRadius: radii.pill, paddingHorizontal: 12, paddingVertical: 8 },
  chipText: { color: palette.ink, fontWeight: '700' },
  signalChip: { backgroundColor: palette.mist, borderColor: palette.border, borderRadius: radii.pill, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 8 },
  signalChipText: { color: palette.slate, fontWeight: '700' },
  reviewRow: { borderTopColor: palette.border, borderTopWidth: 1, marginTop: spacing.md, paddingTop: spacing.md },
  correctText: { color: palette.primary, fontWeight: '700', marginTop: spacing.xs },
  actions: { flexDirection: 'column', gap: spacing.sm, marginTop: spacing.lg },
  actionsWide: { flexDirection: 'row' },
  actionButton: { flex: 1 },
});
