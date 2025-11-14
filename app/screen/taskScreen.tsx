import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "expo-router";
import React, { useRef, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { RootStackParamList } from "../(tabs)";
import type { RootState } from "../../store";
import {
  addTask,
  deleteTask,
  toggleCheckbox,
  toggleHighlight,
} from "../../store/tasksSlice";
import FloatingButton from "../components/FloatingButton";
import TaskItem from "../components/taskItem";
import colors from "../style/colors";

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

  return (
    <KeyboardAvoidingView style={styles.container} behavior="height">
      <Text style={styles.header}>Tasks</Text>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem
            title={item.title}
            date={item.date}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  header: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
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
});
