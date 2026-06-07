import * as React from 'react';

/** Icon-only control for toolbars, headers and rows. */
export interface IconButtonProps {
  /** Lucide icon name. */
  icon: string;
  variant?: 'solid' | 'soft' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  round?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}

export function IconButton(props: IconButtonProps): JSX.Element;
