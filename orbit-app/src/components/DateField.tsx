import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Icon, type IconName } from './Icon';
import { BottomSheet } from './BottomSheet';
import { Button } from './Button';
import { startOfDay, DAY_MS } from '@/lib/datetime';
import { colors, font, radius, tracking } from '@/theme/theme';

const MONTHS_FULL = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAY_INITIALS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

/** Default field display: "Jun 16, 2026". */
function defaultFormat(ts: number): string {
  const d = new Date(ts);
  return `${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

interface CalendarProps {
  value: number | null;
  onSelect: (ts: number) => void;
}

function Calendar({ value, onSelect }: CalendarProps) {
  const [view, setView] = useState(() => {
    const d = value != null ? new Date(value) : new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const startWeekday = new Date(view.year, view.month, 1).getDay();
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const todayStart = startOfDay(Date.now());
  const selStart = value != null ? startOfDay(value) : null;

  const step = (delta: number) => {
    let m = view.month + delta;
    let y = view.year;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    setView({ year: y, month: m });
  };

  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <Pressable onPress={() => step(-1)} hitSlop={10} style={{ width: 34, height: 34, borderRadius: 999, backgroundColor: colors.fill, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="chevron-left" size={18} color={colors.textBody} />
        </Pressable>
        <Text style={{ fontFamily: font('sans', 700), fontSize: 16, color: colors.textStrong, letterSpacing: tracking.snug }}>
          {MONTHS_FULL[view.month]} {view.year}
        </Text>
        <Pressable onPress={() => step(1)} hitSlop={10} style={{ width: 34, height: 34, borderRadius: 999, backgroundColor: colors.fill, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="chevron-right" size={18} color={colors.textBody} />
        </Pressable>
      </View>

      <View style={{ flexDirection: 'row', marginBottom: 4 }}>
        {WEEKDAY_INITIALS.map((w, i) => (
          <Text key={i} style={{ flex: 1, textAlign: 'center', fontFamily: font('mono', 600), fontSize: 11, color: colors.textSubtle }}>
            {w}
          </Text>
        ))}
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {cells.map((day, i) => {
          if (day == null) return <View key={i} style={{ width: `${100 / 7}%`, height: 42 }} />;
          const ts = new Date(view.year, view.month, day).getTime();
          const isSel = selStart != null && startOfDay(ts) === selStart;
          const isToday = startOfDay(ts) === todayStart;
          return (
            <Pressable
              key={i}
              onPress={() => onSelect(startOfDay(ts))}
              style={{ width: `${100 / 7}%`, height: 42, alignItems: 'center', justifyContent: 'center' }}
            >
              <View style={{ width: 34, height: 34, borderRadius: 999, alignItems: 'center', justifyContent: 'center', backgroundColor: isSel ? colors.accent : 'transparent', borderWidth: !isSel && isToday ? 1 : 0, borderColor: colors.borderStrong }}>
                <Text style={{ fontFamily: font('sans', isSel ? 700 : 400), fontSize: 14.5, color: isSel ? colors.textOnBrand : colors.textBody }}>
                  {day}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export interface DateFieldProps {
  label: string;
  value: number | null;
  onChange: (ts: number | null) => void;
  placeholder?: string;
  icon?: IconName;
  /** Show Today / Tomorrow / Next week quick chips (good for due dates). */
  relativeChips?: boolean;
  /** Allow clearing back to null. Defaults true. */
  clearable?: boolean;
  /** Custom display formatter for the selected value. */
  format?: (ts: number) => string;
}

/** A tappable field that opens a calendar bottom sheet. Pure JS — no native picker. */
export function DateField({ label, value, onChange, placeholder = 'None', icon = 'calendar-days', relativeChips, clearable = true, format = defaultFormat }: DateFieldProps) {
  const [open, setOpen] = useState(false);
  const select = (ts: number | null) => { onChange(ts); setOpen(false); };

  const chips: { label: string; ts: number }[] = relativeChips
    ? [
        { label: 'Today', ts: startOfDay(Date.now()) },
        { label: 'Tomorrow', ts: startOfDay(Date.now() + DAY_MS) },
        { label: 'Next week', ts: startOfDay(Date.now() + 7 * DAY_MS) },
      ]
    : [];

  return (
    <View>
      <Text style={{ fontFamily: font('sans', 600), fontSize: 13, color: colors.textBody, marginBottom: 7 }}>{label}</Text>
      <Pressable
        onPress={() => setOpen(true)}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.surfaceCard, borderWidth: 1, borderColor: colors.borderDefault, borderRadius: radius.md, paddingVertical: 13, paddingHorizontal: 14 }}
      >
        <Icon name={icon} size={18} color={value != null ? colors.accent : colors.textSubtle} />
        <Text style={{ flex: 1, fontFamily: font('sans', value != null ? 500 : 400), fontSize: 15, color: value != null ? colors.textStrong : colors.textSubtle }}>
          {value != null ? format(value) : placeholder}
        </Text>
        {value != null && clearable ? (
          <Pressable onPress={() => onChange(null)} hitSlop={10}>
            <Icon name="x" size={17} color={colors.textSubtle} />
          </Pressable>
        ) : (
          <Icon name="chevron-right" size={17} color={colors.textSubtle} />
        )}
      </Pressable>

      <BottomSheet visible={open} onClose={() => setOpen(false)}>
        <Text style={{ fontFamily: font('display', 800), fontSize: 19, letterSpacing: tracking.tight, color: colors.textStrong, marginBottom: 14 }}>{label}</Text>

        {chips.length > 0 && (
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
            {chips.map((c) => (
              <Pressable
                key={c.label}
                onPress={() => select(c.ts)}
                style={{ flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: radius.sm, backgroundColor: colors.accentTint }}
              >
                <Text style={{ fontFamily: font('sans', 600), fontSize: 13, color: colors.accent }}>{c.label}</Text>
              </Pressable>
            ))}
          </View>
        )}

        <Calendar value={value} onSelect={select} />

        {clearable && (
          <View style={{ marginTop: 16 }}>
            <Button variant="secondary" fullWidth onPress={() => select(null)}>Clear date</Button>
          </View>
        )}
      </BottomSheet>
    </View>
  );
}

export default DateField;
