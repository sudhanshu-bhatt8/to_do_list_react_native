import { Stack } from "expo-router";
import React from "react";
import { MenuProvider } from "react-native-popup-menu";
import { Provider } from "react-redux";
import store from "../store";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <MenuProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </MenuProvider>
    </Provider>
  );
}
