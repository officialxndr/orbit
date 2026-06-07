import React from 'react';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { IconButton } from './IconButton';
import { colors, font, tracking } from '@/theme/theme';

export interface BackBarProps {
  title: string;
  onMore?: () => void;
}

/** Centered title bar with a back chevron and optional overflow action. */
export function BackBar({ title, onMore }: BackBarProps) {
  const router = useRouter();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: 4, paddingBottom: 10 }}>
      <IconButton icon="chevron-left" variant="soft" accessibilityLabel="Back" onPress={() => router.back()} />
      <Text style={{ flex: 1, textAlign: 'center', fontFamily: font('sans', 700), fontSize: 17, color: colors.textStrong, letterSpacing: tracking.snug }}>
        {title}
      </Text>
      <IconButton icon="ellipsis" variant="soft" accessibilityLabel="More" onPress={onMore} />
    </View>
  );
}

export default BackBar;
