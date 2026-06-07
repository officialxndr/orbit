import React, { useState } from 'react';
import { Text, TextInput, View, type KeyboardTypeOptions, type ViewStyle } from 'react-native';
import { Icon, type IconName } from './Icon';
import { colors, font, radius } from '@/theme/theme';

export interface InputProps {
  label?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  icon?: IconName;
  keyboardType?: KeyboardTypeOptions;
  error?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  style?: ViewStyle;
}

/** Labeled single-line text field with optional leading icon. */
export function Input({ label, value, onChangeText, placeholder, icon, keyboardType, error, disabled = false, autoFocus, style }: InputProps) {
  const [focus, setFocus] = useState(false);
  const borderColor = error ? colors.danger : focus ? colors.accent : colors.borderStrong;
  return (
    <View style={[{ gap: 6 }, style]}>
      {label && <Text style={{ fontFamily: font('sans', 600), fontSize: 13, color: colors.textBody }}>{label}</Text>}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 9,
          height: 46,
          paddingHorizontal: 14,
          backgroundColor: disabled ? colors.fill : colors.surfaceCard,
          borderRadius: radius.md,
          borderWidth: 1.5,
          borderColor,
        }}
      >
        {icon && <Icon name={icon} size={18} color={colors.textSubtle} />}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textSubtle}
          editable={!disabled}
          autoFocus={autoFocus}
          keyboardType={keyboardType}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{ flex: 1, fontFamily: font('sans', 400), fontSize: 15, color: colors.textStrong, padding: 0 }}
        />
      </View>
      {error && <Text style={{ fontFamily: font('sans', 400), fontSize: 12, color: colors.danger }}>{error}</Text>}
    </View>
  );
}

export default Input;
