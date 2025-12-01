// TaskDetails.tsx
import { askNotificationPermission } from "@/constants/notification";
import { scheduleReminder } from "@/constants/notificationService";
import { RootState } from "@/store";
import {
  addStep,
  deleteStep,
  editStepTitle,
  editTaskTitle,
  promoteStepToTask,
  toggleCheckbox,
  toggleHighlight,
  toggleStepCheck,
} from "@/store/tasksSlice";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import Checkbox from "expo-checkbox";
import { useNavigation } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  ListRenderItem,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import type { Dispatch } from "redux";
import colors from "../style/colors";

type Props = {
  task: { title: string };
  scheduleReminder: (when: number, text: string) => Promise<void>;
  askNotificationPermission: () => Promise<boolean>;
};

/** Types */
type Step = {
  id: number;
  title: string;
  checked: boolean;
};

type Task = {
  id: string;
  title: string;
  date: string;
  highlight?: boolean;
  checkbox?: boolean;
  steps?: Step[];
};

type StepRowProps = {
  item: Step;
  taskId: string;
  dispatch: Dispatch<any>;
};

/** Stateless, memoized row to avoid re-renders/flicker */
const StepRow = React.memo(({ item, taskId, dispatch }: StepRowProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localText, setLocalText] = useState(item.title);
  const [menuVisible, setMenuVisible] = useState<boolean>(false);

  useEffect(() => {
    if (!isEditing) setLocalText(item.title);
  }, [item.title, isEditing]);

  const handleBlur = useCallback(() => {
    const trimmed = localText.trim();
    if (trimmed && trimmed !== item.title) {
      dispatch(editStepTitle({ taskId, stepId: item.id, title: trimmed }));
      setLocalText(trimmed);
    }
    setIsEditing(false);
  }, [localText, item.title, item.id, taskId, dispatch]);

  const handleToggle = useCallback(() => {
    dispatch(toggleStepCheck({ taskId, stepId: item.id }));
  }, [taskId, item.id, dispatch]);

  const handleDelete = useCallback(() => {
    dispatch(deleteStep({ taskId, stepId: item.id }));
  }, [dispatch, taskId, item.id]);

  const handlePromote = useCallback(() => {
    dispatch(promoteStepToTask({ taskId, stepId: item.id }));
  }, [dispatch, taskId, item.id]);

  return (
    <View style={styles.stepRow}>
      <Checkbox
        color={colors.accent}
        value={item.checked}
        onValueChange={handleToggle}
      />

      {isEditing ? (
        <TextInput
          value={localText}
          onChangeText={setLocalText}
          onBlur={handleBlur}
          autoFocus
          style={styles.input}
          placeholder="Edit step..."
          placeholderTextColor={colors.textSecondary}
        />
      ) : (
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => setIsEditing(true)}
        >
          <Text
            style={[
              styles.stepText,
              item.checked && { textDecorationLine: "line-through" },
            ]}
          >
            {item.title}
          </Text>
        </TouchableOpacity>
      )}

      <Menu>
        <MenuTrigger
          customStyles={{
            TriggerTouchableComponent: TouchableOpacity,
            triggerWrapper: { padding: 6 },
          }}
        >
          <Ionicons name="ellipsis-vertical" size={18} color="gray" />
        </MenuTrigger>

        <MenuOptions>
          <MenuOption onSelect={handleDelete}>
            <Text>Delete Step</Text>
          </MenuOption>
          <MenuOption onSelect={handlePromote}>
            <Text>Promote to Task</Text>
          </MenuOption>
        </MenuOptions>
      </Menu>
    </View>
  );
});
StepRow.displayName = "StepRow";

