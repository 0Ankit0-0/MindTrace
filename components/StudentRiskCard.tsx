import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';
import { Surface, Text } from 'react-native-paper';

import { StudentSnapshot } from '@/constants/DummyData';
import { palette, radii, shadows, spacing } from '@/constants/theme';

const statusColor = {
  red: palette.danger,
  yellow: palette.warning,
  green: palette.secondary,
};

const velocityArrow = {
  recovering: 'trending-down',
  stable: 'remove',
  declining: 'trending-up',
  critical: 'warning',
} as const;

export function StudentRiskCard({ student }: { student: StudentSnapshot }) {
  return (
    <Surface style={styles.card}>
      <View style={styles.row}>
        <View style={styles.identity}>
          <Text style={styles.name}>{student.name}</Text>
          <Text style={styles.meta}>
            {student.className} | Last check-in {student.lastCheckIn}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColor[student.stressStatus] }]}>
          <Text style={styles.statusText}>{student.stressStatus.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.metrics}>
        <View style={styles.metricBlock}>
          <Text style={styles.metricLabel}>Stress</Text>
          <Text style={styles.metricValue}>{student.stressScore}</Text>
        </View>
        <View style={styles.metricBlock}>
          <Text style={styles.metricLabel}>Affective</Text>
          <Text style={styles.metricSub}>{student.affectiveState}</Text>
        </View>
        <View style={styles.metricBlock}>
          <Text style={styles.metricLabel}>Velocity</Text>
          <View style={styles.velocityRow}>
            <Ionicons
              color={student.velocity === 'recovering' ? palette.secondary : palette.danger}
              name={velocityArrow[student.velocity]}
              size={18}
            />
            <Text style={styles.metricSub}>{student.velocity}</Text>
          </View>
        </View>
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.surface,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.card,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  identity: {
    flex: 1,
    marginRight: spacing.md,
  },
  name: {
    color: palette.navy,
    fontSize: 17,
    fontWeight: '700',
  },
  meta: {
    color: palette.slate,
    marginTop: 4,
  },
  statusBadge: {
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  statusText: {
    color: palette.surface,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  metrics: {
    borderTopColor: palette.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingTop: spacing.md,
  },
  metricBlock: {
    flex: 1,
  },
  metricLabel: {
    color: palette.slate,
    fontSize: 12,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  metricValue: {
    color: palette.navy,
    fontSize: 24,
    fontWeight: '800',
  },
  metricSub: {
    color: palette.ink,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  velocityRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
});
