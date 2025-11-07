import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Task = {
  id: string;
  title: string;
  date: string;
};

type TasksState = {
  tasks: Task[];
};

const initialState: TasksState = {
  tasks: [{ id: "1", title: "Complete UI design", date: "Today" }],
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<{ title: string }>) => {
      const id = String(state.tasks.length + 1);
      state.tasks.push({
        id,
        title: action.payload.title,
        date: new Date().toLocaleDateString(),
      });
    },
    // future reducers (remove, toggle, edit) can be added here
  },
});

export const { addTask } = tasksSlice.actions;
export default tasksSlice.reducer;
