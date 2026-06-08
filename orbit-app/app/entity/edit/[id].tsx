import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Button,
  EntityFields,
  EntityIcon,
  IconButton,
  Input,
  buildEntityData,
  buildReminderConfig,
  initialFormState,
  primaryReminderKind,
  type EntityFormState,
} from '@/components';
import { useStore } from '@/store/useStore';
import { useToast } from '@/store/useToast';
import { ENTITY_META } from '@/domain/entityMeta';
import { colors, font, tracking } from '@/theme/theme';
import { useThemeSync } from '@/theme/useTheme';

export default function EditEntityScreen() {
  useThemeSync();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const showToast = useToast((s) => s.show);

  const entity = useStore((s) => s.entities.find((e) => e.id === id));
  const reminders = useStore((s) => s.reminders);
  const updateEntity = useStore((s) => s.updateEntity);
  const updateReminder = useStore((s) => s.updateReminder);

  const [form, setForm] = useState<EntityFormState>(() => initialFormState(entity?.type ?? 'task', entity));
  const update = (patch: Partial<EntityFormState>) => setForm((f) => ({ ...f, ...patch }));

  if (!entity) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.surfacePage, padding: 20 }}>
        <Text style={{ fontFamily: font('sans', 400), color: colors.textMuted, marginTop: 40, textAlign: 'center' }}>This item no longer exists.</Text>
      </View>
    );
  }

  const type = entity.type;
  const meta = ENTITY_META[type];

  const onSave = async () => {
    const title = form.title.trim() || entity.title;
    const data = buildEntityData(type, form, entity.data);
    await updateEntity(entity.id, { title, data });

    const rc = buildReminderConfig(type, form);
    if (rc) {
      const primary = reminders.find((r) => r.entityId === entity.id && r.kind === primaryReminderKind(type));
      if (primary) await updateReminder(primary.id, { usesDefault: false, config: { ...primary.config, ...rc } });
    }

    showToast('Changes saved');
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.surfacePage }}>
      <View style={{ width: 38, height: 5, borderRadius: 999, backgroundColor: colors.lineStrong, alignSelf: 'center', marginTop: 10, marginBottom: 6 }} />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: insets.bottom + 24 }} keyboardShouldPersistTaps="handled">
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <IconButton icon="chevron-left" variant="soft" accessibilityLabel="Back" onPress={() => router.back()} />
          <EntityIcon type={type} />
          <Text style={{ fontFamily: font('display', 800), fontSize: 20, letterSpacing: tracking.tight, color: colors.textStrong }}>Edit {meta.label}</Text>
        </View>

        <View style={{ gap: 16 }}>
          <Input
            label="Title"
            value={form.title}
            onChangeText={(v) => update({ title: v })}
            icon="pen-line"
            placeholder={meta.label}
          />

          <EntityFields type={type} state={form} update={update} />

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
            <Button variant="secondary" fullWidth onPress={() => router.back()}>Cancel</Button>
            <Button fullWidth iconLeft="check" onPress={onSave}>Save</Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
