import React from 'react';

/**
 * Card — base surface container. `accent` adds the entity-type left border.
 */
export function Card({ children, accent, padding = 16, interactive = false, onClick, style = {} }) {
  const [active, setActive] = React.useState(false);
  return (
    <div
      onClick={onClick}
      onPointerDown={() => interactive && setActive(true)}
      onPointerUp={() => setActive(false)}
      onPointerLeave={() => setActive(false)}
      style={{
        background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-default)',
        borderLeft: accent ? `var(--border-accent) solid ${accent}` : '1px solid var(--border-default)',
        boxShadow: 'var(--shadow-sm)', padding, boxSizing: 'border-box',
        cursor: interactive ? 'pointer' : 'default',
        transform: active ? 'scale(0.99)' : 'none',
        transition: 'transform var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast)', ...style,
      }}
    >
      {children}
    </div>
  );
}
