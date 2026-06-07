import React from 'react';

const palette = ['var(--person)', 'var(--task)', 'var(--routine)', 'var(--habit)', 'var(--project)', 'var(--orbit-600)'];
const softs   = ['var(--person-soft)', 'var(--task-soft)', 'var(--routine-soft)', 'var(--habit-soft)', 'var(--project-soft)', 'var(--orbit-100)'];
const dims = { xs: 26, sm: 32, md: 40, lg: 56 };

function hash(str = '') {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}
function initials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
}

/**
 * Avatar — initials disc, color derived from the name (for People).
 */
export function Avatar({ name = '', size = 'md', color, style = {} }) {
  const d = dims[size] || dims.md;
  const idx = hash(name) % palette.length;
  const fg = color || palette[idx];
  const bg = softs[idx];
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none',
        width: d, height: d, borderRadius: '999px', background: bg, color: fg,
        fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: d * 0.36,
        letterSpacing: '0.01em', ...style,
      }}
    >
      {initials(name)}
    </span>
  );
}
