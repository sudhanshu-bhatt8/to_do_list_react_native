import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import TaskDetails from "../screen/taskDetails";
import TasksScreen from "../screen/taskScreen";

const Stack = createStackNavigator();
export type RootStackParamList = {
  Home: undefined;
  TaskDetails: { taskId: string };
};

export default function HomeNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={TasksScreen} />
      <Stack.Screen name="TaskDetails" component={TaskDetails} />
    </Stack.Navigator>
  );
}
