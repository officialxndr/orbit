import React from 'react';
import { Icon } from '../core/Icon';

const dims = { sm: 24, md: 28, lg: 32 };

/**
 * CheckCircle — circular completion toggle. Fills with `color` (defaults to the
 * entity-type accent) and springs in a checkmark when done.
 */
export function CheckCircle({ checked = false, onChange, color = 'var(--accent)', size = 'md', style = {} }) {
  const d = dims[size] || dims.md;
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onChange && onChange(!checked)}
      style={{
        width: d, height: d, flex: 'none', borderRadius: 999, padding: 0, cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        background: checked ? color : 'transparent',
        border: checked ? `2px solid ${color}` : '2px solid var(--line-strong)',
        transition: 'background var(--dur-fast) var(--ease-out), border-color var(--dur-fast)',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <span
        style={{
          display: 'inline-flex', color: '#fff',
          transform: checked ? 'scale(1)' : 'scale(0)', opacity: checked ? 1 : 0,
          transition: 'transform var(--dur-base) var(--ease-spring), opacity var(--dur-fast)',
        }}
      >
        <Icon name="check" size={d * 0.58} strokeWidth={3} />
      </span>
    </button>
  );
}