/** Screen */
export default function TaskDetails() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { taskId } = route.params as { taskId: string };
  const dispatch = useDispatch();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [showReminderPopup, setShowReminderPopup] = useState(false);
  const [reminderMessage, setReminderMessage] = useState("");
  const [now, setNow] = useState<number>(() => Date.now());
  const [selected, setSelected] = useState<{
    type: string;
    time: number;
  } | null>(null);

  const task = useSelector((state: RootState) =>
    state.tasks.tasks.find((t) => t.id === taskId)
  );

  if (!task) {
    return (
      <View style={styles.container}>
        <Text>Task not found</Text>
      </View>
    );
  }

  const steps: Step[] = task.steps || [];
  const [localTitle, setLocalTitle] = useState(task.title);
  const renderItem = useCallback<ListRenderItem<Step>>(
    ({ item }) => <StepRow item={item} taskId={taskId} dispatch={dispatch} />,
    [dispatch, taskId]
  );

  useEffect(() => {
    setLocalTitle(task.title);
  }, [task.title]);

  const optionTimes = useMemo(() => {
    const base = now;
    return {
      later_today: base + 2 * 60 * 60 * 1000, // 2 hours
      tomorrow: base + 24 * 60 * 60 * 1000, // 24 hours
      next_week: base + 7 * 24 * 60 * 60 * 1000, // 7 days
    };
  }, [now]);

  function formatTime(epochMs: number) {
    const d = new Date(epochMs);
    // locale-sensitive short time (e.g. 3:42 PM)
    return new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "2-digit",
    }).format(d);
  }

  function formatRelative(fromNowMs: number) {
    const diff = Math.max(0, fromNowMs - now);
    const totalSeconds = Math.floor(diff / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    if (hours > 0) return `in ${hours}h ${minutes}m`;
    if (minutes > 0) return `in ${minutes}m`;
    return "now";
  }

  const handleReminderSelect = async (
    type: "later_today" | "tomorrow" | "next_week"
  ) => {
    const granted = await askNotificationPermission();
    if (!granted) {
      alert("Please enable notifications to use reminders");
      return;
    }

    // compute target time at the moment of click:
    let remindAt = Date.now();
    if (type === "later_today") remindAt += 2 * 60 * 60 * 1000; // 2 hours
    if (type === "tomorrow") remindAt += 24 * 60 * 60 * 1000;
    if (type === "next_week") remindAt += 7 * 24 * 60 * 60 * 1000;

    // persist chosen selection in UI
    setSelected({ type, time: remindAt });

    // schedule the actual reminder
    await scheduleReminder(remindAt, `Reminder: ${task.title}`);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerText}>Tasks</Text>
        </View>

        {/* Main Task */}
        <View style={styles.mainTask}>
          <TouchableOpacity onPress={() => dispatch(toggleCheckbox(taskId))}>
            <Checkbox
              color={colors.accent}
              value={!!task.checkbox}
              onValueChange={() => dispatch(toggleCheckbox(taskId))}
            />
          </TouchableOpacity>

          {isEditingTitle ? (
            <TextInput
              value={localTitle}
              onChangeText={setLocalTitle}
              onBlur={() => {
                const trimmed = localTitle.trim();
                if (trimmed && trimmed !== task.title) {
                  dispatch(editTaskTitle({ taskId, title: trimmed }));
                }
                setIsEditingTitle(false);
              }}
              autoFocus
              style={[
                styles.mainTitle,
                {
                  backgroundColor: colors.card,
                  paddingHorizontal: 8,
                  borderRadius: 6,
                },
              ]}
              placeholder="Edit task title..."
              placeholderTextColor={colors.textSecondary}
            />
          ) : (
            <TouchableOpacity
              onPress={() => setIsEditingTitle(true)}
              style={{ flex: 1 }}
            >
              <Text
                style={[
                  styles.mainTitle,
                  task.checkbox && {
                    textDecorationLine: "line-through",
                    opacity: 0.6,
                  },
                ]}
              >
                {task.title}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={() => dispatch(toggleHighlight(taskId))}>
            <Ionicons
              name={task.highlight ? "star" : "star-outline"}
              size={20}
              color={task.highlight ? colors.accent : colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* Steps List */}
        <FlatList
          data={steps}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          extraData={task.steps}
          removeClippedSubviews={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          ListFooterComponent={
            <TouchableOpacity
              style={styles.nextStepContainer}
              onPress={() => dispatch(addStep({ taskId }))}
            >
              <Text style={styles.nextStepText}>+ Next step</Text>
            </TouchableOpacity>
          }
        />

        {reminderMessage ? (
          <View
            style={{ position: "absolute", bottom: 80, left: 20, right: 20 }}
          >
            <Text
              style={{
                backgroundColor: colors.card,
                padding: 14,
                borderRadius: 10,
                color: "#fff",
                textAlign: "center",
                fontSize: 16,
              }}
            >
              {reminderMessage}
            </Text>
          </View>
        ) : null}

        {/* Options */}
        <View style={styles.options}>
          <Menu>
            <MenuTrigger
              customStyles={{
                TriggerTouchableComponent: TouchableOpacity,
                triggerWrapper: { flexDirection: "row", alignItems: "center" },
              }}
            >
              <View style={styles.optionRow}>
                <Ionicons
                  name="notifications-outline"
                  size={20}
                  color={colors.textPrimary}
                />
                <Text style={styles.optionText}>Remind me</Text>
              </View>
            </MenuTrigger>
            <MenuOptions
              customStyles={{ optionsContainer: styles.menuContainer }}
            >
              {/* LATER TODAY */}
              <MenuOption onSelect={() => handleReminderSelect("later_today")}>
                <View style={styles.menuRow}>
                  <Ionicons
                    name="time-outline"
                    size={18}
                    color={colors.textPrimary}
                    style={styles.menuIcon}
                  />
                  <View>
                    <Text style={styles.menuLabel}>Later today</Text>
                    <Text style={styles.menuSubLabel}>
                      {formatTime(optionTimes.later_today)} ·{" "}
                      {formatRelative(optionTimes.later_today)}
                    </Text>
                  </View>
                </View>
              </MenuOption>

              {/* TOMORROW */}
              <MenuOption onSelect={() => handleReminderSelect("tomorrow")}>
                <View style={styles.menuRow}>
                  <Ionicons
                    name="sunny-outline"
                    size={18}
                    color={colors.textPrimary}
                    style={styles.menuIcon}
                  />
                  <View>
                    <Text style={styles.menuLabel}>Tomorrow</Text>
                    <Text style={styles.menuSubLabel}>
                      {formatTime(optionTimes.tomorrow)} ·{" "}
                      {formatRelative(optionTimes.tomorrow)}
                    </Text>
                  </View>
                </View>
              </MenuOption>

              {/* NEXT WEEK */}
              <MenuOption onSelect={() => handleReminderSelect("next_week")}>
                <View style={styles.menuRow}>
                  <Ionicons
                    name="calendar-outline"
                    size={18}
                    color={colors.textPrimary}
                    style={styles.menuIcon}
                  />
                  <View>
                    <Text style={styles.menuLabel}>Next week</Text>
                    <Text style={styles.menuSubLabel}>
                      {formatTime(optionTimes.next_week)} ·{" "}
                      {formatRelative(optionTimes.next_week)}
                    </Text>
                  </View>
                </View>
              </MenuOption>
            </MenuOptions>
          </Menu>

          <TouchableOpacity style={styles.optionRow}>
            <Ionicons
              name="calendar-outline"
              size={20}
              color={colors.textPrimary}
            />
            <Text style={styles.optionText}>Add due date</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>Created on Wed, 12 Mar</Text>
      </View>
    </SafeAreaView>
  );
}

/** Styles */
const styles = StyleSheet.create({
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 8,
    justifyContent: "space-between",
  },

  stepTitle: {
    fontSize: 16,
    marginLeft: 6,
  },

  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 10,
  },
  mainTask: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  mainTitle: {
    flex: 1,
    textAlignVertical: "center",
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 10,
  },
  stepText: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 16,
    marginLeft: 10,
  },
  nextStepContainer: {
    marginTop: 10,
  },
  nextStepText: {
    color: colors.accent,
    fontSize: 16,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: colors.textPrimary,
    flex: 1,
    marginLeft: 10,
  },
  options: {
    borderTopWidth: 1,
    borderTopColor: colors.textSecondary,
    marginTop: 20,
    paddingTop: 20,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  optionText: {
    color: colors.textPrimary,
    fontSize: 16,
    marginLeft: 10,
  },
  footer: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: "center",
    marginTop: 30,
  },
  menuContainer: {
    backgroundColor: colors.card,
    padding: 10,
    borderRadius: 8,
    width: 220,
    marginTop: -40,
    zIndex: 9999,
    elevation: 20,
  },

  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },

  menuIcon: {
    marginRight: 10,
    color: colors.textPrimary, // white
  },

  menuLabel: {
    color: colors.textPrimary, // white
    fontSize: 15,
    fontWeight: "600",
  },

  menuSubLabel: {
    color: colors.textSecondary, // #999
    fontSize: 12,
    marginTop: 2,
  },
});
