import * as React from 'react';

/** Pill with a leading dot. Pass `type` to auto-color by entity. */
export interface TagProps {
  type?: 'person' | 'task' | 'routine' | 'habit' | 'project';
  /** Override dot color (when not using `type`). */
  color?: string;
  children?: React.ReactNode;
  dot?: boolean;
  style?: React.CSSProperties;
}

export function Tag(props: TagProps): JSX.Element;
