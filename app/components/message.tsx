import { StyleSheet, Text, View } from "react-native";

export default function EmptyState({ mode }: { mode: string }) {
  const getMessage = () => {
    switch (mode) {
      case "important":
        return {
          title: "No important tasks yet.",
          subtitle: "Mark a task as important to see them here.",
        };

      case "planning":
        return {
          title: "No upcoming tasks.",
          subtitle: "Tasks with due dates or reminders will appear here.",
        };

      default: // "all"
        return {
          title: "You have no tasks yet.",
          subtitle: "Tap the + button to add your first task!",
        };
    }
  };

  const msg = getMessage();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{msg.title}</Text>
      <Text style={styles.subtitle}>{msg.subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 80,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    color: "#777",
    textAlign: "center",
  },
});
