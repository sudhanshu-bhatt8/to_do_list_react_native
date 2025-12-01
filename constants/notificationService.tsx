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

export async function scheduleDueDate(timestamp: number, message: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Due Date",
      body: message,
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: new Date(timestamp),
    },
  });
}
