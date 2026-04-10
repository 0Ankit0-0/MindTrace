import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Surface, Text } from 'react-native-paper';

import { AnimatedReveal } from '@/components/AnimatedReveal';
import { MetricTile } from '@/components/MetricTile';
import { ScreenShell } from '@/components/ScreenShell';
import { StatusPill } from '@/components/StatusPill';
import { TrendChart } from '@/components/TrendChart';
import { getEmotionTheme, palette, radii, shadows, spacing } from '@/constants/theme';
import { useMindTrace } from '@/hooks/useMindTrace';

const velocityTone = {
  recovering: 'green',
  stable: 'blue',
  declining: 'yellow',
  critical: 'red',
} as const;

const affectiveTone = {
  curiosity: 'green',
  confusion: 'yellow',
  frustration: 'red',
  boredom: 'purple',
} as const;

export default function DashboardScreen() {
  const {
    affectiveState,
    moodHistory,
    nextStudyTopic,
    notification,
    readinessScore,
    recommendedIntensity,
    rescueCompletionRate,
    stressScore,
    stressStatus,
    studentProfile,
    velocity,
  } = useMindTrace();
  const emotionTheme = getEmotionTheme(affectiveState);

  return (
    <ScreenShell>
      <AnimatedReveal>
        <LinearGradient colors={emotionTheme.gradient} style={styles.hero}>
          <Text style={styles.eyebrow}>Beacon</Text>
          <Text style={styles.title}>Today</Text>
          <Text style={styles.subtitle}>
            {studentProfile.name.split(' ')[0]}, here is your live overview.
          </Text>
          <View style={styles.heroMeta}>
            <StatusPill label={stressStatus} tone={velocityTone[velocity]} />
            <StatusPill label={recommendedIntensity} tone={affectiveTone[affectiveState]} />
          </View>
        </LinearGradient>
      </AnimatedReveal>

      <AnimatedReveal delay={70} style={styles.metrics}>
        <MetricTile label="Stress" support={stressStatus} tone="red" value={`${stressScore}`} />
        <MetricTile label="Readiness" support="Live score" tone="green" value={`${readinessScore}%`} />
        <MetricTile label="Velocity" support="7 days" tone={velocityTone[velocity]} value={velocity} />
      </AnimatedReveal>

      <AnimatedReveal delay={120} style={styles.metrics}>
        <MetricTile label="Rescue" support="Progress" tone="blue" value={`${rescueCompletionRate}%`} />
        <MetricTile
          label="Next up"
          support={nextStudyTopic ? nextStudyTopic.subject : 'All set'}
          tone="purple"
          value={nextStudyTopic ? nextStudyTopic.title.split(' ').slice(0, 2).join(' ') : 'Complete'}
        />
      </AnimatedReveal>

      <AnimatedReveal delay={170}>
        <Surface style={styles.focusCard}>
          <Text style={styles.focusEyebrow}>Focus</Text>
          <Text style={styles.focusTitle}>{notification}</Text>
        </Surface>
      </AnimatedReveal>

      <AnimatedReveal delay={220}>
        <Surface style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <View>
              <Text style={styles.sectionTitle}>Trend</Text>
              <Text style={styles.sectionSub}>Last 7 days</Text>
            </View>
            <View style={styles.badgeRow}>
              <StatusPill label={affectiveState} tone={affectiveTone[affectiveState]} />
              <StatusPill label={velocity} tone={velocityTone[velocity]} />
            </View>
          </View>
          <TrendChart data={moodHistory} />
        </Surface>
      </AnimatedReveal>

      <AnimatedReveal delay={280}>
        <View style={styles.bottomGrid}>
          <Surface style={styles.bottomCard}>
            <Text style={styles.bottomEyebrow}>Current state</Text>
            <Text style={styles.bottomValue}>{affectiveState}</Text>
            <Text style={styles.bottomText}>Stay with the pace that feels sustainable today.</Text>
          </Surface>
          <Surface style={styles.bottomCard}>
            <Text style={styles.bottomEyebrow}>Focus time</Text>
            <Text style={styles.bottomValue}>{studentProfile.focusMinutes} min</Text>
            <Text style={styles.bottomText}>Keep the session light, clear, and repeatable.</Text>
          </Surface>
        </View>
      </AnimatedReveal>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderRadius: radii.lg,
    marginTop: spacing.sm,
    padding: spacing.lg,
  },
  eyebrow: {
    color: '#D5E4FF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
  title: {
    color: palette.surface,
    fontSize: 32,
    fontWeight: '800',
    marginTop: spacing.sm,
  },
  subtitle: {
    color: '#E7EFFF',
    lineHeight: 21,
    marginTop: spacing.sm,
  },
  heroMeta: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  metrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  focusCard: {
    backgroundColor: palette.surface,
    borderRadius: radii.md,
    marginTop: spacing.md,
    padding: spacing.lg,
    ...shadows.card,
  },
  focusEyebrow: {
    color: palette.slate,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  focusTitle: {
    color: palette.navy,
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 29,
    marginTop: spacing.sm,
  },
  chartCard: {
    backgroundColor: palette.surface,
    borderRadius: radii.md,
    marginTop: spacing.md,
    padding: spacing.md,
    ...shadows.card,
  },
  chartHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  sectionTitle: {
    color: palette.navy,
    fontSize: 18,
    fontWeight: '700',
  },
  sectionSub: {
    color: palette.slate,
    marginTop: 4,
  },
  badgeRow: {
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  bottomGrid: {
    gap: spacing.md,
    marginTop: spacing.md,
  },
  bottomCard: {
    backgroundColor: palette.surface,
    borderRadius: radii.md,
    padding: spacing.md,
    ...shadows.card,
  },
  bottomEyebrow: {
    color: palette.slate,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  bottomValue: {
    color: palette.navy,
    fontSize: 22,
    fontWeight: '800',
    marginTop: spacing.sm,
    textTransform: 'capitalize',
  },
  bottomText: {
    color: palette.ink,
    lineHeight: 21,
    marginTop: spacing.sm,
  },
});
