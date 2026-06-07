import React from 'react';
import { Text, View, type ViewStyle } from 'react-native';
import { colors, font } from '@/theme/theme';

const palette = [colors.person, colors.task, colors.routine, colors.habit, colors.project, colors.orbit600];
const softs = [colors.personSoft, colors.taskSoft, colors.routineSoft, colors.habitSoft, colors.projectSoft, colors.orbit100];
const dims = { xs: 26, sm: 32, md: 40, lg: 56 } as const;

function hash(str = ''): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

function initials(name = ''): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
}

export interface AvatarProps {
  name?: string;
  size?: keyof typeof dims | number;
  color?: string;
  style?: ViewStyle;
}

/** Initials disc; color derived from the name (for People). */
export function Avatar({ name = '', size = 'md', color, style }: AvatarProps) {
  const d = typeof size === 'number' ? size : dims[size];
  const idx = hash(name) % palette.length;
  const fg = color ?? palette[idx];
  const bg = softs[idx];
  return (
    <View
      style={[
        { width: d, height: d, borderRadius: 999, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' },
        style,
      ]}
    >
      <Text style={{ color: fg, fontFamily: font('sans', 700), fontSize: d * 0.36, letterSpacing: 0.2 }}>{initials(name)}</Text>
    </View>
  );
}

export default Avatar;
