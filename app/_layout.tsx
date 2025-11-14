import { setInitialTasks } from "@/store/tasksSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { MenuProvider } from "react-native-popup-menu";
import { Provider } from "react-redux";
import store from "../store";

export default function RootLayout() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const saved = await AsyncStorage.getItem("tasks");
        if (saved) {
          const parsed = JSON.parse(saved);
          store.dispatch(setInitialTasks(parsed));
        }
      } catch (e) {
        console.warn("Failed to load tasks", e);
      }
      setLoading(false);
    };

    loadTasks();
  }, []);

  if (loading) return null; // or a splash screen

  return (
    <Provider store={store}>
      <MenuProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </MenuProvider>
    </Provider>
  );
}
