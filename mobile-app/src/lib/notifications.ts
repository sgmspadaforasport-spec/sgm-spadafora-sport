import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { supabase } from './supabase';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function savePushToken(token: string) {
  const { error } = await supabase.from('app_push_tokens').upsert(
    {
      expo_push_token: token,
      platform: Platform.OS,
      app_version: Constants.expoConfig?.version ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'expo_push_token' }
  );
  if (error) throw error;
}

export async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (!Device.isDevice) return null;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Notifiche SGM',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#F5C400',
      sound: 'default',
    });
  }

  const current = await Notifications.getPermissionsAsync();
  let status = current.status;
  if (status !== 'granted') {
    const requested = await Notifications.requestPermissionsAsync();
    status = requested.status;
  }
  if (status !== 'granted') return null;

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId;

  if (!projectId || projectId === 'REPLACE_AFTER_EAS_INIT') return null;

  const token = await Notifications.getExpoPushTokenAsync({ projectId });
  await savePushToken(token.data);
  return token.data;
}
