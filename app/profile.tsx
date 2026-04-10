import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Snackbar, Surface, Text, TextInput } from 'react-native-paper';

import { AppHeader } from '@/components/AppHeader';
import { MetricTile } from '@/components/MetricTile';
import { ScreenShell } from '@/components/ScreenShell';
import { SectionHeader } from '@/components/SectionHeader';
import { palette, radii, shadows, spacing } from '@/constants/theme';
import { useMindTrace } from '@/hooks/useMindTrace';

export default function ProfileScreen() {
  const { authUser, isAuthenticated, onboardingQuestions, signIn, signOut, signUp, studentProfile, updateProfile } =
    useMindTrace();
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [fullName, setFullName] = useState(studentProfile.fullName);
  const [email, setEmail] = useState('riya@mindtrace.app');
  const [password, setPassword] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const completion = onboardingQuestions.filter(
    (question) => studentProfile[question.id as keyof typeof studentProfile]
  ).length;
  const completionPercent = Math.round((completion / onboardingQuestions.length) * 100);
  const authTitle = authMode === 'signin' ? 'Sign in' : 'Create account';
  const authSubtitle =
    authMode === 'signin'
      ? 'Access your routines, support history, and saved care circle.'
      : 'Start your personal MindTrace space with a secure student account.';
  const canSubmitAuth = useMemo(() => {
    if (authMode === 'signup') {
      return fullName.trim().length > 1 && email.trim().length > 3 && password.trim().length >= 6;
    }

    return email.trim().length > 3 && password.trim().length > 0;
  }, [authMode, email, fullName, password]);

  const handleAuth = () => {
    const success =
      authMode === 'signin' ? signIn(email, password) : signUp(fullName, email, password);

    setSnackbarMessage(
      success
        ? authMode === 'signin'
          ? 'You are signed in.'
          : 'Account created. Your space is ready.'
        : authMode === 'signin'
          ? 'Enter a valid email and password.'
          : 'Use a name, valid email, and a password with at least 6 characters.'
    );
  };

  return (
    <ScreenShell>
      <AppHeader
        badge={
          isAuthenticated
            ? `${completion}/${onboardingQuestions.length} questions answered`
            : 'Account access'
        }
        eyebrow="You"
        subtitle={isAuthenticated ? 'Your account details.' : 'Sign in or create your space.'}
        title="You"
      />

      <View style={styles.metrics}>
        <MetricTile
          label={isAuthenticated ? 'Profile Completion' : 'Account Status'}
          support={isAuthenticated ? 'Used to improve personalization quality' : 'Secure access to your space'}
          tone="green"
          value={isAuthenticated ? `${completionPercent}%` : 'Guest'}
        />
        <MetricTile
          label={isAuthenticated ? 'Support Profile' : 'Session'}
          support={isAuthenticated ? 'Current preferred support style' : 'Authentication state'}
          tone="blue"
          value={isAuthenticated ? studentProfile.supportStyle.split(' ')[0] : 'Locked'}
        />
      </View>

      {!isAuthenticated ? (
        <Surface style={styles.card}>
          <SectionHeader title={authTitle} />
          <Text style={styles.authSubtitle}>{authSubtitle}</Text>

          <View style={styles.authSwitch}>
            <Pressable
              onPress={() => setAuthMode('signin')}
              style={[styles.authChip, authMode === 'signin' && styles.authChipActive]}
            >
              <Text style={[styles.authChipText, authMode === 'signin' && styles.authChipTextActive]}>
                Sign in
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setAuthMode('signup')}
              style={[styles.authChip, authMode === 'signup' && styles.authChipActive]}
            >
              <Text style={[styles.authChipText, authMode === 'signup' && styles.authChipTextActive]}>
                Create account
              </Text>
            </Pressable>
          </View>

          {authMode === 'signup' ? (
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

          <Button disabled={!canSubmitAuth} mode="contained" onPress={handleAuth} style={styles.button}>
            {authTitle}
          </Button>
        </Surface>
      ) : null}

      {isAuthenticated ? (
        <Surface style={styles.accountCard}>
          <SectionHeader title="Account" />
          <Text style={styles.accountName}>{authUser?.fullName ?? studentProfile.fullName}</Text>
          <Text style={styles.accountEmail}>{authUser?.email}</Text>
          <Button mode="outlined" onPress={signOut} style={styles.signOutButton}>
            Sign out
          </Button>
        </Surface>
      ) : null}

      {isAuthenticated ? (
      <Surface style={styles.card}>
        <SectionHeader title="Details" />

        <ScrollView nestedScrollEnabled={false} scrollEnabled={false}>
          {onboardingQuestions.map((question) => (
            <View key={question.id} style={styles.field}>
              <Text style={styles.label}>{question.label}</Text>
              <Text style={styles.helper}>{question.helper}</Text>
              <TextInput
                mode="outlined"
                multiline={question.id === 'stressTrigger' || question.id === 'supportStyle'}
                numberOfLines={question.id === 'stressTrigger' || question.id === 'supportStyle' ? 3 : 1}
                onChangeText={(value) =>
                  updateProfile(
                    question.id as
                      | 'fullName'
                      | 'institution'
                      | 'program'
                      | 'semester'
                      | 'examWindow'
                      | 'sleepGoal'
                      | 'studyPreference'
                      | 'stressTrigger'
                      | 'supportStyle',
                    value
                  )
                }
                placeholder={question.placeholder}
                value={String(studentProfile[question.id as keyof typeof studentProfile] ?? '')}
              />
            </View>
          ))}
        </ScrollView>

        <Button mode="contained" style={styles.button}>
          Save profile
        </Button>
      </Surface>
      ) : null}

      <Snackbar onDismiss={() => setSnackbarMessage('')} visible={Boolean(snackbarMessage)}>
        {snackbarMessage}
      </Snackbar>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  metrics: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  card: {
    backgroundColor: palette.surface,
    borderRadius: radii.md,
    marginTop: spacing.md,
    padding: spacing.md,
    ...shadows.card,
  },
  accountCard: {
    backgroundColor: palette.surface,
    borderRadius: radii.md,
    marginTop: spacing.md,
    padding: spacing.md,
    ...shadows.card,
  },
  authSubtitle: {
    color: palette.ink,
    lineHeight: 21,
    marginBottom: spacing.md,
  },
  authSwitch: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  authChip: {
    backgroundColor: palette.mist,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  authChipActive: {
    backgroundColor: palette.primary,
  },
  authChipText: {
    color: palette.navy,
    fontWeight: '700',
  },
  authChipTextActive: {
    color: palette.surface,
  },
  input: {
    backgroundColor: palette.surface,
    marginBottom: spacing.md,
  },
  accountName: {
    color: palette.navy,
    fontSize: 20,
    fontWeight: '800',
  },
  accountEmail: {
    color: palette.slate,
    marginTop: 4,
  },
  signOutButton: {
    marginTop: spacing.md,
  },
  field: {
    marginBottom: spacing.lg,
  },
  label: {
    color: palette.navy,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  helper: {
    color: palette.slate,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  button: {
    marginTop: spacing.sm,
  },
});
