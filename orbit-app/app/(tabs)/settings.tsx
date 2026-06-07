import React, { useCallback, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Icon, type IconName, Screen, ScreenHeader } from '@/components';
import { repository } from '@/data/sqliteRepository';
import { DEFAULT_CONFIGS } from '@/domain/reminderConfig';
import { colors, font, radius, shadow, tracking } from '@/theme/theme';

function SettingsRow({
  icon,
  color,
  title,
  detail,
  last,
  onPress,
}: {
  icon: IconName;
  color: string;
  title: string;
  detail?: string;
  last?: boolean;
  onPress?: () => void;
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
      <Text style={{ flex: 1, fontFamily: font('sans', 400), fontSize: 15.5, color: colors.textStrong }}>{title}</Text>
      {detail ? <Text style={{ fontFamily: font('mono', 400), fontSize: 14, color: colors.textMuted }}>{detail}</Text> : null}
      <Icon name="chevron-right" size={17} color={colors.textSubtle} />
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
  const router = useRouter();
  const [cadence, setCadence] = useState(DEFAULT_CONFIGS.stay_in_touch.cadenceDays ?? 21);
  const [time, setTime] = useState(DEFAULT_CONFIGS.recurring.timeOfDay ?? '09:00');
  const [leadDays, setLeadDays] = useState(1);
  const [haConnected, setHaConnected] = useState(false);

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
        <SettingsRow icon="palette" color={colors.project} title="Appearance" detail="Light" />
        <SettingsRow icon="database" color={colors.info} title="Local data" detail="On device" />
        <SettingsRow icon="info" color={colors.ink500} title="About Orbit" last />
      </SettingsGroup>

      <Text style={{ textAlign: 'center', fontFamily: font('sans', 400), fontSize: 12.5, color: colors.textSubtle, marginTop: 8 }}>
        Local-first · no account · everything stays on this device
      </Text>
    </Screen>
  );
}
