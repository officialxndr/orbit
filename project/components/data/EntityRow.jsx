import React from 'react';
import { EntityIcon, ENTITY_META } from './EntityIcon';
import { CheckCircle } from '../forms/CheckCircle';
import { Icon } from '../core/Icon';

/**
 * EntityRow — the signature Orbit list row. Entity-typed icon + accent, title,
 * subtitle, and a trailing completion check (or any custom trailing node).
 */
export function EntityRow({
  type = 'task',
  title,
  subtitle,
  checked = false,
  onToggle,
  showCheck = true,
  trailing,
  onClick,
  style = {},
}) {
  const meta = ENTITY_META[type] || ENTITY_META.task;
  const [active, setActive] = React.useState(false);
  return (
    <div
      onClick={onClick}
      onPointerDown={() => onClick && setActive(true)}
      onPointerUp={() => setActive(false)}
      onPointerLeave={() => setActive(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
        background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-default)',
        borderLeft: `var(--border-accent) solid ${meta.color}`,
        boxShadow: 'var(--shadow-sm)', cursor: onClick ? 'pointer' : 'default',
        transform: active ? 'scale(0.99)' : 'none', transition: 'transform var(--dur-fast) var(--ease-out)',
        ...style,
      }}
    >
      <EntityIcon type={type} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: 'var(--font-sans)', fontSize: 15.5, fontWeight: 600, color: 'var(--text-strong)',
            letterSpacing: 'var(--tracking-snug)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            textDecoration: checked ? 'line-through' : 'none', opacity: checked ? 0.5 : 1,
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-muted)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {subtitle}
          </div>
        )}
      </div>
      {trailing}
      {showCheck && !trailing && (
        <CheckCircle checked={checked} onChange={onToggle} color={meta.color} />
      )}
    </div>
  );
}
