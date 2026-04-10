import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { Button, Surface, Text, TextInput } from 'react-native-paper';

import { gradients, palette, radii, shadows, spacing } from '@/constants/theme';
import { useMindTrace } from '@/hooks/useMindTrace';

export function AuthGate() {
  const { signIn, signUp, studentProfile } = useMindTrace();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [fullName, setFullName] = useState(studentProfile.fullName);
  const [email, setEmail] = useState('riya@mindtrace.app');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const opacity = useRef(new Animated.Value(0)).current;
  const rise = useRef(new Animated.Value(18)).current;

  const title = mode === 'signin' ? 'Welcome back' : 'Create your account';
  const subtitle =
    mode === 'signin'
      ? 'Sign in to continue with Pulse, Path, Beacon, and your private care circle.'
      : 'Create a private account to keep your emotional check-ins, study rhythm, and support space in one place.';

  const canSubmit = useMemo(() => {
    if (mode === 'signup') {
      return fullName.trim().length > 1 && email.trim().length > 3 && password.trim().length >= 6;
    }

    return email.trim().length > 3 && password.trim().length > 0;
  }, [email, fullName, mode, password]);

  const handleSubmit = () => {
    const success =
      mode === 'signin' ? signIn(email, password) : signUp(fullName, email, password);

    if (!success) {
      setError(
        mode === 'signin'
          ? 'Enter a valid email and password.'
          : 'Use a full name, valid email, and a password with at least 6 characters.'
      );
      return;
    }

    setError('');
    setInfo('');
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 420,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(rise, {
        toValue: 0,
        duration: 420,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, rise]);

  return (
    <LinearGradient colors={['#EAF2FF', '#F7FAFF', '#EFFCF8']} style={styles.screen}>
      <View style={styles.topGlow} />
      <View style={styles.bottomGlow} />
      <Animated.View style={[styles.content, { opacity, transform: [{ translateY: rise }] }]}>
        <View style={styles.hero}>
          <View style={styles.logoWrap}>
            <Image source={require('@/assets/images/icon.png')} style={styles.logo} contentFit="contain" />
          </View>
          <Text style={styles.kicker}>MindTrace</Text>
          <Text style={styles.heroTitle}>Emotion-aware support, ready when you are.</Text>
          <Text style={styles.heroText}>
            Stay in rhythm with a space built for study readiness, reflection, support, and care.
          </Text>
        </View>

        <Surface style={styles.card}>
          <View style={styles.modeRow}>
            <Pressable onPress={() => setMode('signin')} style={[styles.modeChip, mode === 'signin' && styles.modeChipActive]}>
              <Text style={[styles.modeText, mode === 'signin' && styles.modeTextActive]}>Sign in</Text>
            </Pressable>
            <Pressable onPress={() => setMode('signup')} style={[styles.modeChip, mode === 'signup' && styles.modeChipActive]}>
              <Text style={[styles.modeText, mode === 'signup' && styles.modeTextActive]}>Create account</Text>
            </Pressable>
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>

          {mode === 'signup' ? (
            <TextInput
              autoCapitalize="words"
              label="Full name"
              mode="outlined"
              onChangeText={setFullName}
              style={styles.input}
              value={fullName}
            />
          ) : null}

          <TextInput
            autoCapitalize="none"
            keyboardType="email-address"
            label="Email"
            mode="outlined"
            onChangeText={setEmail}
            style={styles.input}
            value={email}
          />

          <TextInput
            label="Password"
            mode="outlined"
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            value={password}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}
          {info ? <Text style={styles.info}>{info}</Text> : null}

          <Button disabled={!canSubmit} mode="contained" onPress={handleSubmit} style={styles.button}>
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

          <LinearGradient colors={gradients.calm} style={styles.legalCard}>
            <Text style={styles.legalText}>
              Your check-ins, care circle, and learning rhythm stay tied to your private account.
            </Text>
          </LinearGradient>
        </Surface>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  topGlow: {
    backgroundColor: 'rgba(61,139,255,0.12)',
    borderRadius: 220,
    height: 220,
    position: 'absolute',
    right: -50,
    top: -40,
    width: 220,
  },
  bottomGlow: {
    backgroundColor: 'rgba(34,199,168,0.10)',
    borderRadius: 240,
    bottom: -80,
    height: 240,
    left: -70,
    position: 'absolute',
    width: 240,
  },
  content: {
    gap: spacing.lg,
  },
  hero: {
    alignItems: 'center',
  },
  logoWrap: {
    alignItems: 'center',
    backgroundColor: 'rgba(61,139,255,0.10)',
    borderColor: 'rgba(61,139,255,0.18)',
    borderRadius: radii.lg,
    borderWidth: 1,
    height: 88,
    justifyContent: 'center',
    width: 88,
  },
  logo: {
    height: 56,
    width: 56,
  },
  kicker: {
    color: palette.primary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginTop: spacing.md,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: palette.navy,
    fontSize: 28,
    fontWeight: '800',
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  heroText: {
    color: palette.slate,
    lineHeight: 22,
    marginTop: spacing.sm,
    maxWidth: 340,
    textAlign: 'center',
  },
  card: {
    backgroundColor: palette.surface,
    borderColor: 'rgba(61,139,255,0.10)',
    borderRadius: radii.lg,
    borderWidth: 1,
    padding: spacing.lg,
    ...shadows.card,
  },
  modeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  modeChip: {
    backgroundColor: palette.mist,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  modeChipActive: {
    backgroundColor: palette.primary,
  },
  modeText: {
    color: palette.navy,
    fontWeight: '700',
  },
  modeTextActive: {
    color: palette.surface,
  },
  title: {
    color: palette.navy,
    fontSize: 24,
    fontWeight: '800',
  },
  subtitle: {
    color: palette.slate,
    lineHeight: 21,
    marginBottom: spacing.lg,
    marginTop: spacing.sm,
  },
  input: {
    backgroundColor: '#FCFDFF',
    marginBottom: spacing.md,
  },
  error: {
    color: palette.danger,
    marginBottom: spacing.sm,
  },
  info: {
    color: palette.primary,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  button: {
    marginTop: spacing.sm,
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  link: {
    color: palette.primary,
    fontWeight: '700',
  },
  legalCard: {
    borderRadius: radii.md,
    marginTop: spacing.md,
    padding: spacing.md,
  },
  legalText: {
    color: palette.ink,
    lineHeight: 20,
  },
});
