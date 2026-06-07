import * as React from 'react';
import { EntityType } from './EntityIcon';

/**
 * The signature Orbit list row: entity-typed icon + accent border, title,
 * subtitle, and a trailing completion check (or custom trailing node).
 * @startingPoint section="Core" subtitle="Signature reminder list row" viewport="700x110"
 */
export interface EntityRowProps {
  type?: EntityType;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  checked?: boolean;
  onToggle?: (next: boolean) => void;
  /** Show the trailing completion check. @default true */
  showCheck?: boolean;
  /** Custom trailing node; replaces the check when present. */
  trailing?: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}

export function EntityRow(props: EntityRowProps): JSX.Element;
