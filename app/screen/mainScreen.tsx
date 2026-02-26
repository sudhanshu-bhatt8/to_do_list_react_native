import { RootState } from "@/store";
import { Task } from "@/store/tasksSlice";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { RootStackParamList } from "../(tabs)";
import { getTaskDate } from "./taskScreen";
type IoniconName = React.ComponentProps<typeof Ionicons>["name"];
type NavigationProp = StackNavigationProp<RootStackParamList>;

export const isRepeatingTask = (task: Task) => {
  return task.repeat && task.repeat !== "none";
};
export default function MainScreen() {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const imptask = tasks.filter((t) => t.highlight === true);
  const plannedTasks = tasks.filter((task) => getTaskDate(task));
  const today = new Date();
  /* -------------------- My Day -------------------- */
  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(startOfDay.getDate() + 1);

  const myDayTasks = tasks.filter((task) => {
    const d = getTaskDate(task);
    return (d && d >= startOfDay && d < endOfDay) || isRepeatingTask(task);
  });

  const menuItems: {
    label: string;
    icon: IoniconName;
    rightValue?: string;
    navigate?: keyof RootStackParamList;
    mode?: "all" | "important" | "planning" | "myDay";
  }[] = [
    {
      label: "My Day",
      icon: "sunny-outline",
      navigate: "taskScreen",
      mode: "myDay",
      rightValue: myDayTasks.length.toString(),
    },
    {
      label: "Important",
      icon: "star-outline",
      navigate: "taskScreen",
      mode: "important",
      rightValue: imptask.length.toString(),
    },
    {
      label: "Planned",
      icon: "calendar-outline",
      navigate: "taskScreen",
      mode: "planning",
      rightValue: plannedTasks.length.toString(),
    },
    // { label: "Assigned to me", icon: "person-outline" },
    {
      label: "Tasks",
      icon: "home-outline",
      rightValue: tasks.length.toString(),
      navigate: "taskScreen",
      mode: "all",
    },
  ];
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>SB</Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.name}>sudhanshu bhatt</Text>
            <Text style={styles.email}>sudhanshubhatt8@gmail.com</Text>
          </View>

          <Ionicons name="chevron-down-outline" size={22} color="#ccc" />
        </View>

        {/* Menu Items */}
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => {
              if (item.navigate === "taskScreen") {
                navigation.navigate("taskScreen", { mode: item.mode });
              } else if (item.navigate) {
                navigation.navigate(item.navigate as any);
              }
            }}
          >
            <View style={styles.menuLeft}>
              <Ionicons name={item.icon} size={22} color="#bafae6" />
              <Text style={styles.menuText}>{item.label}</Text>
            </View>

            {item.rightValue && (
              <Text style={styles.menuRight}>{item.rightValue}</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* New List */}
      {/* <TouchableOpacity style={styles.newListBtn}>
        <Ionicons name="add-outline" size={22} color="#fff" />
        <Text style={styles.newListText}>New list</Text>
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d0d0d",
    paddingTop: 40,
    paddingHorizontal: 16,
  },

  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },

  avatar: {
    width: 45,
    height: 45,
    borderRadius: 30,
    backgroundColor: "#5b4bff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  avatarText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  name: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  email: {
    color: "#888",
    fontSize: 14,
  },

  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
  },

  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  menuText: {
    color: "#eee",
    fontSize: 17,
    marginLeft: 12,
  },

  menuRight: {
    color: "#888",
    fontSize: 16,
  },

  newListBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    borderTopWidth: 1,
    borderColor: "#222",
    marginTop: 10,
  },

  newListText: {
    color: "#eee",
    fontSize: 17,
    marginLeft: 8,
  },
});
