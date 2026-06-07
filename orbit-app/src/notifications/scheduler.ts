/**
 * Notification engine (build plan §6). iOS caps pending local notifications at
 * 64, so SQLite is the source of truth and the OS queue is a rolling cache:
 *   1. recompute every reminder's next_fire (resolving item-over-default config)
 *   2. take the soonest <=64 enabled reminders
 *   3. cancel the OS queue and reschedule exactly those
 * A background task re-runs this to top up the window. Web degrades to in-app
 * reminders (no reliable background notifications).
 */
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { repository } from '@/data/sqliteRepository';
import { buildNotificationCopy } from './content';

export const OS_QUEUE_LIMIT = 64;
const ANDROID_CHANNEL = 'reminders';

let configured = false;

/** Foreground display behavior + Android channel. Call once at startup. */
export async function configureNotifications(): Promise<void> {
  if (configured) return;
  configured = true;

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL, {
      name: 'Reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
      lightColor: '#4B43D9',
    });
  }
}

/** Ensure we have permission; requests once if undetermined. Returns granted. */
export async function ensurePermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  if (current.canAskAgain === false) return false;
  const req = await Notifications.requestPermissionsAsync();
  return req.granted;
}

/**
 * Reconcile the OS notification queue with SQLite. Safe to call often; it fully
 * rebuilds the queue from the soonest reminders.
 */
export async function syncNotifications(): Promise<void> {
  if (Platform.OS === 'web') return; // documented limitation — in-app only
  await configureNotifications();

  const granted = await ensurePermission();
  if (!granted) return;

  // 1. Freshen next_fire for all reminders.
  await repository.recomputeAllNextFire();

  // 2. Soonest <=64 enabled, future reminders.
  const now = Date.now();
  const upcoming = (await repository.listUpcomingReminders(OS_QUEUE_LIMIT * 2))
    .filter((r) => r.nextFire != null && (r.nextFire as number) > now)
    .slice(0, OS_QUEUE_LIMIT);

  // 3. Rebuild the queue.
  await Notifications.cancelAllScheduledNotificationsAsync();

  for (const reminder of upcoming) {
    const entity = await repository.getEntity(reminder.entityId);
    if (!entity || entity.archivedAt) continue;
    const copy = buildNotificationCopy(reminder, entity);
    try {
      await Notifications.scheduleNotificationAsync({
        identifier: reminder.id,
        content: {
          title: copy.title,
          body: copy.body,
          data: { entityId: entity.id, reminderId: reminder.id },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: new Date(reminder.nextFire as number),
          channelId: Platform.OS === 'android' ? ANDROID_CHANNEL : undefined,
        },
      });
    } catch {
      // A single bad trigger shouldn't abort the whole sync.
    }
  }
}
