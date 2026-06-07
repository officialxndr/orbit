import * as React from 'react';

/** Flame glyph + day count; greys out when a streak breaks. */
export interface StreakBadgeProps {
  count?: number;
  active?: boolean;
  style?: React.CSSProperties;
}

export function StreakBadge(props: StreakBadgeProps): JSX.Element;
