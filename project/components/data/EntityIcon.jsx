import React from 'react';
import { Icon } from '../core/Icon';

/** Canonical metadata for Orbit's five linkable entity types. */
export const ENTITY_META = {
  person:  { label: 'Person',  color: 'var(--person)',  soft: 'var(--person-soft)',  icon: 'user-round' },
  task:    { label: 'Task',    color: 'var(--task)',    soft: 'var(--task-soft)',    icon: 'circle-check' },
  routine: { label: 'Routine', color: 'var(--routine)', soft: 'var(--routine-soft)', icon: 'repeat' },
  habit:   { label: 'Habit',   color: 'var(--habit)',   soft: 'var(--habit-soft)',   icon: 'flame' },
  project: { label: 'Project', color: 'var(--project)', soft: 'var(--project-soft)', icon: 'folder' },
};

const dims = { sm: 30, md: 38, lg: 46 };
const icons = { sm: 16, md: 20, lg: 24 };

/**
 * EntityIcon — rounded-square, tinted glyph identifying an entity type.
 */
export function EntityIcon({ type = 'task', size = 'md', style = {} }) {
  const meta = ENTITY_META[type] || ENTITY_META.task;
  const d = dims[size] || dims.md;
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none',
        width: d, height: d, borderRadius: 'var(--radius-sm)',
        background: meta.soft, color: meta.color, ...style,
      }}
    >
      <Icon name={meta.icon} size={icons[size] || 20} strokeWidth={2.1} />
    </span>
  );
}
