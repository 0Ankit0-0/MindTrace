import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Surface, Text } from 'react-native-paper';

import { palette, radii, shadows, spacing } from '@/constants/theme';

export function VideoPromoCard() {
  return (
    <Surface style={styles.card}>
      <Image
        contentFit="cover"
        source={{
          uri: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
        }}
        style={styles.image}
      />
      <View style={styles.scrim} />
      <View style={styles.content}>
        <Text style={styles.eyebrow}>Promotional Video Area</Text>
        <Text style={styles.title}>Promote campaigns, partner ads, or student wellbeing initiatives</Text>
        <Text style={styles.subtitle}>
          Branded video, scholarship announcements, campus initiatives, or support promotions.
        </Text>
        <View style={styles.row}>
          <View style={styles.playButton}>
            <Ionicons color={palette.surface} name="play" size={20} />
          </View>
          <View>
            <Text style={styles.videoLabel}>Featured campaign</Text>
            <Text style={styles.videoMeta}>02:14 promo preview</Text>
          </View>
        </View>
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.lg,
    overflow: 'hidden',
    position: 'relative',
    ...shadows.card,
  },
  image: {
    height: 240,
    width: '100%',
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 20, 37, 0.45)',
  },
  content: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  eyebrow: {
    color: '#C7D8FF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
  title: {
    color: palette.surface,
    fontSize: 26,
    fontWeight: '800',
    lineHeight: 32,
    marginTop: spacing.sm,
    maxWidth: '88%',
  },
  subtitle: {
    color: '#E9F0FF',
    lineHeight: 21,
    marginTop: spacing.sm,
    maxWidth: '90%',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  playButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderColor: 'rgba(255,255,255,0.28)',
    borderRadius: radii.pill,
    borderWidth: 1,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  videoLabel: {
    color: palette.surface,
    fontWeight: '700',
  },
  videoMeta: {
    color: '#D6E1F6',
    marginTop: 4,
  },
});
