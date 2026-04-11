import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Surface, Text, TextInput } from 'react-native-paper';

import { palette, radii, spacing } from '@/constants/theme';
import { useMindTrace } from '@/hooks/useMindTrace';

export function AuthGate() {
  const { isAuthLoading, signIn, signUp, studentProfile, syncError } = useMindTrace();
  const { width } = useWindowDimensions();
  const compact = width < 380;

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [fullName, setFullName] = useState(studentProfile.fullName);
  const [email, setEmail] = useState('riya@mindtrace.app');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardRise = useRef(new Animated.Value(18)).current;

  const title = mode === 'signin' ? 'Welcome back' : 'Create your account';
  const subtitle =
    mode === 'signin'
      ? 'Sign in to continue with Pulse, Path, Beacon, and your private care circle.'
      : 'Create a private account to keep your check-ins, study rhythm, and support space in one place.';

  const canSubmit = useMemo(() => {
    if (mode === 'signup') {
      return fullName.trim().length > 1 && email.trim().length > 3 && password.trim().length >= 6;
    }
    return email.trim().length > 3 && password.trim().length > 0;
  }, [email, fullName, mode, password]);

  const handleSubmit = async () => {
    const success =
      mode === 'signin' ? await signIn(email, password) : await signUp(fullName, email, password);

    if (!success) {
      setError(
        syncError ||
          (mode === 'signin'
            ? 'Enter a valid email and password.'
            : 'Use a full name, valid email, and a password with at least 6 characters.')
      );
      return;
    }
    setError('');
    setInfo('');
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 380,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(cardRise, {
        toValue: 0,
        duration: 380,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [cardOpacity, cardRise]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={['#0D2818', '#1A5C38', '#2D9B5A']}
          end={{ x: 1, y: 1 }}
          start={{ x: 0, y: 0 }}
          style={styles.gradient}
        >
          {/* Decorative circles */}
          <View style={styles.circleTopRight} />
          <View style={styles.circleBottomLeft} />

          {/* Brand section — no animation, appears immediately */}
          <View style={[styles.brandSection, compact && styles.brandSectionCompact]}>
            <View style={[styles.brandMark, compact && styles.brandMarkCompact]}>
              <Ionicons color="white" name="leaf-outline" size={32} />
            </View>
            <Text style={[styles.brandName, compact && styles.brandNameCompact]}>MindTrace</Text>
            <Text style={styles.brandTagline}>Emotion-aware learning support</Text>
            <View style={styles.pillRow}>
              <View style={styles.featurePill}>
                <Text style={styles.featurePillText}>Privacy-first</Text>
              </View>
              <View style={styles.featurePill}>
                <Text style={styles.featurePillText}>Adaptive learning</Text>
              </View>
            </View>
          </View>

          {/* Animated form card */}
          <Animated.View
            style={[
              styles.cardWrap,
              { opacity: cardOpacity, transform: [{ translateY: cardRise }] },
            ]}
          >
            <Surface
              style={[
                styles.card,
                compact && styles.cardCompact,
                {
                  elevation: 8,
                  shadowColor: '#0D2818',
                  shadowOpacity: 0.15,
                  shadowOffset: { width: 0, height: 12 },
                  shadowRadius: 24,
                },
              ]}
            >
              {/* Mode switcher — segmented control */}
              <View style={styles.modeContainer}>
                <Pressable
                  onPress={() => setMode('signin')}
                  style={[styles.modeBtn, mode === 'signin' && styles.modeBtnActive]}
                >
                  <Text style={[styles.modeBtnText, mode === 'signin' && styles.modeBtnTextActive]}>
                    Sign in
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setMode('signup')}
                  style={[styles.modeBtn, mode === 'signup' && styles.modeBtnActive]}
                >
                  <Text style={[styles.modeBtnText, mode === 'signup' && styles.modeBtnTextActive]}>
                    Create account
                  </Text>
                </Pressable>
              </View>

              <Text style={styles.formTitle}>{title}</Text>
              <Text style={styles.formSubtitle}>{subtitle}</Text>

              {mode === 'signup' ? (
                <TextInput
                  autoCapitalize="words"
                  autoCorrect={false}
                  label="Full name"
                  left={
                    <TextInput.Icon
                      icon={({ size, color }) => (
                        <Ionicons color={color} name="person-outline" size={size} />
                      )}
                    />
                  }
                  mode="outlined"
                  onChangeText={setFullName}
                  style={styles.input}
                  value={fullName}
                />
              ) : null}

              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                label="Email"
                left={
                  <TextInput.Icon
                    icon={({ size, color }) => (
                      <Ionicons color={color} name="mail-outline" size={size} />
                    )}
                  />
                }
                mode="outlined"
                onChangeText={setEmail}
                style={styles.input}
                value={email}
              />

              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                label="Password"
                left={
                  <TextInput.Icon
                    icon={({ size, color }) => (
                      <Ionicons color={color} name="lock-closed-outline" size={size} />
                    )}
                  />
                }
                mode="outlined"
                onChangeText={setPassword}
                right={
                  <TextInput.Icon
                    icon={({ size, color }) => (
                      <Ionicons
                        color={color}
                        name={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
                        size={size}
                      />
                    )}
                    onPress={() => setPasswordVisible((v) => !v)}
                  />
                }
                secureTextEntry={!passwordVisible}
                style={styles.input}
                value={password}
              />

              {error.length > 0 ? (
                <View style={styles.errorBanner}>
                  <Text style={styles.errorBannerText}>{error}</Text>
                </View>
              ) : null}

              {info.length > 0 ? (
                <View style={styles.infoBanner}>
                  <Text style={styles.infoBannerText}>{info}</Text>
                </View>
              ) : null}

              <Button
                contentStyle={styles.buttonContent}
                disabled={!canSubmit || isAuthLoading}
                loading={isAuthLoading}
                mode="contained"
                onPress={handleSubmit}
                style={styles.submitButton}
                labelStyle={styles.submitLabel}
              >
                {mode === 'signin' ? 'Enter MindTrace' : 'Create account'}
              </Button>

              <View style={styles.linkRow}>
                <Pressable
                  onPress={() => {
                    setError('');
                    setInfo('Password reset will be connected once backend authentication is live.');
                  }}
                >
                  <Text style={styles.link}>Forgot password?</Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    setError('');
                    setInfo('By continuing, you agree to the Terms and Privacy experience.');
                  }}
                >
                  <Text style={styles.link}>Terms & Privacy</Text>
                </Pressable>
              </View>

              {/* Trust badge */}
              <View style={styles.trustBadge}>
                <Ionicons color={palette.primary} name="shield-checkmark-outline" size={20} />
                <Text style={styles.trustText}>
                  Your check-ins and care circle are tied to your private account only.
                </Text>
              </View>
            </Surface>
          </Animated.View>

          {/* Social proof tiles */}
          <View style={styles.proofRow}>
            {[
              { icon: 'pulse-outline', label: 'Mood Tracking' },
              { icon: 'book-outline', label: 'Smart Journal' },
              { icon: 'school-outline', label: 'Adaptive Test' },
            ].map((tile) => (
              <View key={tile.label} style={styles.proofTile}>
                <Ionicons color="white" name={tile.icon as 'pulse-outline'} size={22} />
                <Text style={styles.proofLabel}>{tile.label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  gradient: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  circleTopRight: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 130,
    height: 260,
    position: 'absolute',
    right: -60,
    top: -80,
    width: 260,
  },
  circleBottomLeft: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 100,
    bottom: -60,
    height: 200,
    left: -50,
    position: 'absolute',
    width: 200,
  },
  brandSection: {
    alignItems: 'center',
    paddingBottom: spacing.lg,
    paddingTop: spacing.xl,
    width: '100%',
  },
  brandSectionCompact: {
    paddingTop: spacing.md,
  },
  brandMark: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderColor: 'rgba(255,255,255,0.25)',
    borderRadius: 36,
    borderWidth: 1.5,
    height: 72,
    justifyContent: 'center',
    width: 72,
  },
  brandMarkCompact: {
    borderRadius: 30,
    height: 60,
    width: 60,
  },
  brandName: {
    color: 'white',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  brandNameCompact: {
    fontSize: 26,
  },
  brandTagline: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 6,
    textAlign: 'center',
  },
  pillRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  featurePill: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: radii.pill,
    marginHorizontal: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  featurePillText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
  cardWrap: {
    width: '100%',
  },
  card: {
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderRadius: radii.xl,
    borderWidth: 1,
    marginTop: spacing.lg,
    padding: spacing.lg,
  },
  cardCompact: {
    padding: spacing.md,
  },
  modeContainer: {
    backgroundColor: palette.mist,
    borderRadius: radii.pill,
    flexDirection: 'row',
    marginBottom: spacing.lg,
    padding: 4,
  },
  modeBtn: {
    alignItems: 'center',
    borderRadius: radii.pill,
    flex: 1,
    paddingVertical: 10,
  },
  modeBtnActive: {
    backgroundColor: palette.primary,
  },
  modeBtnText: {
    color: palette.slate,
    fontSize: 14,
    fontWeight: '600',
  },
  modeBtnTextActive: {
    color: 'white',
    fontWeight: '800',
  },
  formTitle: {
    color: palette.navy,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 6,
  },
  formSubtitle: {
    color: palette.slate,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: spacing.lg,
  },
  input: {
    backgroundColor: palette.surface,
    marginBottom: spacing.md,
  },
  errorBanner: {
    backgroundColor: palette.dangerMuted,
    borderLeftColor: palette.danger,
    borderLeftWidth: 4,
    borderRadius: radii.md,
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  errorBannerText: {
    color: palette.danger,
    fontSize: 13,
    lineHeight: 20,
  },
  infoBanner: {
    backgroundColor: palette.mintSoft,
    borderLeftColor: palette.primary,
    borderLeftWidth: 4,
    borderRadius: radii.md,
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  infoBannerText: {
    color: palette.ink,
    fontSize: 13,
    lineHeight: 20,
  },
  submitButton: {
    borderRadius: radii.pill,
    marginTop: spacing.sm,
    paddingVertical: 6,
  },
  submitLabel: {
    fontSize: 16,
    fontWeight: '800',
  },
  buttonContent: {
    height: 52,
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  link: {
    color: palette.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  trustBadge: {
    alignItems: 'center',
    backgroundColor: palette.mintSoft,
    borderRadius: radii.md,
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
    padding: spacing.md,
  },
  trustText: {
    color: palette.ink,
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
  },
  proofRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  proofTile: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: radii.md,
    flex: 1,
    padding: spacing.md,
  },
  proofLabel: {
    color: 'white',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 6,
    textAlign: 'center',
  },
});
