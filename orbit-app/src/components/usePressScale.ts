import { useRef } from 'react';
import { Animated } from 'react-native';

/** Spring press-scale feedback for tappable controls (matches the DS spring feel). */
export function usePressScale(to = 0.96) {
  const scale = useRef(new Animated.Value(1)).current;
  const onPressIn = () =>
    Animated.spring(scale, { toValue: to, useNativeDriver: true, speed: 50, bounciness: 0 }).start();
  const onPressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 8 }).start();
  return { scale, onPressIn, onPressOut };
}
