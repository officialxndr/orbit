import React from 'react';

/**
 * Switch — toggle used for "Track as streak", "Use global default", etc.
 */
export function Switch({ checked = false, onChange, disabled = false, color = 'var(--accent)', style = {} }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange && onChange(!checked)}
      style={{
        position: 'relative', width: 46, height: 28, flex: 'none', borderRadius: 999, border: 'none',
        background: checked ? color : 'var(--line-strong)', cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1, padding: 0,
        transition: 'background var(--dur-base) var(--ease-out)', WebkitTapHighlightColor: 'transparent', ...style,
      }}
    >
      <span
        style={{
          position: 'absolute', top: 3, left: 3, width: 22, height: 22, borderRadius: 999,
          background: '#fff', boxShadow: 'var(--shadow-sm)',
          transform: checked ? 'translateX(18px)' : 'translateX(0)',
          transition: 'transform var(--dur-base) var(--ease-spring)',
        }}
      />
    </button>
  );
}
