import * as React from 'react';

/** Toggle for "Track as streak", "Use global default", etc. */
export interface SwitchProps {
  checked?: boolean;
  onChange?: (next: boolean) => void;
  disabled?: boolean;
  /** On-state track color. @default var(--accent) */
  color?: string;
  style?: React.CSSProperties;
}

export function Switch(props: SwitchProps): JSX.Element;
