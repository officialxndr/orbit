import React from 'react';

/**
 * SegmentedControl — iOS-style segmented filter. `options` is an array of
 * { value, label } (or plain strings). Controlled via `value` + `onChange`.
 */
export function SegmentedControl({ options = [], value, onChange, style = {} }) {
  const opts = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
  return (
    <div
      style={{
        display: 'flex', gap: 2, padding: 3, borderRadius: 'var(--radius-md)',
        background: 'var(--surface-sunk)', ...style,
      }}
    >
      {opts.map((o) => {
        const selected = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange && onChange(o.value)}
            style={{
              flex: 1, height: 32, border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
              background: selected ? 'var(--surface-card)' : 'transparent',
              color: selected ? 'var(--text-strong)' : 'var(--text-muted)',
              fontFamily: 'var(--font-sans)', fontSize: 13.5, fontWeight: 600,
              letterSpacing: 'var(--tracking-snug)',
              boxShadow: selected ? 'var(--shadow-xs)' : 'none',
              transition: 'background var(--dur-fast), color var(--dur-fast)',
              WebkitTapHighlightColor: 'transparent', whiteSpace: 'nowrap', padding: '0 10px',
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
