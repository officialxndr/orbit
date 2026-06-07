import React from 'react';
import { Icon } from '../core/Icon';

/**
 * StreakBadge — flame glyph + day count in mono. Greys out when a streak breaks.
 */
export function StreakBadge({ count = 0, active = true, style = {} }) {
  const color = active && count > 0 ? 'var(--habit)' : 'var(--text-subtle)';
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '3px 8px', borderRadius: 'var(--radius-pill)',
        background: active && count > 0 ? 'var(--habit-soft)' : 'var(--fill)', color, ...style,
      }}
    >
      <Icon name="flame" size={14} strokeWidth={2.4} />
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, lineHeight: 1 }}>{count}</span>
    </span>
  );
}
