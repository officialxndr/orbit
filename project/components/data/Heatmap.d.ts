import * as React from 'react';

/** Consistency grid using the streak heat ramp. `data` holds intensities 0–4. */
export interface HeatmapProps {
  data?: number[];
  columns?: number;
  cell?: number;
  gap?: number;
  style?: React.CSSProperties;
}

export function Heatmap(props: HeatmapProps): JSX.Element;
