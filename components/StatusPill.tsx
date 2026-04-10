import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { palette, radii } from '@/constants/theme';

const tones = {
  blue: { backgroundColor: palette.primaryMuted, color: palette.primary },
  green: { backgroundColor: palette.secondaryMuted, color: palette.secondary },
  yellow: { backgroundColor: palette.warningMuted, color: palette.warning },
  red: { backgroundColor: palette.dangerMuted, color: palette.danger },
  purple: { backgroundColor: palette.accentMuted, color: palette.accent },
};

export function StatusPill({
  label,
  tone,
}: {
  label: string;
  tone: keyof typeof tones;
}) {
  return (
    <View style={[styles.pill, { backgroundColor: tones[tone].backgroundColor }]}>
      <Text style={[styles.label, { color: tones[tone].color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'flex-start',
    borderRadius: radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
