import * as Notifications from "expo-notifications";

export async function scheduleReminder(timestamp: number, message: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Reminder",
      body: message,
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE, // use DATE if scheduling at a specific date
      date: new Date(timestamp),
    },
  });
}
