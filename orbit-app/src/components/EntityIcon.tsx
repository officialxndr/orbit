import React from 'react';
import { View, type ViewStyle } from 'react-native';
import { Icon } from './Icon';
import { ENTITY_META } from '@/domain/entityMeta';
import type { EntityType } from '@/domain/types';
import { radius } from '@/theme/theme';

const dims = { sm: 30, md: 38, lg: 46 } as const;
const iconSizes = { sm: 16, md: 20, lg: 24 } as const;

export interface EntityIconProps {
  type?: EntityType;
  size?: keyof typeof dims;
  style?: ViewStyle;
}

/** Rounded-square, tinted glyph identifying an entity type. */
export function EntityIcon({ type = 'task', size = 'md', style }: EntityIconProps) {
  const meta = ENTITY_META[type] ?? ENTITY_META.task;
  const d = dims[size];
  return (
    <View
      style={[
        {
          width: d,
          height: d,
          borderRadius: radius.sm,
          backgroundColor: meta.soft,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      <Icon name={meta.icon} size={iconSizes[size]} color={meta.color} strokeWidth={2.1} />
    </View>
  );
}

export default EntityIcon;
