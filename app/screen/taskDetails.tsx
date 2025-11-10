import { RootState } from "@/store";
import { addStep } from "@/store/tasksSlice";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import Checkbox from "expo-checkbox";
import { useNavigation } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import colors from "../style/colors";

export default function TaskDetails() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { taskId } = route.params;
  const dispatch = useDispatch();

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

  const [steps, setSteps] = useState(task.steps || []);

  React.useEffect(() => {
    setSteps(task.steps || []);
  }, [task.steps]);

  return (
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
        <Checkbox color={colors.accent} />
        <Text style={styles.mainTitle}>{task.title}</Text>
        <Ionicons name="star-outline" size={20} color={colors.accent} />
      </View>
      {/* Steps */}
      <FlatList
        data={steps}
        keyExtractor={(item) => item.id.toString()} // ensure id is string
        renderItem={({ item }) => (
          <View style={styles.stepRow}>
            <Checkbox color={colors.accent} value={item.checked} />
            <Text style={styles.stepText}>{item.title}</Text>
            <Ionicons
              name="ellipsis-vertical"
              size={18}
              color={colors.textSecondary}
            />
          </View>
        )}
        ListFooterComponent={
          <View style={styles.nextStepContainer}>
            <TouchableOpacity
              onPress={() => {
                dispatch(addStep({ taskId }));
              }}
            >
              <Text style={styles.nextStepText}>+ Next step</Text>
            </TouchableOpacity>
          </View>
        }
      />
      {/* Options */}
      <View style={styles.options}>
        <TouchableOpacity style={styles.optionRow}>
          <Ionicons
            name="notifications-outline"
            size={20}
            color={colors.textPrimary}
          />
          <Text style={styles.optionText}>Remind me</Text>
        </TouchableOpacity>

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
  );
}

const styles = StyleSheet.create({
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
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 10,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
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
  },
  options: {
    flex: 2,
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
});
