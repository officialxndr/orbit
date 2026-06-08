import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, SegmentedControl, Switch } from '@/components';
import { useStore } from '@/store/useStore';
import { useToast } from '@/store/useToast';
import { DEFAULT_CONFIGS, resolveConfig } from '@/domain/reminderConfig';
import type { ReminderConfig } from '@/domain/types';
import { colors, font, radius, tracking } from '@/theme/theme';
import { useThemeSync } from '@/theme/useTheme';

const pad = (n: number) => n.toString().padStart(2, '0');

function Stepper({ value, onDec, onInc, disabled }: { value: string; onDec: () => void; onInc: () => void; disabled?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, opacity: disabled ? 0.45 : 1 }}>
      <Pressable disabled={disabled} onPress={onDec} hitSlop={8} style={{ width: 28, height: 28, borderRadius: 999, backgroundColor: colors.fill, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontFamily: font('sans', 700), fontSize: 18, color: colors.textBody, lineHeight: 20 }}>−</Text>
      </Pressable>
      <Text style={{ minWidth: 64, textAlign: 'center', fontFamily: font('mono', 500), fontSize: 14, color: colors.textStrong }}>{value}</Text>
      <Pressable disabled={disabled} onPress={onInc} hitSlop={8} style={{ width: 28, height: 28, borderRadius: 999, backgroundColor: colors.fill, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontFamily: font('sans', 700), fontSize: 18, color: colors.textBody, lineHeight: 20 }}>+</Text>
      </Pressable>
    </View>
  );
}

function FieldRow({ label, disabled, children, border = true }: { label: string; disabled?: boolean; children: React.ReactNode; border?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 13, borderBottomWidth: border ? 1 : 0, borderBottomColor: colors.borderDefault, opacity: disabled ? 0.45 : 1 }}>
      <Text style={{ fontFamily: font('sans', 400), fontSize: 15, color: colors.textBody }}>{label}</Text>
      {children}
    </View>
  );
}

