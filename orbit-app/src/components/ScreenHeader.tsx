import React from 'react';
import { Text, View, type ViewStyle } from 'react-native';
import { colors, font, fontSize, tracking } from '@/theme/theme';

export interface ScreenHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  trailing?: React.ReactNode;
  style?: ViewStyle;
}

/** Large screen title with optional eyebrow, subtitle and a trailing action. */
export function ScreenHeader({ eyebrow, title, subtitle, trailing, style }: ScreenHeaderProps) {
  return (
    <View style={[{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, paddingTop: 8, paddingBottom: 14 }, style]}>
      <View style={{ flex: 1 }}>
        {eyebrow && (
          <Text style={{ fontFamily: font('mono', 600), fontSize: fontSize['2xs'], letterSpacing: tracking.wider, textTransform: 'uppercase', color: colors.textSubtle, marginBottom: 4 }}>
            {eyebrow}
          </Text>
        )}
        <Text style={{ fontFamily: font('display', 800), fontSize: 28, letterSpacing: tracking.tight, color: colors.textStrong, lineHeight: 30 }}>
          {title}
        </Text>
        {subtitle && (
          <Text style={{ fontFamily: font('sans', 400), fontSize: fontSize.sm + 1, color: colors.textMuted, marginTop: 6 }}>{subtitle}</Text>
        )}
      </View>
      {trailing}
    </View>
  );
}

export default ScreenHeader;
