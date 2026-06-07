import React from 'react';
import { Text, View, type ViewStyle } from 'react-native';
import { colors, font, tracking } from '@/theme/theme';
import { ENTITY_META } from '@/domain/entityMeta';
import type { EntityType } from '@/domain/types';

export interface TagProps {
  type?: EntityType;
  color?: string;
  children?: React.ReactNode;
  dot?: boolean;
  style?: ViewStyle;
}

/** Small pill with a leading dot. Pass `type` to auto-color by entity. */
export function Tag({ type, color, children, dot = true, style }: TagProps) {
  const meta = type ? ENTITY_META[type] : null;
  const c = color ?? (meta ? meta.color : colors.textMuted);
  const label = children ?? (meta ? meta.label : '');
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          height: 24,
          paddingHorizontal: 10,
          borderRadius: 999,
          backgroundColor: colors.fill,
        },
        style,
      ]}
    >
      {dot && <View style={{ width: 8, height: 8, borderRadius: 999, backgroundColor: c }} />}
      <Text style={{ color: colors.textBody, fontFamily: font('sans', 600), fontSize: 12.5, letterSpacing: tracking.snug }}>
        {label}
      </Text>
    </View>
  );
}

export default Tag;
