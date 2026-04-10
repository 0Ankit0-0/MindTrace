import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Surface, TextInput } from 'react-native-paper';

import { AppHeader } from '@/components/AppHeader';
import { MetricTile } from '@/components/MetricTile';
import { ScreenShell } from '@/components/ScreenShell';
import { SectionHeader } from '@/components/SectionHeader';
import { StudentRiskCard } from '@/components/StudentRiskCard';
import { palette, radii, shadows, spacing } from '@/constants/theme';
import { getCounselorStudents } from '@/services/mindtrace-engine';

export default function CounselorScreen() {
  const [query, setQuery] = useState('');
  const students = useMemo(() => getCounselorStudents(), []);

  const filteredStudents = useMemo(
    () =>
      students.filter((student) =>
        `${student.name} ${student.className}`.toLowerCase().includes(query.trim().toLowerCase())
      ),
    [query, students]
  );

  const redCount = students.filter((student) => student.stressStatus === 'red').length;
  const yellowCount = students.filter((student) => student.stressStatus === 'yellow').length;
  const greenCount = students.filter((student) => student.stressStatus === 'green').length;

  return (
    <ScreenShell>
      <AppHeader
        badge={`${students.length} students monitored`}
        eyebrow="CareDesk"
        subtitle="Live student overview."
        title="CareDesk"
      />

      <View style={styles.metricRow}>
        <MetricTile label="Red Queue" support="Immediate attention" tone="red" value={`${redCount}`} />
        <MetricTile label="Yellow Queue" support="Watch and engage" tone="yellow" value={`${yellowCount}`} />
        <MetricTile label="Green Queue" support="Stable signals" tone="green" value={`${greenCount}`} />
      </View>

      <Surface style={styles.searchPanel}>
        <SectionHeader title="Search" />
        <TextInput
          left={<TextInput.Icon icon="magnify" />}
          mode="outlined"
          onChangeText={setQuery}
          placeholder="Search students, class, or cohort"
          value={query}
        />
      </Surface>

      <Surface style={styles.listPanel}>
        <SectionHeader title="Students" />
        <View style={styles.list}>
          {filteredStudents.map((student) => (
            <StudentRiskCard key={student.id} student={student} />
          ))}
        </View>
      </Surface>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  metricRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  searchPanel: {
    backgroundColor: palette.surface,
    borderRadius: radii.md,
    marginTop: spacing.md,
    padding: spacing.md,
    ...shadows.card,
  },
  listPanel: {
    backgroundColor: palette.surface,
    borderRadius: radii.md,
    marginTop: spacing.md,
    padding: spacing.md,
    ...shadows.card,
  },
  list: {
    marginTop: spacing.sm,
  },
});
