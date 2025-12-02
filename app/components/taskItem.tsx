import { Task } from "@/store/tasksSlice";
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import colors from "../style/colors";

interface TaskItemProps {
  title: string;
  date?: string;
  mode?: string;
  task: Task;
  selected?: boolean;
  important?: boolean;
  onPress?: () => void;
  onHighlight?: () => void;
  onCheckboxClick?: () => void;
  checked?: boolean;
  onOpenDetails?: () => void;
  onDelete: () => void;
}

export default function TaskItem({
  title,
  date,
  mode,
  task,
  selected,
  important,
  onPress,
  onHighlight,
  onCheckboxClick,
  checked,
  onOpenDetails,
  onDelete,
}: TaskItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        important && { borderColor: "#f4c542", borderWidth: 2 },
      ]}
    >
      {/* when clicked here it should open a new page  */}
      <TouchableOpacity
        style={{
          flex: 1,
          gap: 2,
          flexDirection: "row",
          alignItems: "center",
        }}
        onPress={onOpenDetails}
      >
        <TouchableOpacity onPress={onCheckboxClick}>
          <Checkbox
            value={checked}
            onValueChange={onCheckboxClick}
            color={checked ? "#4caf50" : undefined}
            style={styles.checkbox}
          />
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text
            style={[
              styles.title,
              important && { color: "#f4c542" },
              checked && {
                textDecorationLine: "line-through",
                opacity: 0.6,
              },
            ]}
          >
            {title}
          </Text>
          {/* Show dates only when mode === "planning" */}
          {mode === "planning" && (
            <>
              {task.remindAt ? (
                <Text style={styles.date}>
                  Remind: {new Date(task.remindAt).toLocaleString()}
                </Text>
              ) : null}

              {task.dueDate && (
                <Text style={styles.date}>
                  Due: {new Date(task.dueDate).toLocaleString()}
                </Text>
              )}
            </>
          )}

          {/* Fallback: show regular date when NOT in planning mode */}
          {mode !== "planning" && date && (
            <Text style={styles.date}>{date}</Text>
          )}
        </View>
      </TouchableOpacity>

      <View style={styles.actionsRow}>
        {/* STAR BUTTON */}
        <TouchableOpacity onPress={onHighlight} style={styles.highlightBtn}>
          <Text
            style={[
              styles.highlightText,
              important && !checked ? { color: "#f4c542" } : { color: "#888" },
            ]}
          >
            {important && !checked ? "⭐" : "☆"}
          </Text>
        </TouchableOpacity>

        {/* DELETE BUTTON */}
        <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
          <Ionicons
            name="trash-outline"
            size={20}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#2a2a2a",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },

  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#fff",
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: "#4caf50", // green check look
    borderColor: "#4caf50",
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  date: {
    color: "#999",
    fontSize: 12,
  },
  highlightBtn: {
    marginLeft: 10,
    padding: 6,
  },
  highlightText: {
    fontSize: 18,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  deleteBtn: {
    marginLeft: 12,
    padding: 4,
  },

  deleteText: {
    fontSize: 18,
    color: "#888", // or colors.textSecondary
  },
});
