import React from 'react';
import { Pressable, Text, View, type ViewStyle } from 'react-native';
import { colors, font, radius, shadow, tracking } from '@/theme/theme';

export interface SegmentOption {
  value: string;
  label: string;
}

export interface SegmentedControlProps {
  options: (SegmentOption | string)[];
  value: string;
  onChange?: (value: string) => void;
  style?: ViewStyle;
}

/** iOS-style segmented filter. */
export function SegmentedControl({ options, value, onChange, style }: SegmentedControlProps) {
  const opts: SegmentOption[] = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
  return (
    <View style={[{ flexDirection: 'row', gap: 2, padding: 3, borderRadius: radius.md, backgroundColor: colors.surfaceSunk }, style]}>
      {opts.map((o) => {
        const selected = o.value === value;
        return (
          <Pressable
            key={o.value}
            onPress={() => onChange?.(o.value)}
            style={[
              { flex: 1, height: 32, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center', backgroundColor: selected ? colors.surfaceCard : 'transparent' },
              selected ? shadow.xs : null,
            ]}
          >
            <Text
              numberOfLines={1}
              style={{ color: selected ? colors.textStrong : colors.textMuted, fontFamily: font('sans', 600), fontSize: 13.5, letterSpacing: tracking.snug }}
            >
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default SegmentedControl;
