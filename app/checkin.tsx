import { useState } from 'react';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Button, Snackbar, Surface, Text, TextInput } from 'react-native-paper';

import { AppHeader } from '@/components/AppHeader';
import { MetricTile } from '@/components/MetricTile';
import { ScreenShell } from '@/components/ScreenShell';
import { SectionHeader } from '@/components/SectionHeader';
import { StatusPill } from '@/components/StatusPill';
import { examPressureOptions, moodOptions, sleepOptions } from '@/constants/DummyData';
import { palette, radii, shadows, spacing } from '@/constants/theme';
import { useMindTrace } from '@/hooks/useMindTrace';
import { commonStyles } from '@/styles/common';

export default function PulseScreen() {
  const { width } = useWindowDimensions();
  const compact = width < 390;
  const {
    affectiveState,
    brainDump,
    emoji,
    examPressure,
    moodScore,
    readinessScore,
    sleepTiming,
    stressScore,
    submitCheckIn,
    updateDraft,
    velocity,
  } = useMindTrace();
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const handleSubmit = () => {
    submitCheckIn();
    setSnackbarVisible(true);
  };

  return (
    <ScreenShell>
      <AppHeader
        badge={`Velocity: ${velocity}`}
        eyebrow="Pulse"
        subtitle="Check in quickly and let the app adjust your next steps."
        title="Pulse"
      />

      <View style={[styles.metrics, compact && styles.metricsCompact]}>
        <MetricTile label="Stress" support="Live score" tone="red" value={`${stressScore}/100`} />
        <MetricTile label="Readiness" support="Current pacing" tone="green" value={`${readinessScore}%`} />
      </View>

      <Surface style={styles.card}>
        <SectionHeader title="How are you feeling?" />

        <Text style={styles.stepLabel}>Mood score</Text>
        <Text style={styles.bigScore}>{moodScore}/10</Text>
        <View style={styles.scoreRow}>
          {Array.from({ length: 10 }, (_, index) => {
            const value = index + 1;
            const isActive = value === moodScore;

            return (
              <Pressable
                key={value}
                onPress={() => updateDraft({ moodScore: value })}
                style={[styles.scoreDot, isActive && styles.scoreDotActive]}
              >
                <Text style={[styles.scoreLabel, isActive && styles.scoreLabelActive]}>{value}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={[styles.stepLabel, styles.spaced]}>Signal</Text>
        <View style={commonStyles.chipRow}>
          {moodOptions.map((option) => {
            const isActive = option.key === emoji;
            return (
              <Pressable
                key={option.key}
                onPress={() => updateDraft({ emoji: option.key })}
                style={[styles.emojiChip, isActive && styles.emojiChipActive]}
              >
                <Text style={styles.emoji}>{option.emoji}</Text>
                <View style={styles.emojiText}>
                  <Text style={styles.emojiLabel}>{option.label}</Text>
                  <Text style={styles.emojiHelper}>{option.helper}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        <View style={[styles.dualPanel, compact && styles.dualPanelCompact]}>
          <View style={styles.dualColumn}>
            <Text style={[styles.stepLabel, styles.spaced]}>Sleep timing</Text>
            <View style={styles.stack}>
              {sleepOptions.map((option) => {
                const isActive = option.key === sleepTiming;
                return (
                  <Pressable
                    key={option.key}
                    onPress={() => updateDraft({ sleepTiming: option.key })}
                    style={[styles.optionCard, isActive && styles.optionCardActive]}
                  >
                    <Text style={styles.chipTitle}>{option.label}</Text>
                    <Text style={styles.chipSubtitle}>{option.note}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.dualColumn}>
            <Text style={[styles.stepLabel, styles.spaced]}>Exam pressure</Text>
            <View style={styles.stack}>
              {examPressureOptions.map((option) => {
                const isActive = option.key === examPressure;
                return (
                  <Pressable
                    key={option.key}
                    onPress={() => updateDraft({ examPressure: option.key })}
                    style={[styles.optionCard, isActive && styles.optionCardActive]}
                  >
                    <Text style={styles.chipTitle}>{option.label}</Text>
                    <Text style={styles.chipSubtitle}>Stress weight +{option.impact}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>

        <TextInput
          label="Brain Dump"
          mode="outlined"
          multiline
          numberOfLines={5}
          onChangeText={(value) => updateDraft({ brainDump: value })}
          placeholder="Optional. Capture what feels heavy, unclear, or still possible."
          style={styles.input}
          value={brainDump}
        />

        <View style={styles.footerRow}>
          <View>
            <Text style={styles.summaryLabel}>Current signal</Text>
            <View style={styles.signalRow}>
              <StatusPill label={affectiveState} tone="blue" />
            </View>
          </View>
          <Button mode="contained" onPress={handleSubmit}>
            Save pulse
          </Button>
        </View>
      </Surface>

      <Snackbar onDismiss={() => setSnackbarVisible(false)} visible={snackbarVisible}>
        Pulse saved. Beacon and Path are up to date.
      </Snackbar>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  metrics: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  metricsCompact: {
    flexWrap: 'wrap',
  },
  card: {
    backgroundColor: palette.surface,
    borderRadius: radii.lg,
    marginTop: spacing.md,
    padding: spacing.md,
    ...shadows.card,
  },
  stepLabel: {
    color: palette.ink,
    fontSize: 15,
    fontWeight: '700',
  },
  spaced: {
    marginTop: spacing.lg,
  },
  bigScore: {
    color: palette.navy,
    fontSize: 42,
    fontWeight: '800',
    marginTop: 6,
  },
  scoreRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  scoreDot: {
    alignItems: 'center',
    backgroundColor: palette.mist,
    borderRadius: radii.pill,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  scoreDotActive: {
    backgroundColor: palette.primary,
  },
  scoreLabel: {
    color: palette.ink,
    fontWeight: '700',
  },
  scoreLabelActive: {
    color: palette.surface,
  },
  emojiChip: {
    alignItems: 'center',
    backgroundColor: palette.mist,
    borderColor: palette.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    minWidth: '47%',
    padding: spacing.sm,
  },
  emojiChipActive: {
    backgroundColor: '#EEF4FF',
    borderColor: palette.primary,
  },
  emoji: {
    fontSize: 28,
  },
  emojiText: {
    flex: 1,
  },
  emojiLabel: {
    color: palette.navy,
    fontWeight: '700',
  },
  emojiHelper: {
    color: palette.slate,
    fontSize: 12,
    marginTop: 2,
  },
  dualPanel: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  dualPanelCompact: {
    flexDirection: 'column',
  },
  dualColumn: {
    flex: 1,
  },
  stack: {
    gap: spacing.sm,
  },
  optionCard: {
    backgroundColor: palette.mist,
    borderColor: palette.border,
    borderRadius: radii.md,
    borderWidth: 1,
    padding: spacing.md,
  },
  optionCardActive: {
    backgroundColor: '#EEF8F4',
    borderColor: palette.secondary,
  },
  chipTitle: {
    color: palette.navy,
    fontWeight: '700',
  },
  chipSubtitle: {
    color: palette.slate,
    fontSize: 12,
    marginTop: 4,
  },
  input: {
    backgroundColor: palette.surface,
    marginTop: spacing.lg,
  },
  footerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },
  summaryLabel: {
    color: palette.slate,
    fontSize: 12,
    textTransform: 'uppercase',
  },
  signalRow: {
    marginTop: spacing.sm,
  },
});
