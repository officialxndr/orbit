import * as React from 'react';

/** Rounded search field used atop lists. */
export interface SearchBarProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  onClear?: () => void;
  style?: React.CSSProperties;
}

export function SearchBar(props: SearchBarProps): JSX.Element;
