import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Modal, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, shadow, space } from '@/theme/theme';

export interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

/** Slide-up modal sheet with a dimmed backdrop and grab handle. */
export function BottomSheet({ visible, onClose, children }: BottomSheetProps) {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(Dimensions.get('window').height)).current;
  const backdrop = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, speed: 16, bounciness: 4 }),
        Animated.timing(backdrop, { toValue: 1, duration: 220, useNativeDriver: true }),
      ]).start();
    } else {
      translateY.setValue(Dimensions.get('window').height);
      backdrop.setValue(0);
    }
  }, [visible, translateY, backdrop]);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <Animated.View style={{ ...StyleSheetAbsoluteFill, opacity: backdrop }}>
          <Pressable style={{ flex: 1, backgroundColor: 'rgba(27,26,23,0.4)' }} onPress={onClose} />
        </Animated.View>
        <Animated.View
          style={[
            {
              backgroundColor: colors.surfacePage,
              borderTopLeftRadius: radius.xl,
              borderTopRightRadius: radius.xl,
              paddingTop: 10,
              paddingHorizontal: space[5],
              paddingBottom: space[5] + insets.bottom,
              maxHeight: '88%',
              transform: [{ translateY }],
            },
            shadow.xl,
          ]}
        >
          <View style={{ width: 38, height: 5, borderRadius: 999, backgroundColor: colors.lineStrong, alignSelf: 'center', marginBottom: 14 }} />
          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const StyleSheetAbsoluteFill = { position: 'absolute' as const, top: 0, left: 0, right: 0, bottom: 0 };

export default BottomSheet;
