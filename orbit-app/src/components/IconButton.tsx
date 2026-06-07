import React from 'react';
import { Animated, Pressable, type ViewStyle } from 'react-native';
import { Icon, type IconName } from './Icon';
import { colors, radius } from '@/theme/theme';
import { usePressScale } from './usePressScale';

type Variant = 'solid' | 'soft' | 'ghost' | 'outline';
type Size = 'sm' | 'md' | 'lg';

const sizes: Record<Size, number> = { sm: 32, md: 40, lg: 48 };
const iconSizes: Record<Size, number> = { sm: 17, md: 20, lg: 22 };

const variants: Record<Variant, { bg: string; fg: string; border: string }> = {
  solid: { bg: colors.accent, fg: colors.white, border: 'transparent' },
  soft: { bg: colors.fill, fg: colors.textBody, border: 'transparent' },
  ghost: { bg: 'transparent', fg: colors.textMuted, border: 'transparent' },
  outline: { bg: colors.surfaceCard, fg: colors.textBody, border: colors.borderStrong },
};

export interface IconButtonProps {
  icon: IconName;
  variant?: Variant;
  size?: Size;
  round?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
  style?: ViewStyle;
}

/** Square/round icon-only control for toolbars and headers. */
export function IconButton({ icon, variant = 'ghost', size = 'md', round = false, disabled = false, onPress, accessibilityLabel, style }: IconButtonProps) {
  const dim = sizes[size];
  const v = variants[variant];
  const { scale, onPressIn, onPressOut } = usePressScale(0.9);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={disabled ? undefined : onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}
    >
      <Animated.View
        style={[
          {
            width: dim,
            height: dim,
            borderRadius: round ? 999 : radius.sm,
            backgroundColor: v.bg,
            borderWidth: 1,
            borderColor: v.border,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: disabled ? 0.4 : 1,
            transform: [{ scale }],
          },
          style,
        ]}
      >
        <Icon name={icon} size={iconSizes[size]} color={v.fg} strokeWidth={2.1} />
      </Animated.View>
    </Pressable>
  );
}

export default IconButton;
