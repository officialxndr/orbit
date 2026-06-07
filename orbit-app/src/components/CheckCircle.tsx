import React, { useEffect, useRef } from 'react';
import { Animated, Pressable } from 'react-native';
import { Icon } from './Icon';
import { colors } from '@/theme/theme';

const dims = { sm: 24, md: 28, lg: 32 } as const;

export interface CheckCircleProps {
  checked?: boolean;
  onChange?: (next: boolean) => void;
  color?: string;
  size?: keyof typeof dims;
}

/** Circular completion toggle; springs in a checkmark when done. */
export function CheckCircle({ checked = false, onChange, color = colors.accent, size = 'md' }: CheckCircleProps) {
  const d = dims[size];
  const anim = useRef(new Animated.Value(checked ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(anim, { toValue: checked ? 1 : 0, useNativeDriver: true, speed: 18, bounciness: 10 }).start();
  }, [checked, anim]);

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      hitSlop={8}
      onPress={() => onChange?.(!checked)}
      style={{
        width: d,
        height: d,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: checked ? color : 'transparent',
        borderWidth: 2,
        borderColor: checked ? color : colors.lineStrong,
      }}
    >
      <Animated.View style={{ opacity: anim, transform: [{ scale: anim }] }}>
        <Icon name="check" size={d * 0.58} color={colors.white} strokeWidth={3} />
      </Animated.View>
    </Pressable>
  );
}

export default CheckCircle;
