import React from 'react';
import { Icon } from '../core/Icon';

/**
 * Fab — floating action button with the brand glow. Defaults to a plus.
 */
export function Fab({ icon = 'plus', onClick, label, style = {} }) {
  const [active, setActive] = React.useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label || 'Add'}
      onPointerDown={() => setActive(true)}
      onPointerUp={() => setActive(false)}
      onPointerLeave={() => setActive(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        height: 56, width: label ? 'auto' : 56, padding: label ? '0 22px 0 18px' : 0,
        borderRadius: 999, border: 'none', cursor: 'pointer',
        background: 'var(--accent)', color: '#fff', boxShadow: 'var(--shadow-pop)',
        transform: active ? 'scale(0.93)' : 'none', transition: 'transform var(--dur-fast) var(--ease-spring)',
        WebkitTapHighlightColor: 'transparent', ...style,
      }}
    >
      <Icon name={icon} size={26} strokeWidth={2.4} />
      {label && <span style={{ fontFamily: 'var(--font-sans)', fontSize: 16, fontWeight: 700 }}>{label}</span>}
    </button>
  );
}
