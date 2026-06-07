import React from 'react';
import { Icon } from './Icon';

const sizes = { sm: 32, md: 40, lg: 48 };
const iconSizes = { sm: 17, md: 20, lg: 22 };

const variants = {
  solid:  { background: 'var(--accent)', color: '#fff', border: '1px solid transparent' },
  soft:   { background: 'var(--fill)', color: 'var(--text-body)', border: '1px solid transparent' },
  ghost:  { background: 'transparent', color: 'var(--text-muted)', border: '1px solid transparent' },
  outline:{ background: 'var(--surface-card)', color: 'var(--text-body)', border: '1px solid var(--border-strong)' },
};

/**
 * IconButton — square/round icon-only control for toolbars and headers.
 */
export function IconButton({ icon, variant = 'ghost', size = 'md', round = false, disabled = false, onClick, ariaLabel, style = {}, ...rest }) {
  const dim = sizes[size] || sizes.md;
  const v = variants[variant] || variants.ghost;
  const [active, setActive] = React.useState(false);
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={disabled ? undefined : onClick}
      onPointerDown={() => setActive(true)}
      onPointerUp={() => setActive(false)}
      onPointerLeave={() => setActive(false)}
      disabled={disabled}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: dim, height: dim, borderRadius: round ? '999px' : 'var(--radius-sm)',
        background: v.background, color: v.color, border: v.border,
        cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.4 : 1,
        transform: active ? 'scale(0.9)' : 'none', transition: 'transform var(--dur-fast) var(--ease-spring), background var(--dur-fast)',
        WebkitTapHighlightColor: 'transparent', ...style,
      }}
      {...rest}
    >
      <Icon name={icon} size={iconSizes[size] || 20} strokeWidth={2.1} />
    </button>
  );
}
