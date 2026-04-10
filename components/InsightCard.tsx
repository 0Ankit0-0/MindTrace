import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { Surface, Text } from 'react-native-paper';

import { palette, radii, shadows, spacing } from '@/constants/theme';

export function InsightCard({
  eyebrow,
  title,
  value,
  footer,
  accentColor = palette.primary,
  children,
}: {
  eyebrow: string;
  title: string;
  value?: string;
  footer?: string;
  accentColor?: string;
  children?: ReactNode;
}) {
  return (
    <Surface style={styles.card}>
      <View style={[styles.accent, { backgroundColor: accentColor }]} />
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.title}>{title}</Text>
      {value ? <Text style={styles.value}>{value}</Text> : null}
      {children}
      {footer ? <Text style={styles.footer}>{footer}</Text> : null}
    </Surface>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.surface,
    borderRadius: radii.md,
    padding: spacing.md,
    ...shadows.card,
  },
  accent: {
    height: 4,
    width: 44,
    borderRadius: radii.pill,
    marginBottom: spacing.sm,
  },
  eyebrow: {
    color: palette.slate,
    fontSize: 12,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  title: {
    color: palette.ink,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  value: {
    color: palette.navy,
    fontSize: 34,
    fontWeight: '800',
    marginBottom: 6,
  },
  footer: {
    color: palette.slate,
    marginTop: 10,
    lineHeight: 20,
  },
});
