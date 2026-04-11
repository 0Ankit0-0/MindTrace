import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Surface, Text, TextInput } from 'react-native-paper';

import { AnimatedReveal } from '@/components/AnimatedReveal';
import { AppHeader } from '@/components/AppHeader';
import { MetricTile } from '@/components/MetricTile';
import { ScreenShell } from '@/components/ScreenShell';
import { SectionHeader } from '@/components/SectionHeader';
import { ChatMode } from '@/constants/DummyData';
import { palette, radii, shadows, spacing } from '@/constants/theme';
import { useMindTrace } from '@/hooks/useMindTrace';

const modeDescriptions: Record<ChatMode, string> = {
  listener: 'For venting, decompression, and gentle reflection.',
  laugh: 'For lightness, recovery, and breaking a spiral.',
  brainstorm: 'For turning overwhelm into a precise next step.',
};

const ratingLabels = ['Needs work', 'Okay', 'Helpful', 'Very helpful', 'Excellent'];

export default function ChatScreen() {
  const { chatMessages, chatMode, lastChatRating, rateChat, sendChatMessage, setChatMode } = useMindTrace();
  const [draft, setDraft] = useState('');
  const [showModeModal, setShowModeModal] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const sortedModes = useMemo<ChatMode[]>(() => ['listener', 'laugh', 'brainstorm'], []);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [chatMessages]);

  const lastBotIndex = chatMessages.map((m) => m.role).lastIndexOf('bot');

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

      {/* Mode selector bar */}
      <AnimatedReveal delay={100}>
        <Pressable onPress={() => setShowModeModal(true)} style={styles.modeSelectorBar}>
          <View style={styles.modeSelectorLeft}>
            <Text style={styles.modeSelectorTitle}>{chatMode.charAt(0).toUpperCase() + chatMode.slice(1)}</Text>
            <Text style={styles.modeSelectorDesc}>{modeDescriptions[chatMode]}</Text>
          </View>
          <Ionicons color={palette.primary} name="chevron-down-outline" size={20} />
        </Pressable>
      </AnimatedReveal>

      {/* Conversation area */}
      <AnimatedReveal delay={160}>
        <Surface style={styles.chatSurface}>
          <SectionHeader title="Conversation" />
          <ScrollView
            ref={scrollRef}
            showsVerticalScrollIndicator={false}
            style={styles.messagesScroll}
          >
            {chatMessages.map((message, index) => {
              const isUser = message.role === 'user';
              const isLastBot = !isUser && index === lastBotIndex;

              return (
                <View key={message.id}>
                  {isUser ? (
                    <View style={styles.userBubbleWrap}>
                      <View style={styles.userBubble}>
                        <Text style={styles.userText}>{message.text}</Text>
                      </View>
                      <Text style={styles.timestamp}>Just now</Text>
                    </View>
                  ) : (
                    <View style={styles.botBubbleWrap}>
                      <View style={styles.botAvatarCircle}>
                        <Ionicons color={palette.primary} name="leaf-outline" size={14} />
                      </View>
                      <View style={styles.botBubbleContent}>
                        <View style={styles.botBubble}>
                          <Text style={styles.botText}>{message.text}</Text>
                        </View>
                        <Text style={styles.timestamp}>Just now</Text>
                        {isLastBot ? (
                          <View style={styles.inlineRating}>
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <Pressable key={rating} onPress={() => rateChat(rating)}>
                                <Ionicons
                                  color={palette.primary}
                                  name={lastChatRating !== null && rating <= lastChatRating ? 'star' : 'star-outline'}
                                  size={18}
                                />
                              </Pressable>
                            ))}
                          </View>
                        ) : null}
                      </View>
                    </View>
                  )}
                </View>
              );
            })}
          </ScrollView>

          {/* Input area */}
          <View style={styles.inputRow}>
            <TextInput
              mode="outlined"
              onChangeText={setDraft}
              placeholder="Type a message or paste what feels hard."
              style={styles.input}
              value={draft}
            />
            <Pressable
              onPress={() => {
                sendChatMessage(draft);
                setDraft('');
              }}
              style={styles.sendButton}
            >
              <Ionicons color="white" name="arrow-up-outline" size={20} />
            </Pressable>
          </View>
        </Surface>
      </AnimatedReveal>

      {/* Mode selection modal */}
      <Modal
        animationType="slide"
        onRequestClose={() => setShowModeModal(false)}
        transparent
        visible={showModeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Choose Support Mode</Text>
            {sortedModes.map((mode) => {
              const isActive = chatMode === mode;
              return (
                <Pressable
                  key={mode}
                  onPress={() => {
                    setChatMode(mode);
                    setShowModeModal(false);
                  }}
                  style={[
                    styles.modeItem,
                    isActive && styles.modeItemActive,
                  ]}
                >
                  <Text style={[styles.modeItemTitle, isActive && styles.modeItemTitleActive]}>
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </Text>
                  <Text style={styles.modeItemDesc}>{modeDescriptions[mode]}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </Modal>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  metrics: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  modeSelectorBar: {
    alignItems: 'center',
    backgroundColor: palette.mintSoft,
    borderRadius: radii.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    padding: spacing.md,
  },
  modeSelectorLeft: {
    flex: 1,
  },
  modeSelectorTitle: {
    color: palette.navy,
    fontSize: 16,
    fontWeight: '800',
  },
  modeSelectorDesc: {
    color: palette.slate,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 2,
  },
  chatSurface: {
    backgroundColor: palette.surface,
    borderRadius: radii.md,
    flex: 1,
    marginTop: spacing.md,
    minHeight: 300,
    padding: spacing.md,
    ...shadows.card,
  },
  messagesScroll: {
    maxHeight: 340,
  },
  userBubbleWrap: {
    alignItems: 'flex-end',
    marginBottom: spacing.sm,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: palette.primary,
    borderRadius: radii.md,
    maxWidth: '80%',
    padding: spacing.md,
  },
  userText: {
    color: 'white',
    lineHeight: 21,
  },
  botBubbleWrap: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 8,
    marginBottom: spacing.sm,
  },
  botAvatarCircle: {
    alignItems: 'center',
    backgroundColor: palette.primaryMuted,
    borderRadius: 14,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  botBubbleContent: {
    flex: 1,
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: palette.mintSoft,
    borderRadius: radii.md,
    maxWidth: '92%',
    padding: spacing.md,
  },
  botText: {
    color: palette.ink,
    lineHeight: 21,
  },
  timestamp: {
    color: palette.sage,
    fontSize: 11,
    marginTop: 2,
  },
  inlineRating: {
    flexDirection: 'row',
    gap: 4,
    marginTop: spacing.sm,
  },
  inputRow: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  input: {
    backgroundColor: palette.surface,
    flex: 1,
  },
  sendButton: {
    alignItems: 'center',
    backgroundColor: palette.primary,
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  modalOverlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: palette.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: spacing.lg,
    paddingBottom: 40,
  },
  modalHandle: {
    alignSelf: 'center',
    backgroundColor: palette.border,
    borderRadius: 2,
    height: 4,
    marginBottom: spacing.lg,
    width: 40,
  },
  modalTitle: {
    color: palette.navy,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: spacing.sm,
  },
  modeItem: {
    backgroundColor: palette.mist,
    borderColor: 'transparent',
    borderRadius: radii.md,
    borderWidth: 1,
    marginTop: spacing.sm,
    padding: spacing.md,
  },
  modeItemActive: {
    backgroundColor: palette.primaryMuted,
    borderColor: palette.primary,
  },
  modeItemTitle: {
    color: palette.navy,
    fontWeight: '700',
  },
  modeItemTitleActive: {
    color: palette.primary,
  },
  modeItemDesc: {
    color: palette.slate,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 4,
  },
});
