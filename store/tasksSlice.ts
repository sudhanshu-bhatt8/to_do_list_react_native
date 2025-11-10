import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Step = {
  id: number;
  title: string;
  checked: boolean;
};

type Task = {
  id: string;
  title: string;
  date: string;
  highlight?: boolean;
  checkbox?: boolean;
  steps?: Step[];
};

type TasksState = {
  tasks: Task[];
};

const initialState: TasksState = {
  tasks: [
    {
      id: "1",
      title: "Complete UI design",
      date: "Today",
      highlight: false,
      checkbox: false,
      steps: [{ id: 1, title: "Step 1", checked: true }],
    },
  ],
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
        highlight: false,
        checkbox: false,
        steps: [],
      });
    },

    toggleHighlight: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find((t) => t.id === action.payload);
      if (task) task.highlight = !task.highlight;
    },

    toggleCheckbox: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find((t) => t.id === action.payload);
      if (task) task.checkbox = !task.checkbox;
    },

    addStep: (state, action: PayloadAction<{ taskId: string }>) => {
      const task = state.tasks.find((t) => t.id === action.payload.taskId);

      if (task) {
        const newStepId = (task.steps?.length || 0) + 1;
        const newStep = {
          id: newStepId,
          title: ` step ${newStepId}`,
          checked: false,
        };
        if (!task.steps) task.steps = [];
        task.steps.push(newStep);
      }
    },
  },
});

export const { addTask, toggleHighlight, toggleCheckbox, addStep } =
  tasksSlice.actions;
export default tasksSlice.reducer;
