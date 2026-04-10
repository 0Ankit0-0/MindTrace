import Ionicons from '@expo/vector-icons/Ionicons';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Button, Surface, Text, TextInput } from 'react-native-paper';

import { AppHeader } from '@/components/AppHeader';
import { MetricTile } from '@/components/MetricTile';
import { ScreenShell } from '@/components/ScreenShell';
import { SectionHeader } from '@/components/SectionHeader';
import { palette, radii, shadows, spacing } from '@/constants/theme';
import { useMindTrace } from '@/hooks/useMindTrace';

const journalMoodOptions = ['happy', 'calm', 'neutral', 'sad', 'stressed', 'anxious'] as const;

export default function JournalScreen() {
  const { width } = useWindowDimensions();
  const compact = width < 390;
  const {
    addJournalEntry,
    deleteJournalEntry,
    journalEntries,
    toggleJournalPin,
  } = useMindTrace();

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tagDraft, setTagDraft] = useState('');
  const [mood, setMood] = useState<(typeof journalMoodOptions)[number]>('calm');
  const [query, setQuery] = useState('');

  const filteredEntries = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const sorted = [...journalEntries].sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)));

    if (!normalizedQuery) {
      return sorted;
    }

    return sorted.filter((entry) =>
      `${entry.title} ${entry.body} ${entry.tags.join(' ')}`.toLowerCase().includes(normalizedQuery)
    );
  }, [journalEntries, query]);

  const pinnedCount = journalEntries.filter((entry) => entry.pinned).length;
  const todayCount = journalEntries.filter((entry) => entry.createdAt.toLowerCase().includes('today')).length;

  const handleCreate = () => {
    if (!body.trim()) {
      return;
    }

    addJournalEntry({
      title,
      body,
      mood,
      tags: tagDraft
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    });
    setTitle('');
    setBody('');
    setTagDraft('');
    setMood('calm');
  };

  return (
    <ScreenShell>
      <AppHeader
        badge={`${journalEntries.length} entries saved`}
        eyebrow="Journal"
        subtitle="Capture thoughts, moments, and patterns as they happen."
        title="Journal"
      />

      <View style={[styles.metrics, compact && styles.metricsCompact]}>
        <MetricTile label="Entries" support="Saved reflections" tone="blue" value={`${journalEntries.length}`} />
        <MetricTile label="Pinned" support="Kept close" tone="purple" value={`${pinnedCount}`} />
        <MetricTile label="Today" support="Fresh reflections" tone="green" value={`${todayCount}`} />
      </View>

      <Surface style={styles.card}>
        <SectionHeader title="New entry" subtitle="Keep it light. A few honest lines are enough." />

        <TextInput
          label="Title"
          mode="outlined"
          onChangeText={setTitle}
          placeholder="What stood out today?"
          style={styles.input}
          value={title}
        />
        <TextInput
          label="Reflection"
          mode="outlined"
          multiline
          numberOfLines={5}
          onChangeText={setBody}
          placeholder="Write what happened, what felt heavy, or what shifted."
          style={styles.input}
          value={body}
        />
        <TextInput
          label="Tags"
          mode="outlined"
          onChangeText={setTagDraft}
          placeholder="study, exam, energy"
          style={styles.input}
          value={tagDraft}
        />

        <Text style={styles.moodLabel}>Mood</Text>
        <View style={styles.moodRow}>
          {journalMoodOptions.map((option) => {
            const active = option === mood;
            return (
              <Pressable
                key={option}
                onPress={() => setMood(option)}
                style={[styles.moodChip, active && styles.moodChipActive]}
              >
                <Text style={[styles.moodText, active && styles.moodTextActive]}>{option}</Text>
              </Pressable>
            );
          })}
        </View>

        <Button mode="contained" onPress={handleCreate} style={styles.button}>
          Save entry
        </Button>
      </Surface>

      <Surface style={styles.card}>
        <SectionHeader title="Library" subtitle="Search past reflections by title, mood, or tags." />
        <TextInput
          left={<TextInput.Icon icon="magnify" />}
          mode="outlined"
          onChangeText={setQuery}
          placeholder="Search entries"
          style={styles.input}
          value={query}
        />

        <View style={styles.entryList}>
          {filteredEntries.map((entry) => (
            <Surface key={entry.id} style={styles.entryCard}>
              <View style={styles.entryHeader}>
                <View style={styles.entryCopy}>
                  <View style={styles.entryTitleRow}>
                    <Text style={styles.entryTitle}>{entry.title}</Text>
                    {entry.pinned ? <Ionicons color={palette.warning} name="bookmark" size={16} /> : null}
                  </View>
                  <Text style={styles.entryMeta}>
                    {entry.createdAt} • {entry.mood}
                  </Text>
                </View>
                <View style={styles.entryActions}>
                  <Pressable onPress={() => toggleJournalPin(entry.id)} style={styles.iconButton}>
                    <Ionicons color={palette.primary} name={entry.pinned ? 'bookmark' : 'bookmark-outline'} size={18} />
                  </Pressable>
                  <Pressable onPress={() => deleteJournalEntry(entry.id)} style={styles.iconButton}>
                    <Ionicons color={palette.danger} name="trash-outline" size={18} />
                  </Pressable>
                </View>
              </View>

              <Text style={styles.entryBody}>{entry.body}</Text>
              <View style={styles.tagRow}>
                {entry.tags.map((tag) => (
                  <View key={`${entry.id}-${tag}`} style={styles.tagChip}>
                    <Text style={styles.tagText}>#{tag}</Text>
                  </View>
                ))}
              </View>
            </Surface>
          ))}
        </View>
      </Surface>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  metrics: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  metricsCompact: {
    flexWrap: 'wrap',
  },
  card: {
    backgroundColor: palette.surface,
    borderRadius: radii.lg,
    marginTop: spacing.md,
    padding: spacing.md,
    ...shadows.card,
  },
  input: {
    backgroundColor: palette.surface,
    marginBottom: spacing.md,
  },
  moodLabel: {
    color: palette.navy,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  moodRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  moodChip: {
    backgroundColor: palette.mist,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  moodChipActive: {
    backgroundColor: palette.primary,
  },
  moodText: {
    color: palette.navy,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  moodTextActive: {
    color: palette.surface,
  },
  button: {
    marginTop: spacing.md,
  },
  entryList: {
    gap: spacing.md,
  },
  entryCard: {
    backgroundColor: '#FCFDFF',
    borderColor: palette.border,
    borderRadius: radii.md,
    borderWidth: 1,
    padding: spacing.md,
  },
  entryHeader: {
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  entryCopy: {
    flex: 1,
  },
  entryTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  entryTitle: {
    color: palette.navy,
    flexShrink: 1,
    fontSize: 17,
    fontWeight: '800',
  },
  entryMeta: {
    color: palette.slate,
    marginTop: 4,
    textTransform: 'capitalize',
  },
  entryActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  iconButton: {
    alignItems: 'center',
    backgroundColor: palette.mist,
    borderRadius: radii.pill,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  entryBody: {
    color: palette.ink,
    lineHeight: 21,
    marginTop: spacing.md,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  tagChip: {
    backgroundColor: '#EEF4FF',
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tagText: {
    color: palette.primary,
    fontWeight: '700',
  },
});
