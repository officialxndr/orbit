import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useOrbitFonts } from '@/theme/fonts';
import { useStore } from '@/store/useStore';
import { ToastHost } from '@/components/Toast';
import { configureNotifications, registerBackgroundSync } from '@/notifications';
import { colors } from '@/theme/theme';
import { useThemeStore } from '@/theme/useTheme';

export default function RootLayout() {
  const [fontsLoaded] = useOrbitFonts();
  const ready = useStore((s) => s.ready);
  const bootstrap = useStore((s) => s.bootstrap);
  const scheme = useThemeStore((s) => s.scheme);

  useEffect(() => {
    bootstrap();
    configureNotifications();
    registerBackgroundSync();
  }, [bootstrap]);

  if (!fontsLoaded || !ready) {
    return <View style={{ flex: 1, backgroundColor: colors.surfacePage }} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.surfacePage },
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="entity/[id]" />
          <Stack.Screen name="entity/edit/[id]" options={{ presentation: 'modal' }} />
          <Stack.Screen name="new" options={{ presentation: 'modal' }} />
          <Stack.Screen name="reminder/[rid]" options={{ presentation: 'modal' }} />
          <Stack.Screen name="settings/defaults" />
          <Stack.Screen name="settings/home-assistant" />
        </Stack>
        <ToastHost />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
