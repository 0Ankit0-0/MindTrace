import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Surface, Text } from 'react-native-paper';

import { ComfortRecording } from '@/constants/DummyData';
import { palette, radii, shadows, spacing } from '@/constants/theme';

const toneMap = {
  lonely: { label: 'When lonely', color: palette.accent },
  anxious: { label: 'When anxious', color: palette.danger },
  before_exam: { label: 'Before exam', color: palette.warning },
  sleep: { label: 'Sleep support', color: palette.secondary },
};

export function ComfortMessageCard({
  item,
  active,
  onPress,
}: {
  item: ComfortRecording;
  active?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress}>
      <Surface style={[styles.card, active && styles.cardActive]}>
        <Image contentFit="cover" source={{ uri: item.image }} style={styles.image} />
        <View style={styles.copy}>
          <View style={styles.row}>
            <View style={[styles.tag, { backgroundColor: `${toneMap[item.tag].color}20` }]}>
              <Text style={[styles.tagText, { color: toneMap[item.tag].color }]}>{toneMap[item.tag].label}</Text>
            </View>
            <Text style={styles.duration}>{item.duration}</Text>
          </View>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.meta}>From {item.from}</Text>
          <Text style={styles.note}>{item.note}</Text>
          <View style={styles.playRow}>
            <Ionicons color={active ? palette.secondary : palette.primary} name={active ? 'pause' : 'play'} size={16} />
            <Text style={[styles.playText, active && styles.playTextActive]}>
              {active ? 'Now playing preview' : 'Play comfort note'}
            </Text>
          </View>
        </View>
      </Surface>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.surface,
    borderRadius: radii.md,
    overflow: 'hidden',
    ...shadows.card,
  },
  cardActive: {
    borderColor: palette.secondary,
    borderWidth: 1,
  },
  image: {
    height: 138,
    width: '100%',
  },
  copy: {
    padding: spacing.md,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tag: {
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '700',
  },
  duration: {
    color: palette.slate,
    fontWeight: '600',
  },
  title: {
    color: palette.navy,
    fontSize: 18,
    fontWeight: '800',
    marginTop: spacing.sm,
  },
  meta: {
    color: palette.slate,
    marginTop: 4,
  },
  note: {
    color: palette.ink,
    lineHeight: 21,
    marginTop: spacing.sm,
  },
  playRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: spacing.md,
  },
  playText: {
    color: palette.primary,
    fontWeight: '700',
  },
  playTextActive: {
    color: palette.secondary,
  },
});
