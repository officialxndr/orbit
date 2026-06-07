import React from 'react';
import { Text, View, type ViewStyle } from 'react-native';
import { Icon } from './Icon';
import { colors, font } from '@/theme/theme';

export interface StreakBadgeProps {
  count?: number;
  active?: boolean;
  style?: ViewStyle;
}

/** Flame glyph + day count in mono. Greys out when a streak breaks. */
export function StreakBadge({ count = 0, active = true, style }: StreakBadgeProps) {
  const on = active && count > 0;
  const color = on ? colors.habit : colors.textSubtle;
  return (
    <View
      style={[
        { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 3, paddingHorizontal: 8, borderRadius: 999, backgroundColor: on ? colors.habitSoft : colors.fill },
        style,
      ]}
    >
      <Icon name="flame" size={14} color={color} strokeWidth={2.4} />
      <Text style={{ fontFamily: font('mono', 600), fontSize: 13, color, lineHeight: 14 }}>{count}</Text>
    </View>
  );
}

export default StreakBadge;
