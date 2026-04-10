import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { palette, radii, shadows, spacing } from '@/constants/theme';

export function QuickActionTile({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.iconWrap}>
        <Ionicons color={palette.primary} name={icon} size={20} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.surface,
    borderRadius: radii.md,
    flex: 1,
    minHeight: 132,
    padding: spacing.md,
    ...shadows.card,
  },
  iconWrap: {
    alignItems: 'center',
    backgroundColor: palette.primaryMuted,
    borderRadius: radii.sm,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  title: {
    color: palette.navy,
    fontSize: 16,
    fontWeight: '700',
    marginTop: spacing.md,
  },
  subtitle: {
    color: palette.slate,
    lineHeight: 20,
    marginTop: 6,
  },
});
