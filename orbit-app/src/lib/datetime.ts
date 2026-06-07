/** Small date helpers (no external date library). */

const DAY_MS = 24 * 60 * 60 * 1000;
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function startOfDay(ts: number): number {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

/** Whole days elapsed since `ts` (floored, never negative). */
export function daysSince(ts: number, now = Date.now()): number {
  return Math.max(0, Math.floor((startOfDay(now) - startOfDay(ts)) / DAY_MS));
}

/** Days until `ts` (negative = overdue). */
export function daysUntil(ts: number, now = Date.now()): number {
  return Math.round((startOfDay(ts) - startOfDay(now)) / DAY_MS);
}

/** "Jun 16" */
export function formatMonthDay(ts: number): string {
  const d = new Date(ts);
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

/** "9:00 AM" */
export function formatTime(ts: number): string {
  const d = new Date(ts);
  const h = d.getHours();
  const m = d.getMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
}

/** Header eyebrow, e.g. "Friday · Jun 12". */
export function todayEyebrow(now = Date.now()): string {
  const d = new Date(now);
  return `${WEEKDAYS[d.getDay()]} · ${formatMonthDay(now)}`;
}

/** Parse a 'YYYY-MM-DD' birthday for display ("Jun 16"); returns null if unparseable. */
export function birthdayDisplay(birthday?: string | null): string | null {
  if (!birthday) return null;
  const m = birthday.match(/(\d{1,2})-(\d{1,2})$/);
  if (!m) return birthday;
  const month = parseInt(m[1], 10) - 1;
  const day = parseInt(m[2], 10);
  if (month < 0 || month > 11) return birthday;
  return `${MONTHS[month]} ${day}`;
}

export { DAY_MS };
