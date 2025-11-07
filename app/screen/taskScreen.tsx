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
import type { RootState } from "../../store";
import { addTask } from "../../store/tasksSlice";
import FloatingButton from "../components/FloatingButton";
import TaskItem from "../components/taskItem";
import colors from "../style/colors";

export default function TasksScreen() {
  const [showInput, setShowInput] = useState(false);
  const [task, setTask] = useState("");
  const dispatch = useDispatch();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const inputRef = useRef<TextInput>(null);

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

  return (
    <KeyboardAvoidingView style={styles.container} behavior="height">
      <Text style={styles.header}>Tasks</Text>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem title={item.title} date={item.date} />
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
