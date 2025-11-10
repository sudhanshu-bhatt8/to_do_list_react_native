import { Stack } from "expo-router";
import React from "react";
import { Provider } from "react-redux";
import store from "../store";

export default function RootLayout() {
  return (
    <Provider store={store}>
      {/* Hide the default header — the app renders its own header inside screens */}
      <Stack screenOptions={{ headerShown: false }} />
    </Provider>
  );
}
