import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Surface, Text } from 'react-native-paper';

import { PromoBanner } from '@/constants/DummyData';
import { palette, radii, shadows, spacing } from '@/constants/theme';

export function ImageShowcaseCard({ banner }: { banner: PromoBanner }) {
  return (
    <Surface style={styles.card}>
      <Image contentFit="cover" source={{ uri: banner.image }} style={styles.image} />
      <View style={styles.overlay}>
        <Text style={styles.title}>{banner.title}</Text>
        <Text style={styles.subtitle}>{banner.subtitle}</Text>
        <View style={styles.cta}>
          <Ionicons color={palette.surface} name="arrow-forward" size={14} />
          <Text style={styles.ctaText}>{banner.cta}</Text>
        </View>
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.surface,
    borderRadius: radii.md,
    overflow: 'hidden',
    ...shadows.card,
  },
  image: {
    height: 180,
    width: '100%',
  },
  overlay: {
    padding: spacing.md,
  },
  title: {
    color: palette.navy,
    fontSize: 20,
    fontWeight: '800',
  },
  subtitle: {
    color: palette.slate,
    lineHeight: 21,
    marginTop: 6,
  },
  cta: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: palette.primary,
    borderRadius: radii.pill,
    flexDirection: 'row',
    gap: 8,
    marginTop: spacing.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  ctaText: {
    color: palette.surface,
    fontWeight: '700',
  },
});
