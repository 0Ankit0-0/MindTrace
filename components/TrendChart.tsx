import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Line, Polyline, Text as SvgText } from 'react-native-svg';
import { Text } from 'react-native-paper';

import { MoodLog } from '@/constants/DummyData';
import { palette, spacing } from '@/constants/theme';

export function TrendChart({ data }: { data: MoodLog[] }) {
  const width = 320;
  const height = 160;
  const maxY = 10;
  const minY = 0;
  const padding = 18;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const toPoint = (entry: MoodLog, index: number) => {
    const x = padding + (index / Math.max(data.length - 1, 1)) * chartWidth;
    const y = padding + ((maxY - entry.score) / (maxY - minY)) * chartHeight;
    return { x, y };
  };

  const points = data.map(toPoint);
  const polyline = points.map((point) => `${point.x},${point.y}`).join(' ');

  return (
    <View style={styles.container}>
      <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        {[2, 5, 8].map((mark) => {
          const y = padding + ((maxY - mark) / (maxY - minY)) * chartHeight;
          return (
            <Line
              key={mark}
              x1={padding}
              y1={y}
              x2={width - padding}
              y2={y}
              stroke="#DCE3EF"
              strokeDasharray="4 6"
            />
          );
        })}
        <Polyline fill="none" points={polyline} stroke={palette.primary} strokeWidth="4" />
        {points.map((point, index) => (
          <Circle
            key={`${data[index].day}-${index}`}
            cx={point.x}
            cy={point.y}
            r="5"
            fill={palette.surface}
            stroke={palette.primary}
            strokeWidth="3"
          />
        ))}
        {data.map((entry, index) => (
          <SvgText
            key={entry.day}
            x={points[index]?.x ?? 0}
            y={height - 4}
            fill={palette.slate}
            fontSize="11"
            textAnchor="middle"
          >
            {entry.day}
          </SvgText>
        ))}
      </Svg>
      <Text style={styles.caption}>7-day emotional velocity</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.sm,
  },
  caption: {
    color: palette.slate,
    marginTop: 4,
  },
});
