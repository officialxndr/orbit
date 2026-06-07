import React from 'react';
import { Animated, Pressable, Text, type ViewStyle } from 'react-native';
import { Icon, type IconName } from './Icon';
import { colors, font, radius, shadow, tracking } from '@/theme/theme';
import { usePressScale } from './usePressScale';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const sizes: Record<Size, { height: number; px: number; fontSize: number; gap: number; icon: number; radius: number }> = {
  sm: { height: 34, px: 14, fontSize: 13, gap: 6, icon: 16, radius: radius.sm },
  md: { height: 44, px: 18, fontSize: 15, gap: 8, icon: 18, radius: radius.md },
  lg: { height: 52, px: 24, fontSize: 16, gap: 9, icon: 20, radius: radius.md },
};

const variants: Record<Variant, { bg: string; fg: string; border: string; shadow?: ViewStyle }> = {
  primary: { bg: colors.accent, fg: colors.textOnBrand, border: 'transparent', shadow: shadow.sm },
  secondary: { bg: colors.surfaceCard, fg: colors.textStrong, border: colors.borderStrong, shadow: shadow.xs },
  ghost: { bg: 'transparent', fg: colors.textBody, border: 'transparent' },
  danger: { bg: colors.danger, fg: colors.white, border: 'transparent', shadow: shadow.sm },
};

export interface ButtonProps {
  children?: React.ReactNode;
  variant?: Variant;
  size?: Size;
  iconLeft?: IconName;
  iconRight?: IconName;
  fullWidth?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  fullWidth = false,
  disabled = false,
  onPress,
  style,
}: ButtonProps) {
  const s = sizes[size];
  const v = variants[variant];
  const { scale, onPressIn, onPressOut } = usePressScale(0.97);
  return (
    <Pressable onPress={disabled ? undefined : onPress} onPressIn={onPressIn} onPressOut={onPressOut} disabled={disabled} style={fullWidth ? { width: '100%' } : undefined}>
      <Animated.View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: s.gap,
            height: s.height,
            paddingHorizontal: s.px,
            borderRadius: s.radius,
            backgroundColor: v.bg,
            borderWidth: 1,
            borderColor: v.border,
            width: fullWidth ? '100%' : undefined,
            opacity: disabled ? 0.45 : 1,
            transform: [{ scale }],
          },
          v.shadow,
          style,
        ]}
      >
        {iconLeft && <Icon name={iconLeft} size={s.icon} color={v.fg} strokeWidth={2.2} />}
        {typeof children === 'string' ? (
          <Text style={{ color: v.fg, fontFamily: font('sans', 600), fontSize: s.fontSize, letterSpacing: tracking.snug }}>{children}</Text>
        ) : (
          children
        )}
        {iconRight && <Icon name={iconRight} size={s.icon} color={v.fg} strokeWidth={2.2} />}
      </Animated.View>
    </Pressable>
  );
}

export default Button;
