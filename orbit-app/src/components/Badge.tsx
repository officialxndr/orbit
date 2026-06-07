import React from 'react';
import { Text, View, type ViewStyle } from 'react-native';
import { colors, font } from '@/theme/theme';

type Tone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';

const tones: Record<Tone, { bg: string; fg: string }> = {
  neutral: { bg: colors.fill, fg: colors.textMuted },
  brand: { bg: colors.orbit100, fg: colors.orbit700 },
  success: { bg: colors.successSoft, fg: colors.success },
  warning: { bg: colors.warningSoft, fg: colors.warning },
  danger: { bg: colors.dangerSoft, fg: colors.danger },
  info: { bg: colors.infoSoft, fg: colors.info },
};

export interface BadgeProps {
  children: React.ReactNode;
  tone?: Tone;
  solid?: boolean;
  style?: ViewStyle;
}

/** Compact status / count label. */
export function Badge({ children, tone = 'neutral', solid = false, style }: BadgeProps) {
  const t = tones[tone] ?? tones.neutral;
  return (
    <View
      style={[
        {
          height: 20,
          paddingHorizontal: 8,
          borderRadius: 6,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: solid ? t.fg : t.bg,
        },
        style,
      ]}
    >
      <Text style={{ color: solid ? colors.white : t.fg, fontFamily: font('sans', 700), fontSize: 11.5, letterSpacing: 0.1 }}>
        {children}
      </Text>
    </View>
  );
}

export default Badge;
