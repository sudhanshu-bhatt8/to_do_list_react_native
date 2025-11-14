// store.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  configureStore,
  createListenerMiddleware,
  TypedStartListening,
} from "@reduxjs/toolkit";
import tasksReducer from "./tasksSlice";

// 1) create the listener middleware first
const listenerMiddleware = createListenerMiddleware();

// 2) create the store and include listenerMiddleware.middleware correctly
export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
  },
  middleware: (getDefaultMiddleware) =>
    // keep the default middleware tuple (includes thunk) and concat our listener
    getDefaultMiddleware().concat(listenerMiddleware.middleware),
});

// 3) derive types AFTER store creation
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// 4) strongly type startListening
export const startAppListening =
  listenerMiddleware.startListening as TypedStartListening<
    RootState,
    AppDispatch
  >;

// 5) now use startAppListening to persist tasks to AsyncStorage
startAppListening({
  // only when tasks array reference changes
  predicate: (action, currentState, previousState) =>
    currentState.tasks.tasks !== previousState.tasks.tasks,
  effect: async (action, listenerApi) => {
    try {
      const tasks = listenerApi.getState().tasks.tasks;
      await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
    } catch (e) {
      // optionally log errors
      console.warn("Failed to persist tasks to AsyncStorage", e);
    }
  },
});

export default store;
