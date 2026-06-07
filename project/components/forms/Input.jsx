import React from 'react';
import { Icon } from '../core/Icon';

/**
 * Input — labeled single-line text field with optional leading icon.
 */
export function Input({ label, value, onChange, placeholder, icon, type = 'text', error, disabled = false, style = {}, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  const border = error ? 'var(--danger)' : focus ? 'var(--accent)' : 'var(--border-strong)';
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
      {label && (
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, color: 'var(--text-body)' }}>{label}</span>
      )}
      <span
        style={{
          display: 'flex', alignItems: 'center', gap: 9, height: 46, padding: '0 14px',
          background: disabled ? 'var(--fill)' : 'var(--surface-card)', borderRadius: 'var(--radius-md)',
          border: `1.5px solid ${border}`,
          boxShadow: focus ? '0 0 0 3px var(--orbit-100)' : 'none',
          transition: 'border-color var(--dur-fast), box-shadow var(--dur-fast)',
        }}
      >
        {icon && <Icon name={icon} size={18} color="var(--text-subtle)" />}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{
            flex: 1, border: 'none', outline: 'none', background: 'transparent',
            fontFamily: 'var(--font-sans)', fontSize: 15, color: 'var(--text-strong)', minWidth: 0,
          }}
          {...rest}
        />
      </span>
      {error && <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--danger)' }}>{error}</span>}
    </label>
  );
}
