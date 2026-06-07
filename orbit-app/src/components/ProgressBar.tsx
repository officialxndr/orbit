import React, { useEffect, useRef } from 'react';
import { Animated, View, type ViewStyle } from 'react-native';
import { colors } from '@/theme/theme';

export interface ProgressBarProps {
  value?: number;
  max?: number;
  color?: string;
  height?: number;
  style?: ViewStyle;
}

/** Thin completion bar (e.g. today's reminders done). */
export function ProgressBar({ value = 0, max = 100, color = colors.accent, height = 8, style }: ProgressBarProps) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;
  const anim = useRef(new Animated.Value(pct)).current;

  useEffect(() => {
    Animated.timing(anim, { toValue: pct, duration: 360, useNativeDriver: false }).start();
  }, [pct, anim]);

  const width = anim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });

  return (
    <View style={[{ width: '100%', height, borderRadius: 999, overflow: 'hidden', backgroundColor: colors.surfaceSunk }, style]}>
      <Animated.View style={{ width, height: '100%', borderRadius: 999, backgroundColor: color }} />
    </View>
  );
}

export default ProgressBar;
