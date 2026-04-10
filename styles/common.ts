import { StyleSheet } from 'react-native';

import { palette, radii, spacing } from '@/constants/theme';

export const commonStyles = StyleSheet.create({
  heroTitle: {
    color: palette.surface,
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 36,
  },
  heroSubtitle: {
    color: '#D7E6FF',
    fontSize: 15,
    lineHeight: 22,
    marginTop: spacing.sm,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  selectionChip: {
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderRadius: radii.pill,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  selectionChipActive: {
    borderColor: palette.primary,
    backgroundColor: palette.primaryMuted,
  },
});
