import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Button, Surface, Text, TextInput } from 'react-native-paper';

import { AnimatedReveal } from '@/components/AnimatedReveal';
import { AppHeader } from '@/components/AppHeader';
import { MetricTile } from '@/components/MetricTile';
import { ScreenShell } from '@/components/ScreenShell';
import { SectionHeader } from '@/components/SectionHeader';
import { ChatMode } from '@/constants/DummyData';
import { getEmotionTheme, palette, radii, shadows, spacing } from '@/constants/theme';
import { useMindTrace } from '@/hooks/useMindTrace';

const modeDescriptions: Record<ChatMode, string> = {
  listener: 'For venting, decompression, and gentle reflection.',
  laugh: 'For lightness, recovery, and breaking a spiral.',
  brainstorm: 'For turning overwhelm into a precise next step.',
};

const ratingLabels = ['Needs work', 'Okay', 'Helpful', 'Very helpful', 'Excellent'];

export default function ChatScreen() {
  const { affectiveState, chatMessages, chatMode, lastChatRating, rateChat, sendChatMessage, setChatMode } =
    useMindTrace();
  const [draft, setDraft] = useState('');
  const emotionTheme = getEmotionTheme(affectiveState);

  const sortedModes = useMemo<ChatMode[]>(() => ['listener', 'laugh', 'brainstorm'], []);

  return (
    <ScreenShell>
      <AnimatedReveal>
        <AppHeader
          badge="Private support"
          eyebrow="Shift"
          subtitle="Choose a mode and start talking."
          title="Shift"
        />
      </AnimatedReveal>

      <AnimatedReveal delay={70} style={styles.metrics}>
        <MetricTile
          label="Current Mode"
          support="Support stance in this session"
          tone="blue"
          value={chatMode}
        />
        <MetricTile
          label="Chat Quality"
          support={lastChatRating ? ratingLabels[lastChatRating - 1] : 'No rating yet'}
          tone="green"
          value={lastChatRating ? `${lastChatRating}/5` : '-'}
        />
      </AnimatedReveal>

      <AnimatedReveal delay={110}>
        <SectionHeader title="Modes" />
      <View style={styles.modeRow}>
        {sortedModes.map((mode) => {
          const isActive = chatMode === mode;
          return (
            <Pressable
              key={mode}
              onPress={() => setChatMode(mode)}
              style={[
                styles.modeChip,
                isActive && styles.modeChipActive,
                isActive && { borderColor: emotionTheme.accent, backgroundColor: emotionTheme.surfaceTint },
              ]}
            >
              <Text style={[styles.modeTitle, isActive && styles.modeTitleActive]}>{mode}</Text>
              <Text style={[styles.modeText, isActive && styles.modeTextActive]}>{modeDescriptions[mode]}</Text>
            </Pressable>
          );
        })}
      </View>
      </AnimatedReveal>

      <AnimatedReveal delay={160}>
        <Surface style={styles.chatSurface}>
        <SectionHeader title="Conversation" />
        {chatMessages.map((message) => (
          <View
            key={message.id}
            style={[styles.bubble, message.role === 'user' ? styles.userBubble : styles.botBubble]}
          >
            <Text style={message.role === 'user' ? styles.userText : styles.botText}>{message.text}</Text>
          </View>
        ))}

        <TextInput
          mode="outlined"
          onChangeText={setDraft}
          placeholder="Type a message or paste what feels hard."
          style={styles.input}
          value={draft}
        />
        <Button
          mode="contained"
          onPress={() => {
            sendChatMessage(draft);
            setDraft('');
          }}
        >
          Send
        </Button>
      </Surface>
      </AnimatedReveal>

      <AnimatedReveal delay={220}>
        <Surface style={styles.ratingCard}>
        <SectionHeader title="Rate this chat" />
        <View style={styles.ratingRow}>
          {ratingLabels.map((label, index) => {
            const rating = index + 1;
            const isActive = rating === lastChatRating;

            return (
              <Pressable
                key={label}
                onPress={() => rateChat(rating)}
                style={[styles.ratingChip, isActive && styles.ratingChipActive]}
              >
                <Text style={[styles.ratingNumber, isActive && styles.ratingNumberActive]}>{rating}</Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={styles.ratingFeedback}>
          Selected quality signal: {lastChatRating ? ratingLabels[lastChatRating - 1] : 'No rating yet'}
        </Text>
      </Surface>
      </AnimatedReveal>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  metrics: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  modeRow: {
    gap: spacing.sm,
  },
  modeChip: {
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderRadius: radii.md,
    borderWidth: 1,
    padding: spacing.md,
  },
  modeChipActive: {
    backgroundColor: '#EEF4FF',
    borderColor: palette.primary,
  },
  modeTitle: {
    color: palette.navy,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  modeTitleActive: {
    color: palette.primary,
  },
  modeText: {
    color: palette.slate,
    lineHeight: 20,
  },
  modeTextActive: {
    color: palette.ink,
  },
  chatSurface: {
    backgroundColor: palette.surface,
    borderRadius: radii.md,
    marginTop: spacing.md,
    padding: spacing.md,
    ...shadows.card,
  },
  bubble: {
    borderRadius: radii.md,
    marginBottom: spacing.sm,
    maxWidth: '92%',
    padding: spacing.md,
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#EDF7F2',
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#EEF4FF',
  },
  botText: {
    color: palette.ink,
    lineHeight: 21,
  },
  userText: {
    color: palette.navy,
    lineHeight: 21,
  },
  input: {
    backgroundColor: palette.surface,
    marginTop: spacing.sm,
  },
  ratingCard: {
    backgroundColor: palette.surface,
    borderRadius: radii.md,
    marginTop: spacing.md,
    padding: spacing.md,
    ...shadows.card,
  },
  ratingRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  ratingChip: {
    alignItems: 'center',
    backgroundColor: palette.mist,
    borderRadius: radii.pill,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  ratingChipActive: {
    backgroundColor: palette.primary,
  },
  ratingNumber: {
    color: palette.navy,
    fontWeight: '800',
  },
  ratingNumberActive: {
    color: palette.surface,
  },
  ratingFeedback: {
    color: palette.ink,
    marginTop: spacing.md,
  },
});
