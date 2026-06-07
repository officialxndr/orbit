import React from 'react';
import { ENTITY_META } from '../data/EntityIcon';

/**
 * Tag — small pill with a leading dot. Pass `type` to auto-color by entity,
 * or `color`/`children` for a free-form tag.
 */
export function Tag({ type, color, children, dot = true, style = {} }) {
  const meta = type ? ENTITY_META[type] : null;
  const c = color || (meta ? meta.color : 'var(--text-muted)');
  const label = children || (meta ? meta.label : '');
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        height: 24, padding: '0 10px', borderRadius: 'var(--radius-pill)',
        background: 'var(--fill)', color: 'var(--text-body)',
        fontFamily: 'var(--font-sans)', fontSize: 12.5, fontWeight: 600,
        letterSpacing: 'var(--tracking-snug)', whiteSpace: 'nowrap', ...style,
      }}
    >
      {dot && <span style={{ width: 8, height: 8, borderRadius: 999, background: c, flex: 'none' }} />}
      {label}
    </span>
  );
}
