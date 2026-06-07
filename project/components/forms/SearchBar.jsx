import React from 'react';
import { Icon } from '../core/Icon';

/**
 * SearchBar — rounded search field used atop lists (Today, Items, link-picker).
 */
export function SearchBar({ value = '', onChange, placeholder = 'Search', onClear, style = {} }) {
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 9, height: 42, padding: '0 12px',
        background: 'var(--surface-sunk)', borderRadius: 'var(--radius-md)', ...style,
      }}
    >
      <Icon name="search" size={18} color="var(--text-subtle)" />
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          flex: 1, border: 'none', outline: 'none', background: 'transparent',
          fontFamily: 'var(--font-sans)', fontSize: 15, color: 'var(--text-strong)', minWidth: 0,
        }}
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear"
          style={{ display: 'inline-flex', border: 'none', background: 'var(--ink-300)', color: '#fff', borderRadius: 999, width: 18, height: 18, alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}
        >
          <Icon name="x" size={12} strokeWidth={2.6} />
        </button>
      )}
    </div>
  );
}
