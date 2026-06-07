/**
 * Background top-up of the notification queue. Registered as an OS background
 * task that periodically re-runs the scheduler so the rolling 64-slot window
 * stays filled even while the app is closed (native only; Android Doze may
 * delay the top-up but not delivery of already-scheduled notifications).
 */
import { Platform } from 'react-native';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundTask from 'expo-background-task';
import { syncNotifications } from './scheduler';

export const BG_TASK = 'orbit-reminder-topup';

// Must be defined at module scope so it's registered when the JS bundle loads.
TaskManager.defineTask(BG_TASK, async () => {
  try {
    await syncNotifications();
    return BackgroundTask.BackgroundTaskResult.Success;
  } catch {
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
});

export async function registerBackgroundSync(): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    const status = await BackgroundTask.getStatusAsync();
    if (status === BackgroundTask.BackgroundTaskStatus.Restricted) return;
    const already = await TaskManager.isTaskRegisteredAsync(BG_TASK);
    if (already) return;
    await BackgroundTask.registerTaskAsync(BG_TASK, { minimumInterval: 12 * 60 }); // minutes
  } catch {
    // Background scheduling is best-effort; the app still tops up on open.
  }
}
