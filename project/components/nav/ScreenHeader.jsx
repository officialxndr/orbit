import React from 'react';

/**
 * ScreenHeader — large screen title with optional eyebrow, subtitle and a
 * trailing action node (e.g. an IconButton).
 */
export function ScreenHeader({ eyebrow, title, subtitle, trailing, style = {} }) {
  return (
    <header style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, padding: '8px 0 14px', ...style }}>
      <div style={{ minWidth: 0 }}>
        {eyebrow && (
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase', color: 'var(--text-subtle)', marginBottom: 4 }}>
            {eyebrow}
          </div>
        )}
        <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, letterSpacing: 'var(--tracking-tight)', color: 'var(--text-strong)', lineHeight: 1.05 }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ margin: '6px 0 0', fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-muted)' }}>{subtitle}</p>
        )}
      </div>
      {trailing}
    </header>
  );
}
