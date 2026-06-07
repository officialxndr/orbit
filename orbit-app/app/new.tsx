import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, EntityIcon, Icon, IconButton, Input, Switch } from '@/components';
import { ENTITY_META, ENTITY_ORDER } from '@/domain/entityMeta';
import { useStore } from '@/store/useStore';
import { useToast } from '@/store/useToast';
import type { EntityType } from '@/domain/types';
import { border, colors, font, radius, shadow, tracking } from '@/theme/theme';

export default function NewEntityScreen() {
  const router = useRouter();
  const addEntity = useStore((s) => s.addEntity);
  const showToast = useToast((s) => s.show);
  const insets = useSafeAreaInsets();

  const [type, setType] = useState<EntityType | null>(null);
  const [title, setTitle] = useState('');
  const [trackAsStreak, setTrackAsStreak] = useState(true);

  const close = () => router.back();

  const onAdd = async () => {
    if (!type) return;
    const meta = ENTITY_META[type];
    const entity = await addEntity({ type, title: title.trim() || `New ${meta.label}`, trackAsStreak });
    showToast(`${entity.title} added`);
    close();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.surfacePage }}>
      <View style={{ width: 38, height: 5, borderRadius: 999, backgroundColor: colors.lineStrong, alignSelf: 'center', marginTop: 10, marginBottom: 6 }} />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: insets.bottom + 24 }} keyboardShouldPersistTaps="handled">
        {!type ? (
          <>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: font('display', 800), fontSize: 22, letterSpacing: tracking.tight, color: colors.textStrong }}>Add to your orbit</Text>
                <Text style={{ fontFamily: font('sans', 400), fontSize: 14, color: colors.textMuted, marginTop: 4, marginBottom: 16 }}>What are you adding?</Text>
              </View>
              <IconButton icon="x" variant="soft" accessibilityLabel="Close" onPress={close} />
            </View>
            <View style={{ gap: 9 }}>
              {ENTITY_ORDER.map((t) => {
                const m = ENTITY_META[t];
                return (
                  <Pressable
                    key={t}
                    onPress={() => setType(t)}
                    style={[
                      { flexDirection: 'row', alignItems: 'center', gap: 13, padding: 12, borderRadius: radius.lg, backgroundColor: colors.surfaceCard, borderWidth: 1, borderColor: colors.borderDefault, borderLeftWidth: border.accent, borderLeftColor: m.color },
                      shadow.sm,
                    ]}
                  >
                    <EntityIcon type={t} size="lg" />
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontFamily: font('sans', 700), fontSize: 16, color: colors.textStrong }}>{m.label}</Text>
                      <Text style={{ fontFamily: font('sans', 400), fontSize: 13, color: colors.textMuted, marginTop: 1 }}>{m.description}</Text>
                    </View>
                    <Icon name="chevron-right" size={18} color={colors.textSubtle} />
                  </Pressable>
                );
              })}
            </View>
          </>
        ) : (
          <>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <IconButton icon="chevron-left" variant="soft" accessibilityLabel="Back" onPress={() => setType(null)} />
              <EntityIcon type={type} />
              <Text style={{ fontFamily: font('display', 800), fontSize: 20, letterSpacing: tracking.tight, color: colors.textStrong }}>New {ENTITY_META[type].label}</Text>
            </View>

            <View style={{ gap: 16 }}>
              <Input
                label="Title"
                value={title}
                onChangeText={setTitle}
                autoFocus
                icon="pen-line"
                placeholder={type === 'person' ? 'e.g. Sam Rivera' : type === 'habit' ? 'e.g. Morning stretch' : 'e.g. Buy groceries'}
              />

              {(type === 'habit' || type === 'routine') && (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.surfaceCard, borderWidth: 1, borderColor: colors.borderDefault, borderRadius: radius.md, paddingVertical: 12, paddingHorizontal: 14 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: font('sans', 600), fontSize: 14, color: colors.textStrong }}>Track as streak</Text>
                    <Text style={{ fontFamily: font('sans', 400), fontSize: 12.5, color: colors.textMuted, marginTop: 2 }}>Gamify consistency</Text>
                  </View>
                  <Switch checked={trackAsStreak} onChange={setTrackAsStreak} color={colors.habit} />
                </View>
              )}

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
                <Icon name="bell" size={15} color={colors.textSubtle} />
                <Text style={{ flex: 1, fontFamily: font('sans', 400), fontSize: 13, color: colors.textMuted }}>
                  Reminder uses your global default — customize after saving.
                </Text>
              </View>

              <Button fullWidth size="lg" iconLeft="plus" onPress={onAdd}>
                Add {ENTITY_META[type].label}
              </Button>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
