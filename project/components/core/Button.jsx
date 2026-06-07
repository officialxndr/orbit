import React from 'react';
import { Icon } from './Icon';

const sizes = {
  sm: { height: 34, padding: '0 14px', fontSize: 13, gap: 6, icon: 16, radius: 'var(--radius-sm)' },
  md: { height: 44, padding: '0 18px', fontSize: 15, gap: 8, icon: 18, radius: 'var(--radius-md)' },
  lg: { height: 52, padding: '0 24px', fontSize: 16, gap: 9, icon: 20, radius: 'var(--radius-md)' },
};

const variants = {
  primary:   { background: 'var(--accent)', color: 'var(--text-on-brand)', border: '1px solid transparent', shadow: 'var(--shadow-sm)' },
  secondary: { background: 'var(--surface-card)', color: 'var(--text-strong)', border: '1px solid var(--border-strong)', shadow: 'var(--shadow-xs)' },
  ghost:     { background: 'transparent', color: 'var(--text-body)', border: '1px solid transparent', shadow: 'none' },
  danger:    { background: 'var(--danger)', color: '#fff', border: '1px solid transparent', shadow: 'var(--shadow-sm)' },
};

/**
 * Button — primary action control.
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  fullWidth = false,
  disabled = false,
  onClick,
  style = {},
  ...rest
}) {
  const s = sizes[size] || sizes.md;
  const v = variants[variant] || variants.primary;
  const [active, setActive] = React.useState(false);
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      onPointerDown={() => setActive(true)}
      onPointerUp={() => setActive(false)}
      onPointerLeave={() => setActive(false)}
      disabled={disabled}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: s.gap,
        height: s.height, padding: s.padding, fontFamily: 'var(--font-sans)', fontSize: s.fontSize,
        fontWeight: 600, letterSpacing: 'var(--tracking-snug)', borderRadius: s.radius,
        background: v.background, color: v.color, border: v.border, boxShadow: active ? 'none' : v.shadow,
        width: fullWidth ? '100%' : 'auto', cursor: disabled ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap',
        opacity: disabled ? 0.45 : 1, transform: active ? 'scale(0.97)' : 'none',
        transition: 'transform var(--dur-fast) var(--ease-spring), box-shadow var(--dur-fast), background var(--dur-fast)',
        WebkitTapHighlightColor: 'transparent', userSelect: 'none', ...style,
      }}
      {...rest}
    >
      {iconLeft && <Icon name={iconLeft} size={s.icon} strokeWidth={2.2} />}
      {children}
      {iconRight && <Icon name={iconRight} size={s.icon} strokeWidth={2.2} />}
    </button>
  );
}
