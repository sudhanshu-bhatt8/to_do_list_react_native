import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useEffect } from "react";
import { RootStackParamList } from "../(tabs)";

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function PlanningScreen() {
  const navigation = useNavigation<NavigationProp>();

  // redirect immediately to TasksScreen with mode="important"
  useEffect(() => {
    navigation.replace("taskScreen", { mode: "planning" });
  }, []);

  return null; // nothing to render
}
