import React, { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { BackBar, Button, Card, Icon, Screen, SectionLabel, SegmentedControl } from '@/components';
import { useStore } from '@/store/useStore';
import { useToast } from '@/store/useToast';
import { repository } from '@/data/sqliteRepository';
import { DEFAULT_CONFIGS } from '@/domain/reminderConfig';
import type { ReminderConfig } from '@/domain/types';
import { colors, font } from '@/theme/theme';
import { useThemeSync } from '@/theme/useTheme';

const pad = (n: number) => n.toString().padStart(2, '0');

function Stepper({ value, onDec, onInc }: { value: string; onDec: () => void; onInc: () => void }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <Pressable onPress={onDec} hitSlop={8} style={{ width: 28, height: 28, borderRadius: 999, backgroundColor: colors.fill, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontFamily: font('sans', 700), fontSize: 18, color: colors.textBody, lineHeight: 20 }}>−</Text>
      </Pressable>
      <Text style={{ minWidth: 64, textAlign: 'center', fontFamily: font('mono', 500), fontSize: 14, color: colors.textStrong }}>{value}</Text>
      <Pressable onPress={onInc} hitSlop={8} style={{ width: 28, height: 28, borderRadius: 999, backgroundColor: colors.fill, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontFamily: font('sans', 700), fontSize: 18, color: colors.textBody, lineHeight: 20 }}>+</Text>
      </Pressable>
    </View>
  );
}

function Row({ label, children, border = true }: { label: string; children: React.ReactNode; border?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 14, borderBottomWidth: border ? 1 : 0, borderBottomColor: colors.borderDefault }}>
      <Text style={{ fontFamily: font('sans', 400), fontSize: 15, color: colors.textBody }}>{label}</Text>
      {children}
    </View>
  );
}

export default function DefaultsScreen() {
  useThemeSync();
  const setDefaultConfig = useStore((s) => s.setDefaultConfig);
  const showToast = useToast((s) => s.show);

  const [loaded, setLoaded] = useState<Record<string, ReminderConfig>>({});
  const [cadence, setCadence] = useState(DEFAULT_CONFIGS.stay_in_touch.cadenceDays ?? 21);
  const [hour, setHour] = useState(9);
  const [leadMin, setLeadMin] = useState(1440);

  useEffect(() => {
    (async () => {
      const stay = await repository.getDefaultConfig('stay_in_touch');
      const recurring = await repository.getDefaultConfig('recurring');
      const date = await repository.getDefaultConfig('date');
      const milestone = await repository.getDefaultConfig('milestone');
      setLoaded({ stay, recurring, date, milestone });
      setCadence(stay.cadenceDays ?? 21);
      setHour(parseInt((recurring.timeOfDay ?? '09:00').split(':')[0], 10));
      setLeadMin((date.leadTimes ?? [0, 1440]).filter((m) => m > 0)[0] ?? 1440);
    })();
  }, []);

  const onSave = async () => {
    const time = `${pad(hour)}:00`;
    const leadTimes = leadMin > 0 ? [0, leadMin] : [0];
    await setDefaultConfig('stay_in_touch', { ...(loaded.stay ?? DEFAULT_CONFIGS.stay_in_touch), cadenceDays: cadence, timeOfDay: time });
    await setDefaultConfig('recurring', { ...(loaded.recurring ?? DEFAULT_CONFIGS.recurring), timeOfDay: time });
    await setDefaultConfig('date', { ...(loaded.date ?? DEFAULT_CONFIGS.date), timeOfDay: time, leadTimes });
    await setDefaultConfig('milestone', { ...(loaded.milestone ?? DEFAULT_CONFIGS.milestone), timeOfDay: time, leadTimes });
    showToast('Defaults updated');
  };

  return (
    <Screen contentPaddingBottom={48}>
      <BackBar title="Default reminders" />
      <Card style={{ marginBottom: 4, flexDirection: 'row', gap: 12, alignItems: 'center' }}>
        <Icon name="bell-ring" size={20} color={colors.accent} />
        <Text style={{ flex: 1, fontFamily: font('sans', 400), fontSize: 13.5, color: colors.textMuted }}>
          Items set to “Use global default” follow these. Custom items are left untouched.
        </Text>
      </Card>

      <SectionLabel>Defaults</SectionLabel>
      <View style={{ backgroundColor: colors.surfaceCard, borderWidth: 1, borderColor: colors.borderDefault, borderRadius: 18, overflow: 'hidden' }}>
        <Row label="Stay-in-touch cadence">
          <Stepper value={`${cadence} days`} onDec={() => setCadence((c) => Math.max(1, c - 1))} onInc={() => setCadence((c) => c + 1)} />
        </Row>
        <Row label="Time of day">
          <Stepper value={`${pad(hour)}:00`} onDec={() => setHour((h) => (h + 23) % 24)} onInc={() => setHour((h) => (h + 1) % 24)} />
        </Row>
        <Row label="Lead time" border={false}>
          <View style={{ width: 180 }}>
            <SegmentedControl
              value={String(leadMin)}
              onChange={(v) => setLeadMin(parseInt(v, 10))}
              options={[
                { value: '0', label: 'At time' },
                { value: '1440', label: '1 day' },
                { value: '10080', label: '1 week' },
              ]}
            />
          </View>
        </Row>
      </View>

      <View style={{ marginTop: 20 }}>
        <Button fullWidth size="lg" iconLeft="check" onPress={onSave}>
          Save defaults
        </Button>
      </View>
    </Screen>
  );
}
