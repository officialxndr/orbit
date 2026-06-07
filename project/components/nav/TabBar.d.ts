import * as React from 'react';

export interface TabItem {
  key: string;
  label: string;
  /** Lucide icon name. */
  icon: string;
}

/** Bottom navigation bar. */
export interface TabBarProps {
  tabs: TabItem[];
  active?: string;
  onChange?: (key: string) => void;
  style?: React.CSSProperties;
}

export function TabBar(props: TabBarProps): JSX.Element;
