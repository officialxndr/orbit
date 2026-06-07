import * as React from 'react';

/** Circular completion toggle; springs in a check when done. */
export interface CheckCircleProps {
  checked?: boolean;
  onChange?: (next: boolean) => void;
  /** Fill color; default brand. Usually the entity-type accent. */
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  style?: React.CSSProperties;
}

export function CheckCircle(props: CheckCircleProps): JSX.Element;
