import React from 'react';
import { Pressable, TextInput, View, type ViewStyle } from 'react-native';
import { Icon } from './Icon';
import { colors, font, radius } from '@/theme/theme';

export interface SearchBarProps {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  style?: ViewStyle;
}

/** Rounded search field used atop lists (Today, Items, link-picker). */
export function SearchBar({ value = '', onChangeText, placeholder = 'Search', onClear, style }: SearchBarProps) {
  return (
    <View
      style={[
        { flexDirection: 'row', alignItems: 'center', gap: 9, height: 42, paddingHorizontal: 12, backgroundColor: colors.surfaceSunk, borderRadius: radius.md },
        style,
      ]}
    >
      <Icon name="search" size={18} color={colors.textSubtle} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSubtle}
        style={{ flex: 1, fontFamily: font('sans', 400), fontSize: 15, color: colors.textStrong, padding: 0 }}
      />
      {value.length > 0 && (
        <Pressable accessibilityLabel="Clear" hitSlop={8} onPress={onClear} style={{ width: 18, height: 18, borderRadius: 999, backgroundColor: colors.ink300, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="x" size={12} color={colors.white} strokeWidth={2.6} />
        </Pressable>
      )}
    </View>
  );
}

export default SearchBar;
