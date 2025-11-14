import * as Notifications from "expo-notifications";

// Required handler (must be at top level)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Ask permission
export async function askNotificationPermission() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}
