/**
 * First-run seed data. Ports the prototype's sample content (project/ui_kits/app/
 * data.jsx) into real entities/reminders/links/completions/contact history so a
 * fresh install opens to a populated, explorable app. No-ops if data exists.
 */
import { db } from '@/db/client';
import { contactLog } from '@/db/schema';
import { newId } from '@/lib/id';
import { startOfDay } from '@/lib/datetime';
import type { OrbitRepository } from '@/data/repository';

const DAY = 86400000;

export async function seedDatabase(repo: OrbitRepository): Promise<void> {
  const existing = await repo.listEntities({ includeArchived: true });
  if (existing.length) return;

  const now = Date.now();
  const at = (h: number, m = 0, dayOffset = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + dayOffset);
    d.setHours(h, m, 0, 0);
    return d.getTime();
  };
  const backdateContact = (personId: string, daysAgo: number, channel: string) =>
    db.insert(contactLog).values({ id: newId(), personId, contactedAt: now - daysAgo * DAY, channel }).run();

  // ---- People -----------------------------------------------------------
  const sam = await repo.createEntity({
    type: 'person',
    title: 'Sam Rivera',
    data: {
      handles: [
        { platform: 'sms', value: '+15551234567' },
        { platform: 'whatsapp', value: '15551234567' },
        { platform: 'instagram', value: 'samrivera' },
      ],
      birthday: '1992-06-16',
      stayInTouchDays: 21,
    },
  });
  backdateContact(sam.id, 21, 'sms');
  await repo.createReminder({ entityId: sam.id, kind: 'stay_in_touch', usesDefault: true });
  await repo.createReminder({ entityId: sam.id, kind: 'date' }); // birthday

  const alex = await repo.createEntity({
    type: 'person',
    title: 'Alex Kim',
    data: {
      handles: [
        { platform: 'sms', value: '+15559876543' },
        { platform: 'phone', value: '+15559876543' },
      ],
      stayInTouchDays: 14,
    },
  });
  backdateContact(alex.id, 6, 'sms');
  await repo.createReminder({ entityId: alex.id, kind: 'stay_in_touch', usesDefault: false, config: { cadenceDays: 14 } });

  const priya = await repo.createEntity({
    type: 'person',
    title: 'Priya Nair',
    data: {
      handles: [
        { platform: 'whatsapp', value: '15551112222' },
        { platform: 'instagram', value: 'priya.nair' },
        { platform: 'linkedin', value: 'priyanair' },
      ],
      birthday: '1990-09-02',
      stayInTouchDays: 30,
    },
  });
  backdateContact(priya.id, 34, 'whatsapp');
  await repo.createReminder({ entityId: priya.id, kind: 'stay_in_touch', usesDefault: false, config: { cadenceDays: 30 } });
  await repo.createReminder({ entityId: priya.id, kind: 'date' }); // birthday

  // ---- Tasks ------------------------------------------------------------
  const gift = await repo.createEntity({
    type: 'task',
    title: 'Buy birthday gift',
    data: { due: startOfDay(now), status: 'open' },
  });
  await repo.createReminder({ entityId: gift.id, kind: 'date' });
  await repo.createLink(gift.id, sam.id, 'gift_for');

  const deck = await repo.createEntity({
    type: 'task',
    title: 'Send Q3 deck to Alex',
    data: { due: at(17, 0, 0), status: 'open' },
  });
  await repo.createReminder({ entityId: deck.id, kind: 'date' });
  await repo.createLink(deck.id, alex.id, 'about');

  const passportDue = (() => {
    const d = new Date();
    d.setMonth(6, 30);
    d.setHours(9, 0, 0, 0);
    if (d.getTime() < now) d.setFullYear(d.getFullYear() + 1);
    return d.getTime();
  })();
  const passport = await repo.createEntity({ type: 'task', title: 'Renew passport', data: { due: passportDue, status: 'open' } });
  await repo.createReminder({ entityId: passport.id, kind: 'date' });

  // ---- Routines (non-streak) -------------------------------------------
  const water = await repo.createEntity({
    type: 'routine',
    title: 'Water the plants',
    data: { rrule: 'FREQ=WEEKLY;BYDAY=TU', schedule: 'Every Tuesday', trackAsStreak: false },
  });
  await repo.createReminder({ entityId: water.id, kind: 'recurring', usesDefault: false, config: { rrule: 'FREQ=WEEKLY;BYDAY=TU' } });

  const review = await repo.createEntity({
    type: 'routine',
    title: 'Weekly review',
    data: { rrule: 'FREQ=WEEKLY;BYDAY=SU', schedule: 'Every Sunday', trackAsStreak: false },
  });
  await repo.createReminder({ entityId: review.id, kind: 'recurring', usesDefault: false, config: { rrule: 'FREQ=WEEKLY;BYDAY=SU' } });

  // ---- Habits (streak) --------------------------------------------------
  const stretch = await repo.createEntity({
    type: 'habit',
    title: 'Morning stretch',
    data: { rrule: 'FREQ=DAILY', schedule: 'Daily · 7:00 AM', trackAsStreak: true },
  });
  await repo.createReminder({ entityId: stretch.id, kind: 'recurring', usesDefault: false, config: { rrule: 'FREQ=DAILY', timeOfDay: '07:00' } });
  for (let i = 0; i < 17; i++) await repo.addCompletion(stretch.id, 'done', now - i * DAY);

  const read = await repo.createEntity({
    type: 'habit',
    title: 'Read 20 minutes',
    data: { rrule: 'FREQ=DAILY', schedule: 'Daily · 9:30 PM', trackAsStreak: true },
  });
  await repo.createReminder({ entityId: read.id, kind: 'recurring', usesDefault: false, config: { rrule: 'FREQ=DAILY', timeOfDay: '21:30' } });
  for (let i = 1; i <= 4; i++) await repo.addCompletion(read.id, 'done', now - i * DAY);

  await repo.createEntity({
    type: 'habit',
    title: 'No phone after 10pm',
    data: { rrule: 'FREQ=DAILY', schedule: 'Daily', trackAsStreak: true },
  });

  // ---- Projects ---------------------------------------------------------
  const partyMilestones = [
    { title: 'Pick a date', date: now - 10 * DAY, done: true },
    { title: 'Book venue', date: now - 3 * DAY, done: true },
    { title: 'Send invites', date: now + 2 * DAY, done: true },
    { title: 'Order cake', date: now + 5 * DAY, done: false },
    { title: 'Plan menu', date: now + 7 * DAY, done: false },
    { title: 'Buy decorations', date: now + 9 * DAY, done: false },
    { title: 'Confirm guests', date: now + 12 * DAY, done: false },
  ];
  const party = await repo.createEntity({ type: 'project', title: 'Plan birthday party', data: { milestones: partyMilestones } });
  await repo.createReminder({ entityId: party.id, kind: 'milestone' });
  await repo.createLink(party.id, sam.id, 'about');

  const kitchenMilestones = [
    { title: 'Set budget', date: now - 5 * DAY, done: true },
    { title: 'Get quotes', date: now + 6 * DAY, done: false },
    { title: 'Choose cabinets', date: now + 14 * DAY, done: false },
    { title: 'Schedule install', date: now + 21 * DAY, done: false },
    { title: 'Final walkthrough', date: now + 30 * DAY, done: false },
  ];
  const kitchen = await repo.createEntity({ type: 'project', title: 'Kitchen renovation', data: { milestones: kitchenMilestones } });
  await repo.createReminder({ entityId: kitchen.id, kind: 'milestone' });

  await repo.recomputeAllNextFire();
}
