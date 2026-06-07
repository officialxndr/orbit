import * as React from 'react';

export interface SegmentOption {
  value: string;
  label: string;
}

/** iOS-style segmented filter. Options are strings or { value, label }. */
export interface SegmentedControlProps {
  options: Array<string | SegmentOption>;
  value?: string;
  onChange?: (value: string) => void;
  style?: React.CSSProperties;
}

export function SegmentedControl(props: SegmentedControlProps): JSX.Element;
