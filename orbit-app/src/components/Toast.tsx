import React, { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from './Icon';
import { useToast } from '@/store/useToast';
import { colors, font, layout, shadow } from '@/theme/theme';

/** App-wide toast host; mount once near the root. */
export function ToastHost() {
  const message = useToast((s) => s.message);
  const insets = useSafeAreaInsets();
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(anim, { toValue: message ? 1 : 0, useNativeDriver: true, speed: 14, bounciness: 6 }).start();
  }, [message, anim]);

  if (!message) return null;
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, bottom: layout.tabbarHeight + insets.bottom + 24, alignItems: 'center' }}>
      <Animated.View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            backgroundColor: colors.ink900,
            paddingVertical: 11,
            paddingHorizontal: 16,
            borderRadius: 999,
            opacity: anim,
            transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }],
          },
          shadow.lg,
        ]}
      >
        <Icon name="circle-check-big" size={17} color={colors.routine} />
        <Text style={{ color: colors.white, fontFamily: font('sans', 600), fontSize: 14 }}>{message}</Text>
      </Animated.View>
    </View>
  );
}

export default ToastHost;
