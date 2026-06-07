import React from 'react';
import { Animated, Pressable, Text, View, type ViewStyle } from 'react-native';
import { EntityIcon } from './EntityIcon';
import { CheckCircle } from './CheckCircle';
import { ENTITY_META } from '@/domain/entityMeta';
import type { EntityType } from '@/domain/types';
import { border, colors, font, radius, shadow, tracking } from '@/theme/theme';
import { usePressScale } from './usePressScale';

export interface EntityRowProps {
  type?: EntityType;
  title: string;
  subtitle?: string;
  checked?: boolean;
  onToggle?: (next: boolean) => void;
  showCheck?: boolean;
  trailing?: React.ReactNode;
  onPress?: () => void;
  /** Override the left accent + icon (e.g. a person-nudge row that isn't an EntityIcon). */
  leading?: React.ReactNode;
  accentColor?: string;
  style?: ViewStyle;
}

/** The signature Orbit list row: typed icon + accent, title, subtitle, trailing check. */
export function EntityRow({
  type = 'task',
  title,
  subtitle,
  checked = false,
  onToggle,
  showCheck = true,
  trailing,
  onPress,
  leading,
  accentColor,
  style,
}: EntityRowProps) {
  const meta = ENTITY_META[type] ?? ENTITY_META.task;
  const accent = accentColor ?? meta.color;
  const { scale, onPressIn, onPressOut } = usePressScale(0.99);

  const content = (
    <Animated.View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          paddingVertical: 12,
          paddingHorizontal: 14,
          backgroundColor: colors.surfaceCard,
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: colors.borderDefault,
          borderLeftWidth: border.accent,
          borderLeftColor: accent,
          transform: [{ scale: onPress ? scale : 1 }],
        },
        shadow.sm,
        style,
      ]}
    >
      {leading ?? <EntityIcon type={type} />}
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text
          numberOfLines={1}
          style={{
            fontFamily: font('sans', 600),
            fontSize: 15.5,
            color: colors.textStrong,
            letterSpacing: tracking.snug,
            textDecorationLine: checked ? 'line-through' : 'none',
            opacity: checked ? 0.5 : 1,
          }}
        >
          {title}
        </Text>
        {subtitle && (
          <Text numberOfLines={1} style={{ fontFamily: font('sans', 400), fontSize: 13, color: colors.textMuted, marginTop: 2 }}>
            {subtitle}
          </Text>
        )}
      </View>
      {trailing}
      {showCheck && !trailing && <CheckCircle checked={checked} onChange={onToggle} color={accent} />}
    </Animated.View>
  );

  if (!onPress) return content;
  return (
    <Pressable onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
      {content}
    </Pressable>
  );
}

export default EntityRow;
