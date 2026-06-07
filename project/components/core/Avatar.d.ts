import * as React from 'react';

/** Initials disc; color derived from the name. */
export interface AvatarProps {
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** Override the derived color. */
  color?: string;
  style?: React.CSSProperties;
}

export function Avatar(props: AvatarProps): JSX.Element;
