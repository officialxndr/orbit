import * as React from 'react';

/** Base surface container. `accent` adds the entity-type left border. */
export interface CardProps {
  children?: React.ReactNode;
  /** Color for the left accent border (e.g. var(--person)). */
  accent?: string;
  padding?: number;
  interactive?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}

export function Card(props: CardProps): JSX.Element;
