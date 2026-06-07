import React from 'react';

/**
 * Heatmap — consistency grid using the streak heat ramp. `data` is an array of
 * intensities 0–4. Wraps into `columns` columns.
 */
export function Heatmap({ data = [], columns = 7, cell = 15, gap = 4, style = {} }) {
  return (
    <div
      style={{
        display: 'grid', gridTemplateColumns: `repeat(${columns}, ${cell}px)`, gap, ...style,
      }}
    >
      {data.map((v, i) => (
        <span
          key={i}
          title={`${v}`}
          style={{ width: cell, height: cell, borderRadius: 4, background: `var(--heat-${Math.max(0, Math.min(4, v))})` }}
        />
      ))}
    </div>
  );
}
