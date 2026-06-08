import React, { useCallback, useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { BottomSheet, Icon, type IconName, Screen, ScreenHeader } from '@/components';
import { repository } from '@/data/sqliteRepository';
import { DEFAULT_CONFIGS } from '@/domain/reminderConfig';
import { useStore } from '@/store/useStore';
import { useToast } from '@/store/useToast';
import { colors, font, radius, shadow, tracking } from '@/theme/theme';
import { useThemeStore, useThemeSync, type ThemeMode } from '@/theme/useTheme';

const APPEARANCE_OPTIONS: { value: ThemeMode; label: string; detail: string; icon: IconName }[] = [
  { value: 'system', label: 'System', detail: 'Match your device', icon: 'smartphone' },
  { value: 'light', label: 'Light', detail: 'Always light', icon: 'sun' },
  { value: 'dark', label: 'Dark', detail: 'Always dark', icon: 'moon' },
];

function SettingsRow({
  icon,
  color,
  title,
  detail,
  last,
  onPress,
  destructive,
}: {
  icon: IconName;
  color: string;
  title: string;
  detail?: string;
  last?: boolean;
  onPress?: () => void;
  destructive?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 13,
        paddingHorizontal: 14,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: colors.borderDefault,
      }}
    >
      <View style={{ width: 30, height: 30, borderRadius: 8, backgroundColor: color, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={icon} size={17} color={colors.white} />
      </View>
      <Text style={{ flex: 1, fontFamily: font('sans', 400), fontSize: 15.5, color: destructive ? colors.danger : colors.textStrong }}>{title}</Text>
      {detail ? <Text style={{ fontFamily: font('mono', 400), fontSize: 14, color: colors.textMuted }}>{detail}</Text> : null}
      {destructive ? null : <Icon name="chevron-right" size={17} color={colors.textSubtle} />}
    </Pressable>
  );
}

function SettingsGroup({ header, children }: { header: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: 18 }}>
      <Text style={{ fontFamily: font('mono', 600), fontSize: 11, letterSpacing: tracking.wider, textTransform: 'uppercase', color: colors.textSubtle, marginHorizontal: 2, marginBottom: 8 }}>
        {header}
      </Text>
      <View style={[{ backgroundColor: colors.surfaceCard, borderWidth: 1, borderColor: colors.borderDefault, borderRadius: radius.lg, overflow: 'hidden' }, shadow.sm]}>
        {children}
      </View>
    </View>
  );
}

export default function SettingsScreen() {
  useThemeSync();
  const router = useRouter();
  const itemCount = useStore((s) => s.entities.length);
  const clearAllData = useStore((s) => s.clearAllData);
  const showToast = useToast((s) => s.show);
  const themeMode = useThemeStore((s) => s.mode);
  const setThemeMode = useThemeStore((s) => s.setMode);
  const [appearanceOpen, setAppearanceOpen] = useState(false);
  const appearanceLabel = APPEARANCE_OPTIONS.find((o) => o.value === themeMode)?.label ?? 'System';
  const [cadence, setCadence] = useState(DEFAULT_CONFIGS.stay_in_touch.cadenceDays ?? 21);
  const [time, setTime] = useState(DEFAULT_CONFIGS.recurring.timeOfDay ?? '09:00');
  const [leadDays, setLeadDays] = useState(1);
  const [haConnected, setHaConnected] = useState(false);

  const onClearData = useCallback(() => {
    if (itemCount === 0) {
      showToast('Nothing to clear');
      return;
    }
    Alert.alert(
      'Clear all data?',
      `This permanently deletes all ${itemCount} item${itemCount === 1 ? '' : 's'} and their reminders, streaks, and contact history. This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete everything',
          style: 'destructive',
          onPress: async () => {
            await clearAllData();
            showToast('All data cleared');
          },
        },
      ],
    );
  }, [itemCount, clearAllData, showToast]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        const sit = await repository.getDefaultConfig('stay_in_touch');
        const rec = await repository.getDefaultConfig('recurring');
        const date = await repository.getDefaultConfig('date');
        const baseUrl = await repository.getSetting('ha.baseUrl');
        if (!active) return;
        setCadence(sit.cadenceDays ?? 21);
        setTime(rec.timeOfDay ?? '09:00');
        const lead = (date.leadTimes ?? [0, 1440]).filter((m) => m > 0)[0];
        setLeadDays(lead ? Math.round(lead / 1440) : 1);
        setHaConnected(Boolean(baseUrl));
      })();
      return () => {
        active = false;
      };
    }, []),
  );

  return (
    <Screen>
      <ScreenHeader title="Settings" />

      <SettingsGroup header="Default reminders">
        <SettingsRow icon="users" color={colors.person} title="Stay-in-touch cadence" detail={`${cadence} days`} onPress={() => router.push('/settings/defaults')} />
        <SettingsRow icon="clock" color={colors.task} title="Default time of day" detail={time} onPress={() => router.push('/settings/defaults')} />
        <SettingsRow icon="bell-ring" color={colors.routine} title="Lead time" detail={`${leadDays} day${leadDays === 1 ? '' : 's'}`} last onPress={() => router.push('/settings/defaults')} />
      </SettingsGroup>

      <SettingsGroup header="Integrations">
        <SettingsRow icon="house" color={colors.habit} title="Home Assistant" detail={haConnected ? 'Connected' : 'Not connected'} last onPress={() => router.push('/settings/home-assistant')} />
      </SettingsGroup>

      <SettingsGroup header="App">
        <SettingsRow icon="palette" color={colors.project} title="Appearance" detail={appearanceLabel} onPress={() => setAppearanceOpen(true)} />
        <SettingsRow icon="database" color={colors.info} title="Local data" detail="On device" />
        <SettingsRow icon="info" color={colors.ink500} title="About Orbit" last />
      </SettingsGroup>

      <SettingsGroup header="Data">
        <SettingsRow
          icon="trash-2"
          color={colors.danger}
          title="Clear all data"
          detail={`${itemCount} item${itemCount === 1 ? '' : 's'}`}
          destructive
          last
          onPress={onClearData}
        />
      </SettingsGroup>

      <Text style={{ textAlign: 'center', fontFamily: font('sans', 400), fontSize: 12.5, color: colors.textSubtle, marginTop: 8 }}>
        Local-first · no account · everything stays on this device
      </Text>

      <BottomSheet visible={appearanceOpen} onClose={() => setAppearanceOpen(false)}>
        <Text style={{ fontFamily: font('display', 800), fontSize: 19, letterSpacing: tracking.tight, color: colors.textStrong, marginBottom: 14 }}>Appearance</Text>
        <View style={{ gap: 8 }}>
          {APPEARANCE_OPTIONS.map((o) => {
            const selected = o.value === themeMode;
            return (
              <Pressable
                key={o.value}
                onPress={() => { setThemeMode(o.value); setAppearanceOpen(false); }}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 13, paddingHorizontal: 14, borderRadius: radius.md, backgroundColor: selected ? colors.accentTint : colors.surfaceCard, borderWidth: 1, borderColor: selected ? colors.accent : colors.borderDefault }}
              >
                <Icon name={o.icon} size={20} color={selected ? colors.accent : colors.textBody} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: font('sans', 700), fontSize: 15.5, color: colors.textStrong }}>{o.label}</Text>
                  <Text style={{ fontFamily: font('sans', 400), fontSize: 12.5, color: colors.textMuted, marginTop: 1 }}>{o.detail}</Text>
                </View>
                {selected ? <Icon name="check" size={20} color={colors.accent} /> : null}
              </Pressable>
            );
          })}
        </View>
      </BottomSheet>
    </Screen>
  );
}
