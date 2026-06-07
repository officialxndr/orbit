import React from 'react';

const tones = {
  neutral: { bg: 'var(--fill)', fg: 'var(--text-muted)' },
  brand:   { bg: 'var(--orbit-100)', fg: 'var(--orbit-700)' },
  success: { bg: 'var(--success-soft)', fg: 'var(--success)' },
  warning: { bg: 'var(--warning-soft)', fg: 'var(--warning)' },
  danger:  { bg: 'var(--danger-soft)', fg: 'var(--danger)' },
  info:    { bg: 'var(--info-soft)', fg: 'var(--info)' },
};

/**
 * Badge — compact status / count label.
 */
export function Badge({ children, tone = 'neutral', solid = false, style = {} }) {
  const t = tones[tone] || tones.neutral;
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        height: 20, padding: '0 8px', borderRadius: 'var(--radius-xs)',
        fontFamily: 'var(--font-sans)', fontSize: 11.5, fontWeight: 700,
        letterSpacing: '0.01em', lineHeight: 1, whiteSpace: 'nowrap',
        background: solid ? t.fg : t.bg, color: solid ? '#fff' : t.fg, ...style,
      }}
    >
      {children}
    </span>
  );
}
