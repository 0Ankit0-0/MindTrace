import { StyleSheet, View } from 'react-native';
import { Surface, Text } from 'react-native-paper';

import { AppHeader } from '@/components/AppHeader';
import { ComfortMessageCard } from '@/components/ComfortMessageCard';
import { MetricTile } from '@/components/MetricTile';
import { ScreenShell } from '@/components/ScreenShell';
import { SectionHeader } from '@/components/SectionHeader';
import { palette, radii, shadows, spacing } from '@/constants/theme';
import { useMindTrace } from '@/hooks/useMindTrace';

export default function ComfortScreen() {
  const { activeComfortRecordingId, comfortRecordings, playComfortRecording, studentProfile } = useMindTrace();

  return (
    <ScreenShell>
      <AppHeader
        badge={`${comfortRecordings.length} saved recordings`}
        eyebrow="Care Circle"
        subtitle="Your saved care circle notes."
        title="Care Circle"
      />

      <View style={styles.metricRow}>
        <MetricTile
          label="Preferred Support"
          support="Support style"
          tone="green"
          value={studentProfile.supportStyle.split(' ')[0]}
        />
        <MetricTile
          label="Most Needed"
          support="Current need"
          tone="purple"
          value="Comfort"
        />
      </View>

      <Surface style={styles.panel}>
        <SectionHeader title="Care Circle" />
        <Text style={styles.body}>
          Trusted messages, saved and ready when you need them most.
        </Text>
      </Surface>

      <Surface style={styles.panel}>
        <SectionHeader title="Recordings" />
        <View style={styles.stack}>
          {comfortRecordings.map((item) => (
            <ComfortMessageCard
              key={item.id}
              active={activeComfortRecordingId === item.id}
              item={item}
              onPress={() => playComfortRecording(item.id)}
            />
          ))}
        </View>
      </Surface>
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
  stack: {
    gap: spacing.md,
  },
});
