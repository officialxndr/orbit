import React from 'react';
import { View, type ViewStyle } from 'react-native';
import { colors, radius, shadow, space } from '@/theme/theme';

export interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

/** Standard surface card: white, hairline border, soft shadow, lg radius. */
export function Card({ children, style }: CardProps) {
  return (
    <View
      style={[
        { backgroundColor: colors.surfaceCard, borderWidth: 1, borderColor: colors.borderDefault, borderRadius: radius.lg, padding: space[4] },
        shadow.sm,
        style,
      ]}
    >
      {children}
    </View>
  );
}

export default Card;
