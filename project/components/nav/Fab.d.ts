import * as React from 'react';

/** Floating action button with the brand glow. */
export interface FabProps {
  /** Lucide icon name. @default "plus" */
  icon?: string;
  /** Optional label (renders an extended FAB). */
  label?: string;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}

export function Fab(props: FabProps): JSX.Element;
