import * as React from 'react';

/** Compact status / count label. */
export interface BadgeProps {
  children?: React.ReactNode;
  tone?: 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
  /** Solid fill instead of soft tint. */
  solid?: boolean;
  style?: React.CSSProperties;
}

export function Badge(props: BadgeProps): JSX.Element;
