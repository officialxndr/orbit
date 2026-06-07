import * as React from 'react';

export type EntityType = 'person' | 'task' | 'routine' | 'habit' | 'project';

export interface EntityMeta {
  label: string;
  color: string;
  soft: string;
  icon: string;
}

/** Canonical metadata for Orbit's five entity types. */
export const ENTITY_META: Record<EntityType, EntityMeta>;

/** Rounded-square, tinted glyph identifying an entity type. */
export interface EntityIconProps {
  type?: EntityType;
  size?: 'sm' | 'md' | 'lg';
  style?: React.CSSProperties;
}

export function EntityIcon(props: EntityIconProps): JSX.Element;
