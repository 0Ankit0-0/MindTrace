import { StyleSheet, View } from 'react-native';
import { Surface, Text } from 'react-native-paper';

import { palette, radii, shadows, spacing } from '@/constants/theme';

const toneMap = {
  blue: { accent: palette.primary, background: '#EEF4FF' },
  green: { accent: palette.secondary, background: '#EDF9F4' },
  yellow: { accent: palette.warning, background: '#FFF6E7' },
  red: { accent: palette.danger, background: '#FFF0F3' },
  purple: { accent: palette.accent, background: '#F3EEFF' },
};

export function MetricTile({
  label,
  value,
  support,
  tone = 'blue',
}: {
  label: string;
  value: string;
  support: string;
  tone?: keyof typeof toneMap;
}) {
  return (
    <Surface style={[styles.card, { backgroundColor: toneMap[tone].background }]}>
      <View style={[styles.accent, { backgroundColor: toneMap[tone].accent }]} />
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color: toneMap[tone].accent }]}>{value}</Text>
      <Text style={styles.support}>{support}</Text>
    </Surface>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.md,
    flex: 1,
    minHeight: 130,
    padding: spacing.md,
    ...shadows.card,
  },
  accent: {
    borderRadius: radii.pill,
    height: 4,
    marginBottom: spacing.sm,
    width: 34,
  },
  label: {
    color: palette.slate,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 28,
    fontWeight: '800',
    marginTop: 10,
  },
  support: {
    color: palette.ink,
    lineHeight: 20,
    marginTop: spacing.sm,
  },
});
