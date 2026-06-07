import React from 'react';
import { Text, View } from 'react-native';
import { colors, font, fontSize, tracking } from '@/theme/theme';

export interface SectionLabelProps {
  children: React.ReactNode;
  color?: string;
}

/** Mono uppercase section divider used between row groups. */
export function SectionLabel({ children, color = colors.textSubtle }: SectionLabelProps) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 18, marginBottom: 9, marginHorizontal: 2 }}>
      <Text style={{ fontFamily: font('mono', 600), fontSize: fontSize['2xs'], letterSpacing: tracking.wider, textTransform: 'uppercase', color }}>
        {children}
      </Text>
      <View style={{ flex: 1, height: 1, backgroundColor: colors.borderDefault }} />
    </View>
  );
}

export default SectionLabel;
