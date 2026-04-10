import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { Button, Surface, Text } from 'react-native-paper';

import { AppHeader } from '@/components/AppHeader';
import { MetricTile } from '@/components/MetricTile';
import { ScreenShell } from '@/components/ScreenShell';
import { SectionHeader } from '@/components/SectionHeader';
import { StatusPill } from '@/components/StatusPill';
import { palette, radii, shadows, spacing } from '@/constants/theme';
import { useMindTrace } from '@/hooks/useMindTrace';

const difficultyTone = {
  easy: 'green',
  medium: 'yellow',
  hard: 'purple',
} as const;

export default function StudyPlanScreen() {
  const router = useRouter();
  const {
    affectiveState,
    completionRate,
    completedTopicIds,
    nextStudyTopic,
    recommendedIntensity,
    rescueCompletionRate,
    studyPlan,
    toggleTopicCompletion,
    velocity,
  } = useMindTrace();

  return (
    <ScreenShell>
      <AppHeader
        badge={`Completion: ${completionRate}%`}
        eyebrow="Path"
        subtitle="Your plan for today"
        title="Path"
      />

      <View style={styles.metricRow}>
        <MetricTile
          label="Affective State"
          support="Live study-plan driver"
          tone="yellow"
          value={affectiveState}
        />
        <MetricTile
          label="Study Intensity"
          support={`Velocity: ${velocity}`}
          tone="blue"
          value={recommendedIntensity}
        />
      </View>

      <Surface style={styles.summaryCard}>
        <SectionHeader title="Continue" />
        <Text style={styles.summaryText}>
          Rescue completion is currently <Text style={styles.emphasis}>{rescueCompletionRate}%</Text>.
          {nextStudyTopic
            ? ` Your next recommended topic is ${nextStudyTopic.title.toLowerCase()}.`
            : ' Your current study queue is complete.'}
        </Text>
        <Button mode="outlined" onPress={() => router.push('/rescue')} style={styles.button}>
          Open Reset
        </Button>
      </Surface>

      <Surface style={styles.summaryCard}>
        <SectionHeader title="Plan note" />
        <Text style={styles.summaryText}>
          Current mode: <Text style={styles.emphasis}>{affectiveState}</Text>.
        </Text>
      </Surface>

      {studyPlan.map((topic, index) => {
        const isDone = completedTopicIds.includes(topic.id);

        return (
          <Pressable key={topic.id} onPress={() => toggleTopicCompletion(topic.id)}>
            <Surface style={[styles.topicCard, isDone && styles.topicCardDone]}>
              <View style={styles.topicHeader}>
                <View style={styles.topicTitleWrap}>
                  <Text style={styles.topicEyebrow}>Recommendation {index + 1}</Text>
                  <Text style={styles.topicTitle}>{topic.title}</Text>
                  <Text style={styles.topicSubject}>
                    {topic.subject} | {topic.duration}
                  </Text>
                </View>
                <View style={styles.topicAside}>
                  <StatusPill label={topic.difficulty} tone={difficultyTone[topic.difficulty]} />
                  <View style={[styles.checkMark, isDone && styles.checkMarkDone]}>
                    <Ionicons
                      color={isDone ? palette.surface : palette.slate}
                      name={isDone ? 'checkmark' : 'ellipse-outline'}
                      size={18}
                    />
                  </View>
                </View>
              </View>
              <Text style={styles.reasonText}>{topic.reason}</Text>
              <View style={styles.actionBox}>
                <Text style={styles.actionLabel}>Next action</Text>
                <Text style={styles.actionText}>{topic.action}</Text>
              </View>
            </Surface>
          </Pressable>
        );
      })}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  metricRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  summaryCard: {
    backgroundColor: palette.surface,
    borderRadius: radii.md,
    marginTop: spacing.md,
    padding: spacing.md,
    ...shadows.card,
  },
  button: {
    marginTop: spacing.md,
  },
  summaryText: {
    color: palette.ink,
    lineHeight: 22,
  },
  emphasis: {
    color: palette.navy,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  topicCard: {
    backgroundColor: palette.surface,
    borderRadius: radii.md,
    marginTop: spacing.md,
    padding: spacing.md,
    ...shadows.card,
  },
  topicCardDone: {
    backgroundColor: '#F3FBF7',
  },
  topicHeader: {
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  topicTitleWrap: {
    flex: 1,
  },
  topicEyebrow: {
    color: palette.slate,
    fontSize: 12,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  topicTitle: {
    color: palette.navy,
    fontSize: 21,
    fontWeight: '800',
  },
  topicSubject: {
    color: palette.slate,
    marginTop: 6,
  },
  topicAside: {
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  checkMark: {
    alignItems: 'center',
    backgroundColor: palette.mist,
    borderRadius: radii.pill,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  checkMarkDone: {
    backgroundColor: palette.secondary,
  },
  reasonText: {
    color: palette.ink,
    lineHeight: 22,
    marginTop: spacing.md,
  },
  actionBox: {
    backgroundColor: palette.mist,
    borderRadius: radii.sm,
    marginTop: spacing.md,
    padding: spacing.md,
  },
  actionLabel: {
    color: palette.slate,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  actionText: {
    color: palette.navy,
    fontWeight: '600',
    lineHeight: 21,
  },
});
