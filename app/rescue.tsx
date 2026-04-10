import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { Button, Surface, Text } from 'react-native-paper';

import { AnimatedReveal } from '@/components/AnimatedReveal';
import { AppHeader } from '@/components/AppHeader';
import { MetricTile } from '@/components/MetricTile';
import { ScreenShell } from '@/components/ScreenShell';
import { SectionHeader } from '@/components/SectionHeader';
import { palette, radii, shadows, spacing } from '@/constants/theme';
import { useMindTrace } from '@/hooks/useMindTrace';

const toneMap = {
  reset: { bg: '#EEF4FF', icon: 'leaf-outline', color: palette.primary },
  light: { bg: '#F3FBF7', icon: 'sunny-outline', color: palette.secondary },
  guided: { bg: '#FFF6E7', icon: 'compass-outline', color: palette.warning },
  confidence: { bg: '#F3EEFF', icon: 'sparkles-outline', color: palette.accent },
} as const;

export default function RescueScreen() {
  const router = useRouter();
  const {
    affectiveState,
    completedRescueStepIds,
    nextStudyTopic,
    recommendedIntensity,
    rescueCompletionRate,
    rescuePlan,
    stressScore,
    toggleRescueStepCompletion,
    velocity,
  } = useMindTrace();

  return (
    <ScreenShell>
      <AnimatedReveal>
        <AppHeader
          badge="30-minute support flow"
          eyebrow="Reset"
          subtitle="A short reset for right now."
          title="Reset"
        />
      </AnimatedReveal>

      <AnimatedReveal delay={70} style={styles.metricRow}>
        <MetricTile label="Stress" support="Current pressure level" tone="red" value={`${stressScore}/100`} />
        <MetricTile label="State" support={`Velocity: ${velocity}`} tone="yellow" value={affectiveState} />
        <MetricTile label="Progress" support="Rescue completion" tone="green" value={`${rescueCompletionRate}%`} />
      </AnimatedReveal>

      <AnimatedReveal delay={120}>
        <Surface style={styles.panel}>
        <SectionHeader title="Reset" />
        <Text style={styles.body}>
          Mode: <Text style={styles.emphasis}>{affectiveState}</Text>.
        </Text>
      </Surface>
      </AnimatedReveal>

      <View style={styles.stack}>
        {rescuePlan.map((step, index) => {
          const tone = toneMap[step.type];
          const isDone = completedRescueStepIds.includes(step.id);

          return (
            <AnimatedReveal key={step.id} delay={180 + index * 50}>
              <Pressable onPress={() => toggleRescueStepCompletion(step.id)}>
                <Surface style={[styles.stepCard, { backgroundColor: tone.bg }, isDone && styles.stepCardDone]}>
                <View style={styles.stepHeader}>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>Step {index + 1}</Text>
                  </View>
                  <View style={styles.stepRight}>
                    <Text style={styles.duration}>{step.duration}</Text>
                    <View style={[styles.checkMark, isDone && styles.checkMarkDone]}>
                      <Ionicons
                        color={isDone ? palette.surface : palette.slate}
                        name={isDone ? 'checkmark' : 'ellipse-outline'}
                        size={17}
                      />
                    </View>
                  </View>
                </View>
                <View style={styles.titleRow}>
                  <Ionicons color={tone.color} name={tone.icon} size={18} />
                  <Text style={styles.stepTitle}>{step.title}</Text>
                </View>
                <Text style={styles.stepDescription}>{step.description}</Text>
              </Surface>
              </Pressable>
            </AnimatedReveal>
          );
        })}
      </View>

      <AnimatedReveal delay={420}>
        <Surface style={styles.panel}>
        <SectionHeader title="Next up" />
        {nextStudyTopic ? (
          <>
            <Text style={styles.nextTitle}>{nextStudyTopic.title}</Text>
            <Text style={styles.nextMeta}>
              {nextStudyTopic.subject} | {nextStudyTopic.duration} | {recommendedIntensity}
            </Text>
            <Text style={styles.nextBody}>{nextStudyTopic.action}</Text>
            <Button mode="contained" onPress={() => router.push('/studyplan')} style={styles.button}>
              Continue to study plan
            </Button>
          </>
        ) : (
          <Text style={styles.nextBody}>Your current study plan is complete. Open the dashboard to review your progress.</Text>
        )}
      </Surface>
      </AnimatedReveal>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  metricRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  panel: {
    backgroundColor: palette.surface,
    borderRadius: radii.md,
    marginTop: spacing.md,
    padding: spacing.md,
    ...shadows.card,
  },
  body: {
    color: palette.ink,
    lineHeight: 22,
  },
  emphasis: {
    color: palette.navy,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  stack: {
    gap: spacing.md,
    marginTop: spacing.md,
  },
  stepCard: {
    borderRadius: radii.md,
    padding: spacing.md,
    ...shadows.card,
  },
  stepCardDone: {
    borderColor: palette.secondary,
    borderWidth: 1,
  },
  stepHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  badge: {
    backgroundColor: 'rgba(17,33,58,0.08)',
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeText: {
    color: palette.navy,
    fontSize: 12,
    fontWeight: '700',
  },
  stepRight: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  duration: {
    color: palette.slate,
    fontWeight: '700',
  },
  checkMark: {
    alignItems: 'center',
    backgroundColor: 'rgba(17,33,58,0.08)',
    borderRadius: radii.pill,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  checkMarkDone: {
    backgroundColor: palette.secondary,
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: spacing.md,
  },
  stepTitle: {
    color: palette.navy,
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
  },
  stepDescription: {
    color: palette.ink,
    lineHeight: 21,
    marginTop: spacing.sm,
  },
  nextTitle: {
    color: palette.navy,
    fontSize: 20,
    fontWeight: '800',
  },
  nextMeta: {
    color: palette.slate,
    marginTop: 6,
  },
  nextBody: {
    color: palette.ink,
    lineHeight: 21,
    marginTop: spacing.sm,
  },
  button: {
    marginTop: spacing.md,
  },
});
