import React from 'react';
import { Animated, Pressable, Text, type ViewStyle } from 'react-native';
import { Icon, type IconName } from './Icon';
import { colors, font, shadow } from '@/theme/theme';
import { usePressScale } from './usePressScale';

export interface FabProps {
  icon?: IconName;
  label?: string;
  onPress?: () => void;
  style?: ViewStyle;
}

/** Floating action button with the brand glow. */
export function Fab({ icon = 'plus', label, onPress, style }: FabProps) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.93);
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label ?? 'Add'} onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
      <Animated.View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            height: 56,
            width: label ? undefined : 56,
            paddingLeft: label ? 18 : 0,
            paddingRight: label ? 22 : 0,
            borderRadius: 999,
            backgroundColor: colors.accent,
            transform: [{ scale }],
          },
          shadow.pop,
          style,
        ]}
      >
        <Icon name={icon} size={26} color={colors.white} strokeWidth={2.4} />
        {label && <Text style={{ color: colors.white, fontFamily: font('sans', 700), fontSize: 16 }}>{label}</Text>}
      </Animated.View>
    </Pressable>
  );
}

export default Fab;
