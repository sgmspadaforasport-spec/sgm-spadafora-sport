// Push notifications are temporarily disabled on Android standalone builds.
// Keeping this no-op function preserves the app API without loading expo-notifications
// during startup, so we can isolate the immediate launch crash.
export async function registerForPushNotificationsAsync(): Promise<string | null> {
  return null;
}
