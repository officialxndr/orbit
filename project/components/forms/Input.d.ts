import * as React from 'react';

/** Labeled single-line text field with optional leading icon. */
export interface InputProps {
  label?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  /** Lucide icon name shown inside the field. */
  icon?: string;
  type?: string;
  error?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}

export function Input(props: InputProps): JSX.Element;
