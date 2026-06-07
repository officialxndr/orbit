import React from 'react';
import { View, type ViewStyle } from 'react-native';
import { colors } from '@/theme/theme';

const heat = [colors.heat0, colors.heat1, colors.heat2, colors.heat3, colors.heat4];

export interface HeatmapProps {
  data: number[]; // intensities 0..4
  columns?: number;
  cell?: number;
  gap?: number;
  style?: ViewStyle;
}

/** Consistency grid using the streak heat ramp. Wraps into `columns` columns. */
export function Heatmap({ data, columns = 7, cell = 15, gap = 4, style }: HeatmapProps) {
  const width = columns * cell + (columns - 1) * gap;
  return (
    <View style={[{ flexDirection: 'row', flexWrap: 'wrap', width, gap }, style]}>
      {data.map((v, i) => (
        <View
          key={i}
          style={{ width: cell, height: cell, borderRadius: 4, backgroundColor: heat[Math.max(0, Math.min(4, v))] }}
        />
      ))}
    </View>
  );
}

export default Heatmap;
