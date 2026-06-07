import * as React from 'react';

/** Thin completion bar. */
export interface ProgressBarProps {
  value?: number;
  max?: number;
  color?: string;
  height?: number;
  style?: React.CSSProperties;
}

export function ProgressBar(props: ProgressBarProps): JSX.Element;
