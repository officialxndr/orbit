import React from 'react';
import { Icon } from '../core/Icon';

/**
 * TabBar — bottom navigation. `tabs` is an array of { key, label, icon }.
 */
export function TabBar({ tabs = [], active, onChange, style = {} }) {
  return (
    <nav
      style={{
        display: 'flex', alignItems: 'stretch', height: 'var(--tabbar-h)',
        background: 'color-mix(in srgb, var(--surface-card) 88%, transparent)',
        backdropFilter: 'saturate(1.4) blur(12px)', WebkitBackdropFilter: 'saturate(1.4) blur(12px)',
        borderTop: '1px solid var(--border-default)', ...style,
      }}
    >
      {tabs.map((t) => {
        const on = t.key === active;
        return (
          <button
            key={t.key}
            type="button"
            onClick={() => onChange && onChange(t.key)}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3,
              border: 'none', background: 'transparent', cursor: 'pointer', padding: '6px 0',
              color: on ? 'var(--accent)' : 'var(--text-subtle)', WebkitTapHighlightColor: 'transparent',
              transition: 'color var(--dur-fast)',
            }}
          >
            <Icon name={t.icon} size={23} strokeWidth={on ? 2.4 : 2} />
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: on ? 700 : 500, letterSpacing: '0.01em' }}>{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
