import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, type ViewStyle } from 'react-native';
import { colors, shadow } from '@/theme/theme';

export interface SwitchProps {
  checked?: boolean;
  onChange?: (next: boolean) => void;
  disabled?: boolean;
  color?: string;
  style?: ViewStyle;
}

/** Toggle used for "Track as streak", "Use global default", etc. */
export function Switch({ checked = false, onChange, disabled = false, color = colors.accent, style }: SwitchProps) {
  const anim = useRef(new Animated.Value(checked ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, { toValue: checked ? 1 : 0, duration: 200, useNativeDriver: false }).start();
  }, [checked, anim]);

  const bg = anim.interpolate({ inputRange: [0, 1], outputRange: [colors.lineStrong, color] });
  const translateX = anim.interpolate({ inputRange: [0, 1], outputRange: [0, 18] });

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked, disabled }}
      disabled={disabled}
      onPress={() => onChange?.(!checked)}
    >
      <Animated.View
        style={[
          { width: 46, height: 28, borderRadius: 999, backgroundColor: bg, opacity: disabled ? 0.5 : 1, justifyContent: 'center' },
          style,
        ]}
      >
        <Animated.View
          style={[
            { position: 'absolute', left: 3, width: 22, height: 22, borderRadius: 999, backgroundColor: colors.white, transform: [{ translateX }] },
            shadow.sm,
          ]}
        />
      </Animated.View>
    </Pressable>
  );
}

export default Switch;
