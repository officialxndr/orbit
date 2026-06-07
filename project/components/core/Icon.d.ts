import * as React from 'react';

/** Renders a Lucide glyph. Requires the Lucide UMD script on the page. */
export interface IconProps {
  /** Lucide icon name (kebab or PascalCase), e.g. "user-round". */
  name: string;
  size?: number;
  strokeWidth?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function Icon(props: IconProps): JSX.Element;
