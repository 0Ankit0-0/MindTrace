import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { Surface, Text, TextInput } from 'react-native-paper';

import { AppHeader } from '@/components/AppHeader';
import { MetricTile } from '@/components/MetricTile';
import { ScreenShell } from '@/components/ScreenShell';
import { SectionHeader } from '@/components/SectionHeader';
import { ChatMode } from '@/constants/DummyData';
import { palette, radii, shadows, spacing } from '@/constants/theme';
import { useMindTrace } from '@/hooks/useMindTrace';

const modeDescriptions: Record<ChatMode, string> = {
  listener: 'For grounding and decompression.',
  laugh: 'For lightness when the spiral needs breaking.',
  brainstorm: 'For direct next-step planning tied to your learning signals.',
};

const ratingLabels = ['Needs work', 'Okay', 'Helpful', 'Very helpful', 'Excellent'];

export default function ChatScreen() {
  const { width } = useWindowDimensions();
  const isWide = width >= 720;
  const {
    chatMessages,
    chatMode,
    lastChatRating,
    latestAiRecommendations,
    latestSessionAnalysis,
    rateChat,
    sendChatMessage,
    setChatMode,
  } = useMindTrace();
  const [draft, setDraft] = useState('');
  const [showModeModal, setShowModeModal] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const modes = useMemo<ChatMode[]>(() => ['listener', 'laugh', 'brainstorm'], []);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [chatMessages]);

  const submitDraft = (message: string) => {
    const trimmed = message.trim();
    if (!trimmed) {
      return;
    }
    sendChatMessage(trimmed);
    setDraft('');
  };

  return (
    <ScreenShell>
      <AppHeader badge="Private support" eyebrow="Shift" title="Shift" subtitle="Chat now reflects your latest weak topics and session drift." />

      <View style={styles.metrics}>
        <View style={[styles.metricWrap, isWide && styles.metricWrapWide]}>
          <MetricTile label="Current Mode" support="Support stance" tone="blue" value={chatMode} />
        </View>
        <View style={[styles.metricWrap, isWide && styles.metricWrapWide]}>
          <MetricTile label="Chat Quality" support={lastChatRating ? ratingLabels[lastChatRating - 1] : 'No rating yet'} tone="green" value={lastChatRating ? `${lastChatRating}/5` : '-'} />
        </View>
      </View>

      {latestAiRecommendations && (
        <Surface style={styles.card}>
          <SectionHeader title="Live Suggestions" />
          <Text style={styles.titleText}>{latestAiRecommendations.explanation}</Text>
          <View style={styles.chips}>
            {latestAiRecommendations.suggestions.map((suggestion) => (
              <Pressable key={suggestion} onPress={() => submitDraft(`Help me with ${suggestion.toLowerCase()}.`)} style={styles.chip}>
                <Text style={styles.chipText}>{suggestion}</Text>
              </Pressable>
            ))}
          </View>
          {latestSessionAnalysis && <Text style={styles.muted}>Current state: {latestSessionAnalysis.state}. {latestSessionAnalysis.reason}</Text>}
        </Surface>
      )}

      <Pressable onPress={() => setShowModeModal(true)} style={styles.selector}>
        <View style={styles.selectorCopy}>
          <Text style={styles.selectorTitle}>{chatMode.charAt(0).toUpperCase() + chatMode.slice(1)}</Text>
          <Text style={styles.muted}>{modeDescriptions[chatMode]}</Text>
        </View>
        <Ionicons color={palette.primary} name="chevron-down-outline" size={20} />
      </Pressable>

      <Surface style={styles.chatCard}>
        <SectionHeader title="Conversation" />
        <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false} style={styles.messageList}>
          {chatMessages.map((message, index) => {
            const isUser = message.role === 'user';
            const isLastBot = !isUser && index === chatMessages.map((item) => item.role).lastIndexOf('bot');
            return (
              <View key={message.id} style={[styles.messageRow, isUser && styles.messageRowUser]}>
                {!isUser && <View style={styles.avatar}><Ionicons color={palette.primary} name="leaf-outline" size={14} /></View>}
                <View style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}>
                  <Text style={[styles.bubbleText, isUser && styles.userBubbleText]}>{message.text}</Text>
                  {!isUser && isLastBot && (
                    <View style={styles.ratingRow}>
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <Pressable key={rating} onPress={() => rateChat(rating)}>
                          <Ionicons color={palette.primary} name={lastChatRating !== null && rating <= lastChatRating ? 'star' : 'star-outline'} size={18} />
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </ScrollView>
        <View style={styles.inputRow}>
          <TextInput mode="outlined" onChangeText={setDraft} placeholder="Ask about a weak topic or paste what feels hard." style={styles.input} value={draft} />
          <Pressable onPress={() => submitDraft(draft)} style={styles.sendButton}>
            <Ionicons color={palette.surface} name="arrow-up-outline" size={20} />
          </Pressable>
        </View>
      </Surface>

      <Modal animationType="slide" onRequestClose={() => setShowModeModal(false)} transparent visible={showModeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Choose Support Mode</Text>
            {modes.map((mode) => (
              <Pressable
                key={mode}
                onPress={() => {
                  setChatMode(mode);
                  setShowModeModal(false);
                }}
                style={[styles.modeRow, chatMode === mode && styles.modeRowActive]}
              >
                <Text style={styles.titleText}>{mode.charAt(0).toUpperCase() + mode.slice(1)}</Text>
                <Text style={styles.muted}>{modeDescriptions[mode]}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  metrics: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.md },
  metricWrap: { width: '100%' },
  metricWrapWide: { flex: 1, width: 'auto' },
  card: { backgroundColor: palette.surface, borderRadius: radii.lg, marginTop: spacing.md, padding: spacing.lg, ...shadows.card },
  titleText: { color: palette.navy, fontSize: 16, fontWeight: '800', lineHeight: 24 },
  muted: { color: palette.slate, lineHeight: 21, marginTop: spacing.xs },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md },
  chip: { backgroundColor: palette.primaryMuted, borderRadius: radii.pill, paddingHorizontal: 12, paddingVertical: 8 },
  chipText: { color: palette.ink, fontWeight: '700' },
  selector: { alignItems: 'center', backgroundColor: palette.mintSoft, borderRadius: radii.md, flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.md, padding: spacing.md },
  selectorCopy: { flex: 1 },
  selectorTitle: { color: palette.navy, fontSize: 16, fontWeight: '800' },
  chatCard: { backgroundColor: palette.surface, borderRadius: radii.lg, flex: 1, marginTop: spacing.md, minHeight: 380, padding: spacing.lg, ...shadows.card },
  messageList: { maxHeight: 420 },
  messageRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm },
  messageRowUser: { justifyContent: 'flex-end' },
  avatar: { alignItems: 'center', backgroundColor: palette.primaryMuted, borderRadius: 14, height: 28, justifyContent: 'center', width: 28 },
  bubble: { borderRadius: radii.md, maxWidth: '88%', padding: spacing.md },
  botBubble: { backgroundColor: palette.mintSoft },
  userBubble: { backgroundColor: palette.primary },
  bubbleText: { color: palette.ink, lineHeight: 21 },
  userBubbleText: { color: palette.surface },
  ratingRow: { flexDirection: 'row', gap: 4, marginTop: spacing.sm },
  inputRow: { alignItems: 'flex-end', flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  input: { backgroundColor: palette.surface, flex: 1 },
  sendButton: { alignItems: 'center', backgroundColor: palette.primary, borderRadius: 24, height: 48, justifyContent: 'center', width: 48 },
  modalOverlay: { backgroundColor: 'rgba(0,0,0,0.35)', flex: 1, justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: palette.surface, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: spacing.lg, paddingBottom: 36 },
  modalTitle: { color: palette.navy, fontSize: 20, fontWeight: '800', marginBottom: spacing.sm },
  modeRow: { backgroundColor: palette.mist, borderRadius: radii.md, marginTop: spacing.sm, padding: spacing.md },
  modeRowActive: { backgroundColor: palette.primaryMuted },
});
