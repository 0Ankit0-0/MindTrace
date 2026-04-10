import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from 'react-native-paper';

import { palette, radii, spacing } from '@/constants/theme';

export function LaunchOverlay({
  visible,
  onFinish,
}: {
  visible: boolean;
  onFinish: () => void;
}) {
  const opacity = useRef(new Animated.Value(1)).current;
  const rise = useRef(new Animated.Value(10)).current;
  const scale = useRef(new Animated.Value(0.96)).current;

  useEffect(() => {
    if (!visible) {
      return;
    }

    const enter = Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(rise, {
        toValue: 0,
        duration: 650,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 650,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);

    const exit = Animated.timing(opacity, {
      toValue: 0,
      duration: 450,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: true,
    });

    const sequence = Animated.sequence([
      enter,
      Animated.delay(2200),
      exit,
    ]);

    sequence.start(({ finished }) => {
      if (finished) {
        onFinish();
      }
    });

    return () => {
      sequence.stop();
    };
  }, [onFinish, opacity, rise, scale, visible]);

  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      pointerEvents="auto"
      style={[
        styles.overlay,
        {
          opacity,
          transform: [{ translateY: rise }, { scale }],
        },
      ]}
    >
      <LinearGradient colors={['#09111F', '#17345F', '#2A6EF0']} style={styles.background}>
        <View style={styles.topGlow} />
        <View style={styles.center}>
          <View style={styles.logoCard}>
            <Image source={require('@/assets/images/icon.png')} style={styles.logo} contentFit="contain" />
          </View>

          <Text style={styles.kicker}>Adaptive Learning & Student Wellbeing System</Text>
          <Text style={styles.title}>MindTrace</Text>
          <Text style={styles.subtitle}>
            Emotion-aware study planning, early stress detection, and supportive student workflows in one experience.
          </Text>

          <View style={styles.showcase}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
              }}
              style={[styles.previewCard, styles.previewPrimary]}
              contentFit="cover"
            />
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
              }}
              style={[styles.previewCard, styles.previewSecondary]}
              contentFit="cover"
            />
          </View>

          <View style={styles.footerRow}>
            <View style={styles.footerPill}>
              <Text style={styles.footerPillText}>Privacy-first wellbeing</Text>
            </View>
            <View style={styles.footerPill}>
              <Text style={styles.footerPillText}>Adaptive academic support</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  topGlow: {
    backgroundColor: 'rgba(159, 212, 255, 0.18)',
    borderRadius: 220,
    height: 220,
    position: 'absolute',
    right: -40,
    top: -50,
    width: 220,
  },
  center: {
    alignItems: 'center',
  },
  logoCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: radii.lg,
    borderWidth: 1,
    height: 108,
    justifyContent: 'center',
    marginBottom: spacing.lg,
    width: 108,
  },
  logo: {
    height: 74,
    width: 74,
  },
  kicker: {
    color: '#C7D8FF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.9,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  title: {
    color: palette.surface,
    fontSize: 38,
    fontWeight: '800',
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    color: '#E3ECFF',
    fontSize: 15,
    lineHeight: 22,
    marginTop: spacing.sm,
    maxWidth: 340,
    textAlign: 'center',
  },
  showcase: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  previewCard: {
    borderRadius: radii.md,
    height: 160,
    overflow: 'hidden',
  },
  previewPrimary: {
    width: 150,
  },
  previewSecondary: {
    marginTop: 26,
    width: 120,
  },
  footerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  footerPill: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: radii.pill,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  footerPillText: {
    color: palette.surface,
    fontWeight: '700',
  },
});