export default function ReminderConfigScreen() {
  useThemeSync();
  const { rid } = useLocalSearchParams<{ rid: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const showToast = useToast((s) => s.show);

  const reminder = useStore((s) => s.reminders.find((r) => r.id === rid));
  const entity = useStore((s) => (reminder ? s.entities.find((e) => e.id === reminder.entityId) : undefined));
  const updateReminder = useStore((s) => s.updateReminder);

  const resolved = useMemo(
    () => (reminder ? resolveConfig(reminder.config, reminder.usesDefault, DEFAULT_CONFIGS[reminder.kind]) : null),
    [reminder],
  );

  const [useDefault, setUseDefault] = useState(reminder?.usesDefault ?? true);
  const [cadence, setCadence] = useState(resolved?.cadenceDays ?? 21);
  const [leadMin, setLeadMin] = useState((resolved?.leadTimes ?? [0, 1440]).filter((m) => m > 0)[0] ?? 1440);
  const [hour, setHour] = useState(parseInt((resolved?.timeOfDay ?? '09:00').split(':')[0], 10));
  const [freq, setFreq] = useState((resolved?.rrule ?? 'FREQ=DAILY').match(/FREQ=(\w+)/)?.[1] ?? 'DAILY');
  const [repeatUntilDone, setRepeatUntilDone] = useState(resolved?.repeatUntilDone ?? false);

  if (!reminder || !entity || !resolved) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.surfacePage, padding: 20 }}>
        <Text style={{ fontFamily: font('sans', 400), color: colors.textMuted, marginTop: 40, textAlign: 'center' }}>Reminder not found.</Text>
      </View>
    );
  }

  const kind = reminder.kind;
  const isContact = kind === 'stay_in_touch';
  const isDate = kind === 'date' || kind === 'milestone';
  const isRecurring = kind === 'recurring';

  // Any manual edit implies a custom config.
  const customize = () => setUseDefault(false);

  const onSave = async () => {
    if (useDefault) {
      await updateReminder(reminder.id, { usesDefault: true, config: {} });
    } else {
      const config: ReminderConfig = {
        timeOfDay: `${pad(hour)}:00`,
        quietHours: resolved.quietHours ?? null,
        repeatUntilDone,
      };
      if (isContact) config.cadenceDays = cadence;
      if (isDate) config.leadTimes = leadMin > 0 ? [0, leadMin] : [0];
      if (isRecurring) config.rrule = `FREQ=${freq}`;
      await updateReminder(reminder.id, { usesDefault: false, config });
    }
    showToast('Reminder saved');
    router.back();
  };

  const title = isContact ? 'Stay-in-touch reminder' : isRecurring ? 'Recurring reminder' : 'Date reminder';

  return (
    <View style={{ flex: 1, backgroundColor: colors.surfacePage }}>
      <View style={{ width: 38, height: 5, borderRadius: 999, backgroundColor: colors.lineStrong, alignSelf: 'center', marginTop: 10, marginBottom: 8 }} />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 24 }} keyboardShouldPersistTaps="handled">
        <Text style={{ fontFamily: font('display', 800), fontSize: 20, letterSpacing: tracking.tight, color: colors.textStrong }}>{title}</Text>
        <Text style={{ fontFamily: font('sans', 400), fontSize: 13.5, color: colors.textMuted, marginTop: 2, marginBottom: 16 }}>
          Per-item settings · overrides the global default
        </Text>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.accentTint, borderRadius: radius.md, paddingVertical: 13, paddingHorizontal: 14, marginBottom: 8 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: font('sans', 700), fontSize: 14.5, color: colors.orbit700 }}>Use global default</Text>
            <Text style={{ fontFamily: font('sans', 400), fontSize: 12.5, color: colors.orbit700, opacity: 0.8, marginTop: 2 }}>Inherit changes you make in Settings</Text>
          </View>
          <Switch checked={useDefault} onChange={setUseDefault} />
        </View>

        <View style={{ paddingHorizontal: 2, marginBottom: 18 }}>
          {isContact && (
            <FieldRow label="Nudge me every" disabled={useDefault}>
              <Stepper
                disabled={useDefault}
                value={`${cadence} days`}
                onDec={() => { setCadence((c) => Math.max(1, c - 1)); customize(); }}
                onInc={() => { setCadence((c) => c + 1); customize(); }}
              />
            </FieldRow>
          )}

          {isDate && (
            <FieldRow label="Notify before" disabled={useDefault}>
              <View style={{ width: 190 }}>
                <SegmentedControl
                  value={String(leadMin)}
                  onChange={(v) => { setLeadMin(parseInt(v, 10)); customize(); }}
                  options={[
                    { value: '0', label: 'At time' },
                    { value: '1440', label: '1 day' },
                    { value: '10080', label: '1 week' },
                  ]}
                />
              </View>
            </FieldRow>
          )}

          {isRecurring && (
            <FieldRow label="Repeat" disabled={useDefault}>
              <View style={{ width: 190 }}>
                <SegmentedControl
                  value={freq}
                  onChange={(v) => { setFreq(v); customize(); }}
                  options={[
                    { value: 'DAILY', label: 'Daily' },
                    { value: 'WEEKLY', label: 'Weekly' },
                    { value: 'MONTHLY', label: 'Monthly' },
                  ]}
                />
              </View>
            </FieldRow>
          )}

          <FieldRow label="Time of day" disabled={useDefault}>
            <Stepper
              disabled={useDefault}
              value={`${pad(hour)}:00`}
              onDec={() => { setHour((h) => (h + 23) % 24); customize(); }}
              onInc={() => { setHour((h) => (h + 1) % 24); customize(); }}
            />
          </FieldRow>

          <FieldRow label="Quiet hours" disabled={useDefault}>
            <Text style={{ fontFamily: font('mono', 500), fontSize: 14, color: colors.textStrong }}>
              {resolved.quietHours ? `${resolved.quietHours.start}–${resolved.quietHours.end}` : 'Off'}
            </Text>
          </FieldRow>

          <FieldRow label="Repeat until done" disabled={useDefault} border={false}>
            <Switch checked={repeatUntilDone} disabled={useDefault} onChange={(v) => { setRepeatUntilDone(v); customize(); }} />
          </FieldRow>
        </View>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Button variant="secondary" fullWidth onPress={() => router.back()}>Cancel</Button>
          <Button fullWidth onPress={onSave}>Save</Button>
        </View>
      </ScrollView>
    </View>
  );
}
