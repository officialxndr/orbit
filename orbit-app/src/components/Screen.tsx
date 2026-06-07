import React from 'react';
import { ScrollView, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, layout } from '@/theme/theme';

export interface ScreenProps {
  children: React.ReactNode;
  /** Absolutely-positioned overlay (e.g. a FAB) above the scroll content. */
  floating?: React.ReactNode;
  /** Extra bottom padding for the scroll content (clears the tab bar by default). */
  contentPaddingBottom?: number;
  contentStyle?: ViewStyle;
  scroll?: boolean;
}

/** Standard page scaffold: paper background, safe-area top, padded scroll body. */
export function Screen({ children, floating, contentPaddingBottom = 140, contentStyle, scroll = true }: ScreenProps) {
  const insets = useSafeAreaInsets();
  const padding: ViewStyle = {
    paddingTop: insets.top + 8,
    paddingHorizontal: layout.screenPad,
    paddingBottom: contentPaddingBottom,
  };
  return (
    <View style={{ flex: 1, backgroundColor: colors.surfacePage }}>
      {scroll ? (
        <ScrollView contentContainerStyle={[padding, contentStyle]} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      ) : (
        <View style={[{ flex: 1 }, padding, contentStyle]}>{children}</View>
      )}
      {floating ? (
        <View style={{ position: 'absolute', right: 20, bottom: insets.bottom + 84 }}>{floating}</View>
      ) : null}
    </View>
  );
}

export default Screen;
