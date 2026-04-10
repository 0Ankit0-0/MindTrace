import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Button, Surface, Text, TextInput } from 'react-native-paper';

import { ScreenShell } from '@/components/ScreenShell';
import { SectionHeader } from '@/components/SectionHeader';
import { palette, radii, shadows, spacing } from '@/constants/theme';
import { useMindTrace } from '@/hooks/useMindTrace';

const onboardingSteps = [
  {
    id: 'welcome',
    eyebrow: 'Welcome',
    title: 'Set up your rhythm',
    subtitle: 'A few details now help MindTrace adapt support, study flow, and reminders around you.',
    fields: [] as const,
  },
  {
    id: 'academic',
    eyebrow: 'Academic',
    title: 'Your study context',
    subtitle: 'Tell us where you are in your course so the app can shape support around your workload.',
    fields: ['fullName', 'institution', 'program', 'semester', 'examWindow'] as const,
  },
  {
    id: 'routine',
    eyebrow: 'Routine',
    title: 'Your daily rhythm',
    subtitle: 'These details help with timing, stress pacing, and the next-best-action flow.',
    fields: ['sleepGoal', 'studyPreference'] as const,
  },
  {
    id: 'support',
    eyebrow: 'Support',
    title: 'What helps when things feel heavy',
    subtitle: 'This keeps Shift, Reset, and Care Circle closer to the way you actually recover.',
    fields: ['stressTrigger', 'supportStyle'] as const,
  },
] as const;

export function OnboardingFlow() {
  const { width } = useWindowDimensions();
  const compact = width < 390;
  const { completeOnboarding, onboardingQuestions, studentProfile, updateProfile } = useMindTrace();
  const [stepIndex, setStepIndex] = useState(0);

  const step = onboardingSteps[stepIndex];
  const progress = Math.round(((stepIndex + 1) / onboardingSteps.length) * 100);
  const visibleQuestions = useMemo(
    () => onboardingQuestions.filter((question) => step.fields.includes(question.id as never)),
    [step.fields, onboardingQuestions]
  );
  const isLastStep = stepIndex === onboardingSteps.length - 1;

  return (
    <ScreenShell>
      <Surface style={styles.hero}>
        <Text style={styles.eyebrow}>{step.eyebrow}</Text>
        <Text style={styles.title}>{step.title}</Text>
        <Text style={styles.subtitle}>{step.subtitle}</Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>{progress}% complete</Text>
      </Surface>

      {step.id === 'welcome' ? (
        <Surface style={styles.card}>
          <SectionHeader title="What you will unlock" />
          <View style={[styles.featureGrid, compact && styles.featureGridCompact]}>
            <View style={styles.featureCard}>
              <Text style={styles.featureTitle}>Pulse</Text>
              <Text style={styles.featureText}>Track how you feel and what your day can realistically hold.</Text>
            </View>
            <View style={styles.featureCard}>
              <Text style={styles.featureTitle}>Path</Text>
              <Text style={styles.featureText}>Get a gentler study route based on emotional readiness.</Text>
            </View>
            <View style={styles.featureCard}>
              <Text style={styles.featureTitle}>Shift</Text>
              <Text style={styles.featureText}>Open support when you need clarity, calm, or a reset.</Text>
            </View>
            <View style={styles.featureCard}>
              <Text style={styles.featureTitle}>Care Circle</Text>
              <Text style={styles.featureText}>Keep trusted comfort close for tougher moments.</Text>
            </View>
          </View>
        </Surface>
      ) : (
        <Surface style={styles.card}>
          <SectionHeader title={step.title} />
          <View style={styles.fieldList}>
            {visibleQuestions.map((question) => (
              <View key={question.id}>
                <Text style={styles.label}>{question.label}</Text>
                <Text style={styles.helper}>{question.helper}</Text>
                <TextInput
                  mode="outlined"
                  multiline={question.id === 'stressTrigger' || question.id === 'supportStyle'}
                  numberOfLines={question.id === 'stressTrigger' || question.id === 'supportStyle' ? 3 : 1}
                  onChangeText={(value) =>
                    updateProfile(
                      question.id as
                        | 'fullName'
                        | 'institution'
                        | 'program'
                        | 'semester'
                        | 'examWindow'
                        | 'sleepGoal'
                        | 'studyPreference'
                        | 'stressTrigger'
                        | 'supportStyle',
                      value
                    )
                  }
                  placeholder={question.placeholder}
                  style={styles.input}
                  value={String(studentProfile[question.id as keyof typeof studentProfile] ?? '')}
                />
              </View>
            ))}
          </View>
        </Surface>
      )}

      <View style={styles.actions}>
        {stepIndex > 0 ? (
          <Pressable onPress={() => setStepIndex((current) => current - 1)} style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Back</Text>
          </Pressable>
        ) : (
          <View style={styles.spacer} />
        )}

        <Button
          mode="contained"
          onPress={() => {
            if (isLastStep) {
              completeOnboarding();
              return;
            }

            setStepIndex((current) => current + 1);
          }}
        >
          {isLastStep ? 'Enter app' : 'Continue'}
        </Button>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: palette.surface,
    borderRadius: radii.lg,
    marginTop: spacing.sm,
    padding: spacing.lg,
    ...shadows.card,
  },
  eyebrow: {
    color: palette.primary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
  title: {
    color: palette.navy,
    fontSize: 28,
    fontWeight: '800',
    marginTop: spacing.sm,
  },
  subtitle: {
    color: palette.slate,
    lineHeight: 22,
    marginTop: spacing.sm,
  },
  progressTrack: {
    backgroundColor: palette.primaryMuted,
    borderRadius: radii.pill,
    height: 8,
    marginTop: spacing.lg,
    overflow: 'hidden',
  },
  progressBar: {
    backgroundColor: palette.primary,
    borderRadius: radii.pill,
    height: 8,
  },
  progressText: {
    color: palette.slate,
    marginTop: spacing.sm,
  },
  card: {
    backgroundColor: palette.surface,
    borderRadius: radii.lg,
    marginTop: spacing.md,
    padding: spacing.md,
    ...shadows.card,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  featureGridCompact: {
    flexDirection: 'column',
  },
  featureCard: {
    backgroundColor: '#FCFDFF',
    borderColor: palette.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flexBasis: '47%',
    padding: spacing.md,
  },
  featureTitle: {
    color: palette.navy,
    fontSize: 16,
    fontWeight: '800',
  },
  featureText: {
    color: palette.ink,
    lineHeight: 20,
    marginTop: spacing.sm,
  },
  fieldList: {
    gap: spacing.md,
  },
  label: {
    color: palette.navy,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  helper: {
    color: palette.slate,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: palette.surface,
  },
  actions: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },
  secondaryButton: {
    backgroundColor: palette.mist,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  secondaryButtonText: {
    color: palette.navy,
    fontWeight: '700',
  },
  spacer: {
    width: 72,
  },
});
