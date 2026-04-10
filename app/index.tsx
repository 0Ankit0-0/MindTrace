import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Href, useRouter } from 'expo-router';
import { Button, Surface, Text } from 'react-native-paper';

import { ActionRow } from '@/components/ActionRow';
import { AnimatedReveal } from '@/components/AnimatedReveal';
import { ComfortMessageCard } from '@/components/ComfortMessageCard';
import { EmotionPulse } from '@/components/EmotionPulse';
import { ImageShowcaseCard } from '@/components/ImageShowcaseCard';
import { MetricTile } from '@/components/MetricTile';
import { QuickActionTile } from '@/components/QuickActionTile';
import { ScreenShell } from '@/components/ScreenShell';
import { SectionHeader } from '@/components/SectionHeader';
import { StatusPill } from '@/components/StatusPill';
import { VideoPromoCard } from '@/components/VideoPromoCard';
import { promoBanners } from '@/constants/DummyData';
import { getEmotionTheme, palette, radii, shadows, spacing } from '@/constants/theme';
import { useMindTrace } from '@/hooks/useMindTrace';
import { commonStyles } from '@/styles/common';

export default function CheckInScreen() {
  const router = useRouter();
  const {
    activeComfortRecordingId,
    affectiveState,
    comfortRecordings,
    notification,
    nextStudyTopic,
    playComfortRecording,
    readinessScore,
    recommendedIntensity,
    completionRate,
    rescueCompletionRate,
    stressScore,
    studentProfile,
    velocity,
  } = useMindTrace();
  const comfortRoute = '/comfort' as Href;
  const rescueRoute = '/rescue' as Href;
  const studyPlanRoute = '/studyplan' as Href;
  const pulseRoute = '/checkin' as Href;
  const emotionTheme = getEmotionTheme(affectiveState);

  const comfortPreview = comfortRecordings[0];
  const studyTopicsLeft = nextStudyTopic ? Math.max(0, 2 - completionRate / 50) : 0;
  const sessionFeedback =
    completionRate >= 100
      ? {
          title: 'You are ready to wrap for today',
          subtitle: 'Your study queue is complete. Slow down and recover.',
          tone: 'green' as const,
        }
      : rescueCompletionRate === 100 && completionRate < 100
        ? {
            title: 'Rescue complete',
            subtitle: nextStudyTopic
              ? `You are settled enough to continue with ${nextStudyTopic.title.toLowerCase()}.`
              : 'You completed the reset flow and are ready for the next small study step.',
            tone: 'blue' as const,
          }
        : completionRate > 0
          ? {
              title: studyTopicsLeft <= 1 ? '1 study task left' : `${Math.ceil(studyTopicsLeft)} study tasks left`,
              subtitle: 'Keep the momentum small and steady. You do not need to rush the rest of the plan.',
              tone: 'yellow' as const,
            }
          : {
              title: 'You have space to begin gently',
              subtitle: 'Start with the next best action below and let the app guide the rest of the session.',
              tone: 'purple' as const,
            };

  const primaryAction =
    stressScore >= 70 && rescueCompletionRate < 100
      ? {
          title: 'Start your 30-minute rescue plan',
          subtitle: 'Reduce overload first, then return to study with a smaller and more realistic next step.',
          button: 'Open Reset',
          route: rescueRoute,
        }
      : rescueCompletionRate === 100 && nextStudyTopic && completionRate < 100
        ? {
            title: `Continue with ${nextStudyTopic.title}`,
            subtitle: 'You completed the recovery block. Continue with the next study move.',
            button: 'Resume Path',
            route: studyPlanRoute,
          }
        : completionRate >= 100
          ? {
              title: 'Take a comfort pause',
              subtitle: 'You have completed today’s study queue. Use a trusted voice note to wind down or reset.',
              button: 'Open Care Circle',
              route: comfortRoute,
            }
      : nextStudyTopic
        ? {
            title: `Continue with ${nextStudyTopic.title}`,
            subtitle: 'Your energy is steady enough to move into the next recommended study block.',
            button: 'Open Path',
            route: studyPlanRoute,
          }
        : {
            title: 'Play a comfort note',
            subtitle: 'When the day feels heavy, hearing a trusted voice can help you settle before you continue.',
            button: 'Open Care Circle',
            route: comfortRoute,
          };

  return (
    <ScreenShell>
      <AnimatedReveal>
        <LinearGradient colors={emotionTheme.gradient} style={styles.workspaceHero}>
          <View style={styles.heroTopRow}>
            <Text style={styles.kicker}>MindTrace</Text>
            <EmotionPulse color={emotionTheme.soft} />
          </View>
          <Text style={commonStyles.heroTitle}>Good evening, {studentProfile.name.split(' ')[0]}</Text>
          <Text style={commonStyles.heroSubtitle}>Everything you need for today, in one place.</Text>
          <View style={styles.heroMeta}>
            <StatusPill label={`${studentProfile.cohort}`} tone="blue" />
            <StatusPill label={`${studentProfile.streakDays} day streak`} tone="green" />
          </View>
        </LinearGradient>
      </AnimatedReveal>

      <AnimatedReveal delay={60} style={styles.metricGrid}>
        <MetricTile
          label="Stress Index"
          support="Live score"
          tone="red"
          value={`${stressScore}/100`}
        />
        <MetricTile
          label="Readiness"
          support={recommendedIntensity}
          tone="green"
          value={`${readinessScore}%`}
        />
      </AnimatedReveal>

      <AnimatedReveal delay={120}>
        <Surface style={[styles.primaryActionCard, { backgroundColor: emotionTheme.surfaceTint }]}>
        <Text style={styles.primaryActionEyebrow}>Recommended now</Text>
        <Text style={styles.primaryActionTitle}>{primaryAction.title}</Text>
        <Text style={styles.primaryActionSubtitle}>{primaryAction.subtitle}</Text>
        <Button mode="contained" onPress={() => router.push(primaryAction.route)} style={styles.primaryActionButton}>
          {primaryAction.button}
        </Button>
      </Surface>
      </AnimatedReveal>

      <AnimatedReveal delay={170} style={[styles.feedbackRow, { borderLeftColor: emotionTheme.accent }]}>
        <StatusPill label={sessionFeedback.title} tone={sessionFeedback.tone} />
        <Text style={styles.feedbackText}>{sessionFeedback.subtitle}</Text>
      </AnimatedReveal>

      <AnimatedReveal delay={210}>
        <Surface style={styles.panel}>
        <SectionHeader title="Quick actions" />
        <View style={styles.quickActionRow}>
          <QuickActionTile
            icon="create-outline"
            subtitle="Update your status"
            title="Pulse"
            onPress={() => router.push(pulseRoute)}
          />
          <QuickActionTile
            icon="flash-outline"
            subtitle="Reset and restart"
            title="Reset"
            onPress={() => router.push(rescueRoute)}
          />
        </View>
        <View style={styles.quickActionRow}>
          <QuickActionTile
            icon="chatbubble-ellipses-outline"
            subtitle="Open support chat"
            title="Shift"
            onPress={() => router.push('/chat')}
          />
          <QuickActionTile
            icon="heart-circle-outline"
            subtitle="Trusted voice notes"
            title="Care Circle"
            onPress={() => router.push(comfortRoute)}
          />
        </View>
      </Surface>
      </AnimatedReveal>

      <AnimatedReveal delay={250}>
        <Surface style={[styles.banner, { backgroundColor: emotionTheme.surfaceTint }]}>
        <Text style={styles.bannerTitle}>Today&apos;s next best action</Text>
        <Text style={styles.bannerText}>{notification}</Text>
      </Surface>
      </AnimatedReveal>

      <AnimatedReveal delay={290}>
        <Surface style={styles.panel}>
        <SectionHeader title="Care Circle" />
        <ComfortMessageCard
          active={activeComfortRecordingId === comfortPreview?.id}
          item={comfortPreview}
          onPress={() => playComfortRecording(comfortPreview.id)}
        />
        <View style={styles.actionSpacing} />
        <ActionRow
          icon="heart-outline"
          subtitle="Open your saved audio notes"
          title="View all recordings"
          onPress={() => router.push(comfortRoute)}
        />
      </Surface>
      </AnimatedReveal>

      <AnimatedReveal delay={330}>
        <Surface style={styles.pulsePreviewCard}>
          <SectionHeader title="Pulse" subtitle="Keep your check-in focused and fast." />
          <Text style={styles.previewBody}>
            Open Pulse to update your mood, sleep timing, pressure level, and brain dump in one focused flow.
          </Text>
          <View style={styles.previewMeta}>
            <StatusPill label={affectiveState} tone="blue" />
            <StatusPill label={`Velocity: ${velocity}`} tone="purple" />
          </View>
          <Button mode="contained" onPress={() => router.push(pulseRoute)} style={styles.primaryActionButton}>
            Open Pulse
          </Button>
        </Surface>
      </AnimatedReveal>

      <AnimatedReveal delay={430}>
        <VideoPromoCard />
      </AnimatedReveal>

      <AnimatedReveal delay={480}>
        <Surface style={styles.panel}>
        <SectionHeader title="Featured" />
        <View style={styles.stack}>
          {promoBanners.map((banner) => (
            <ImageShowcaseCard key={banner.id} banner={banner} />
          ))}
        </View>
      </Surface>
      </AnimatedReveal>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  workspaceHero: {
    borderRadius: radii.lg,
    marginTop: spacing.sm,
    padding: spacing.lg,
  },
  kicker: {
    color: '#C7D8FF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  heroMeta: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  heroTopRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  quickActionRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  primaryActionCard: {
    backgroundColor: palette.surface,
    borderRadius: radii.md,
    marginTop: spacing.md,
    padding: spacing.lg,
    ...shadows.card,
  },
  primaryActionEyebrow: {
    color: palette.primary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  primaryActionTitle: {
    color: palette.navy,
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 30,
    marginTop: spacing.sm,
  },
  primaryActionSubtitle: {
    color: palette.ink,
    lineHeight: 21,
    marginTop: spacing.sm,
  },
  primaryActionButton: {
    alignSelf: 'flex-start',
    marginTop: spacing.md,
  },
  feedbackRow: {
    backgroundColor: palette.surface,
    borderLeftWidth: 4,
    borderRadius: radii.md,
    marginTop: spacing.md,
    padding: spacing.md,
    ...shadows.card,
  },
  feedbackText: {
    color: palette.ink,
    lineHeight: 21,
    marginTop: spacing.sm,
  },
  banner: {
    backgroundColor: '#FFF6EB',
    borderRadius: radii.md,
    marginTop: spacing.md,
    padding: spacing.md,
    ...shadows.card,
  },
  bannerTitle: {
    color: palette.warning,
    fontWeight: '700',
    marginBottom: 4,
  },
  bannerText: {
    color: palette.ink,
    lineHeight: 21,
  },
  pulsePreviewCard: {
    backgroundColor: palette.surface,
    borderRadius: radii.md,
    marginTop: spacing.md,
    padding: spacing.md,
    ...shadows.card,
  },
  stack: {
    gap: spacing.sm,
  },
  previewBody: {
    color: palette.ink,
    lineHeight: 22,
  },
  previewMeta: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  panel: {
    backgroundColor: palette.surface,
    borderRadius: radii.md,
    marginTop: spacing.md,
    padding: spacing.md,
    ...shadows.card,
  },
  actionSpacing: {
    height: spacing.md,
  },
});
