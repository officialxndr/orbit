import React from 'react';

/**
 * ProgressBar — thin completion bar (e.g. today's reminders done).
 */
export function ProgressBar({ value = 0, max = 100, color = 'var(--accent)', height = 8, style = {} }) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;
  return (
    <div
      style={{
        width: '100%', height, borderRadius: 999, overflow: 'hidden',
        background: 'var(--surface-sunk)', ...style,
      }}
    >
      <div
        style={{
          width: `${pct}%`, height: '100%', borderRadius: 999, background: color,
          transition: 'width var(--dur-slow) var(--ease-out)',
        }}
      />
    </div>
  );
}
