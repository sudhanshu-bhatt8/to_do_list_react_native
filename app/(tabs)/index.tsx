import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import MainScreen from "../screen/mainScreen";
import TaskDetails from "../screen/taskDetails";
import TasksScreen from "../screen/taskScreen";

const Stack = createStackNavigator();
export type RootStackParamList = {
  Home: undefined;
  taskScreen: { mode?: "all" | "important" | "planning" | "myDay" } | undefined;
  TaskDetails: { taskId: string };
};

export default function HomeNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={MainScreen} />
      <Stack.Screen name="taskScreen" component={TasksScreen} />
      <Stack.Screen name="TaskDetails" component={TaskDetails} />
      <Stack.Screen name="Planning" component={TaskDetails} />
      <Stack.Screen name="myDay" component={TaskDetails} />
    </Stack.Navigator>
  );
}
