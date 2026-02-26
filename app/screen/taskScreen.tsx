import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { RootStackParamList } from "../(tabs)";
import type { RootState } from "../../store";
import {
  addTask,
  deleteTask,
  Task,
  toggleCheckbox,
  toggleHighlight,
} from "../../store/tasksSlice";
import FloatingButton from "../components/FloatingButton";
import EmptyState from "../components/message";
import PlannedFilterMenu, {
  PlannedFilterType,
} from "../components/plannedFilterMenu";
import TaskItem from "../components/taskItem";
import colors from "../style/colors";

export const getTaskDate = (task: any) => {
  if (task.dueDate) return new Date(task.dueDate);
  if (task.remindAt) return new Date(task.remindAt);
  return null;
};

export default function TasksScreen() {
  const [showInput, setShowInput] = useState(false);
  const [task, setTask] = useState("");

  type NavigationProp = StackNavigationProp<RootStackParamList, "Home">;
  const dispatch = useDispatch();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);

  const inputRef = useRef<TextInput>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const navigation = useNavigation<NavigationProp>();

  const openKeyboard = () => {
    setShowInput(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleSend = () => {
    if (task.trim().length > 0) {
      dispatch(addTask({ title: task }));
      setTask("");
    }
    Keyboard.dismiss();
    setShowInput(false);
  };

  const handleSelectTask = (id: string) => {
    setSelectedTaskId(selectedTaskId === id ? null : id);
  };

  const handleHighlightTask = (id: string) => {
    dispatch(toggleHighlight(id));
  };

  const handleCheckboxTask = (id: string) => {
    dispatch(toggleCheckbox(id));
  };

  const openTaskDetails = (id: string) => {
    navigation.navigate("TaskDetails", { taskId: id });
  };

  const handleDeleteTask = (id: string) => {
    dispatch(deleteTask(id));
  };

  const applyPlanningFilter = (filter: PlannedFilterType, tasks: Task[]) => {
    const now = new Date();

    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(startOfDay.getDate() + 1);

    const tomorrow = new Date(startOfDay);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const endOfTomorrow = new Date(tomorrow);
    endOfTomorrow.setDate(endOfTomorrow.getDate() + 1);

    const startOfWeek = new Date(startOfDay);
    startOfWeek.setDate(startOfWeek.getDate() - startOfDay.getDay()); // Sunday start

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 7);

    switch (filter) {
      case "overdue":
        return tasks.filter((task) => {
          const d = getTaskDate(task);
          return d && d < startOfDay;
        });

      case "today":
        return tasks.filter((task) => {
          const d = getTaskDate(task);
          return d && d >= startOfDay && d < endOfDay;
        });

      case "tomorrow":
        return tasks.filter((task) => {
          const d = getTaskDate(task);
          return d && d >= tomorrow && d < endOfTomorrow;
        });

      case "this_week":
        return tasks.filter((task) => {
          const d = getTaskDate(task);
          return d && d >= startOfWeek && d < endOfWeek;
        });

      case "later":
        return tasks.filter((task) => {
          const d = getTaskDate(task);
          return d && d > endOfWeek;
        });

      default: // "all"
        return tasks.filter((t) => t.remindAt || t.dueDate);
    }
  };

  const route = useRoute<any>();
  const mode = route.params?.mode ?? "all";

  // 1. Filter based on mode
  let filteredTasks;

  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const endOfToday = new Date(startOfToday);
  endOfToday.setDate(endOfToday.getDate() + 1);

  if (mode === "important") {
    filteredTasks = tasks.filter((t) => t.highlight === true);
  } else if (mode === "planning") {
    filteredTasks = tasks.filter((t) => t.remindAt || t.dueDate);
  } else if (mode === "myDay") {
    filteredTasks = tasks.filter((t) => {
      let due = t.dueDate ? new Date(t.dueDate) : null;
      let remind = t.remindAt ? new Date(t.remindAt) : null;

      // Some tasks have a `date` string like "11/14/2025"
      let createdDate = t.date ? new Date(t.date) : null;

      // Check if ANY of the dates fall today
      return (
        (due && due >= startOfToday && due < endOfToday) ||
        (remind && remind >= startOfToday && remind < endOfToday) ||
        (createdDate && createdDate >= startOfToday && createdDate < endOfToday)
      );
    });
  } else {
    filteredTasks = tasks;
  }

  const [sortedTasks, setSortedTasks] = useState<Task[]>([]);
  const [selectedFilter, setSelectedFilter] =
    useState<PlannedFilterType>("all");

  useEffect(() => {
    const sorted = [...filteredTasks].sort((a, b) => {
      if (a.highlight && !b.highlight) return -1;
      if (!a.highlight && b.highlight) return 1;
      return 0;
    });

    setSortedTasks(sorted);
  }, [filteredTasks]);

  const handleSortingBasedOnMode = (v: PlannedFilterType) => {
    const filtered = applyPlanningFilter(v, tasks);
    setSortedTasks(filtered);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView style={styles.container} behavior="height">
        <View style={styles.container_h}>
          <TouchableOpacity onPress={() => navigation.navigate("Home")}>
            <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.header}>
            {mode === "all"
              ? "TASK"
              : mode === "important"
                ? "Important"
                : mode === "planning"
                  ? "Planning"
                  : mode === "myDay"
                    ? "My Day"
                    : ""}
          </Text>
        </View>

        {/* filter code mode -planning only  */}
        {mode == "planning" && (
          <View style={styles.filter}>
            <PlannedFilterMenu
              selectedFilter={selectedFilter}
              onSelect={(v) => {
                setSelectedFilter(v);
                handleSortingBasedOnMode(v);
              }}
            ></PlannedFilterMenu>
          </View>
        )}
        {sortedTasks.length === 0 ? (
          <EmptyState mode={mode} />
        ) : (
          <FlatList
            data={sortedTasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TaskItem
                title={item.title}
                date={item.date}
                mode={mode}
                task={item}
                selected={selectedTaskId === item.id}
                important={item.highlight}
                onPress={() => handleSelectTask(item.id)}
                onHighlight={() => handleHighlightTask(item.id)}
                onCheckboxClick={() => handleCheckboxTask(item.id)}
                checked={item.checkbox}
                onOpenDetails={() => openTaskDetails(item.id)}
                onDelete={() => handleDeleteTask(item.id)}
              />
            )}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        )}

        {showInput ? (
          <View style={styles.inputContainer}>
            <TextInput
              ref={inputRef}
              style={styles.textInput}
              placeholder="Add a task"
              value={task}
              onChangeText={setTask}
              returnKeyType="done"
              onSubmitEditing={handleSend}
            />
            <TouchableOpacity onPress={handleSend} style={styles.sendBtn}>
              <Text style={styles.sendText}>➤</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FloatingButton onPress={openKeyboard} />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  filter: {
    marginBottom: 15,
  },
  container_h: {
    marginBottom: 20,
    alignContent: "center",
    gap: 5,
  },
  header: {
    color: colors.textPrimary,
    fontSize: 25,
    fontWeight: "700",
    marginBottom: 5,
  },
  inputContainer: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#1c1c1c",
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  textInput: {
    flex: 1,
    backgroundColor: "#2a2a2a",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: "#fff",
  },
  sendBtn: {
    marginLeft: 10,
    backgroundColor: colors.accent,
    borderRadius: 20,
    padding: 10,
  },

  sendText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#999",
    marginBottom: 5,
  },
  emptySubText: {
    fontSize: 14,
    color: "#bbb",
  },
});
