import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function getNotificationPermissionState() {
  const permission = await Notifications.getPermissionsAsync();
  if (permission.granted) return "granted";
  return permission.canAskAgain === false ? "blocked" : "denied";
}

// Debe llamarse únicamente después de que la pantalla explique el propósito.
export async function requestNotificationPermissions() {
  const current = await Notifications.getPermissionsAsync();
  if (!current.granted && current.canAskAgain === false) return "blocked";
  const { status, canAskAgain } = await Notifications.requestPermissionsAsync();
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
  return status === "granted" ? "granted" : (canAskAgain === false ? "blocked" : "denied");
}

export async function scheduleLocalReminder(title, body, triggerDate) {
  return Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: triggerDate,
  });
}
