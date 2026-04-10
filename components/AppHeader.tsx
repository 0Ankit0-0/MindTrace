import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Surface, Text } from 'react-native-paper';

import { gradients, palette, radii, shadows, spacing } from '@/constants/theme';

export function AppHeader({
  eyebrow,
  title,
  subtitle,
  badge,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  badge?: string;
}) {
  return (
    <Surface style={styles.card}>
      <View style={styles.row}>
        <View style={styles.copy}>
          <Text style={styles.eyebrow}>{eyebrow}</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <LinearGradient colors={gradients.hero} style={styles.mark}>
          <Ionicons color={palette.surface} name="pulse" size={20} />
        </LinearGradient>
      </View>
      {badge ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      ) : null}
    </Surface>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.surface,
    borderColor: 'rgba(61,139,255,0.12)',
    borderRadius: radii.lg,
    borderWidth: 1,
    padding: spacing.lg,
    ...shadows.card,
  },
  row: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  copy: {
    flex: 1,
  },
  eyebrow: {
    color: palette.primary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  title: {
    color: palette.navy,
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
    marginTop: 8,
  },
  subtitle: {
    color: palette.slate,
    lineHeight: 22,
    marginTop: spacing.sm,
  },
  mark: {
    alignItems: 'center',
    backgroundColor: palette.navy,
    borderRadius: radii.md,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EEF4FF',
    borderRadius: radii.pill,
    marginTop: spacing.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  badgeText: {
    color: palette.ink,
    fontWeight: '700',
  },
});
