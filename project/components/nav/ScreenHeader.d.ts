import * as React from 'react';

/** Large screen title with optional eyebrow, subtitle and trailing action. */
export interface ScreenHeaderProps {
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  trailing?: React.ReactNode;
  style?: React.CSSProperties;
}

export function ScreenHeader(props: ScreenHeaderProps): JSX.Element;
