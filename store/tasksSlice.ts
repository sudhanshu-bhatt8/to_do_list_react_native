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
  remindAt?: number;
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

    editTaskTitle: (
      state,
      action: PayloadAction<{ taskId: string; title: string }>
    ) => {
      const { taskId, title } = action.payload;
      const task = state.tasks.find((t) => t.id === taskId);
      if (task) task.title = title;
    },

    toggleStepCheck: (
      state,
      action: PayloadAction<{ taskId: string; stepId: number }>
    ) => {
      const task = state.tasks.find((t) => t.id === action.payload.taskId);
      if (!task || !task.steps) return;
      const step = task.steps.find((s) => s.id === action.payload.stepId);
      if (step) step.checked = !step.checked;
    },

    editStepTitle: (
      state,
      action: PayloadAction<{ taskId: string; stepId: number; title: string }>
    ) => {
      const task = state.tasks.find((t) => t.id === action.payload.taskId);
      if (!task || !task.steps) return;

      // ✅ new array reference → triggers React re-render
      task.steps = task.steps.map((s) =>
        s.id === action.payload.stepId
          ? { ...s, title: action.payload.title }
          : s
      );
    },

    deleteStep: (
      state,
      action: PayloadAction<{ taskId: string; stepId: number }>
    ) => {
      const { taskId, stepId } = action.payload;
      const task = state.tasks.find((t) => t.id === taskId);

      if (!task || !task.steps) return;

      // remove the step
      task.steps = task.steps.filter((s) => s.id !== stepId);
    },

    promoteStepToTask: (
      state,
      action: PayloadAction<{ taskId: string; stepId: number }>
    ) => {
      const { taskId, stepId } = action.payload;

      const task = state.tasks.find((t) => t.id === taskId);
      if (!task || !task.steps) return;

      const step = task.steps.find((s) => s.id === stepId);
      if (!step) return;

      // Create a new task from the step
      const newTaskId = (state.tasks.length + 1).toString();

      state.tasks.push({
        id: newTaskId,
        title: step.title,
        date: new Date().toLocaleDateString(),
        highlight: false,
        checkbox: false,
        steps: [],
      });

      // Remove from the old task
      task.steps = task.steps.filter((s) => s.id !== stepId);
    },

    addReminder: (
      state,
      action: PayloadAction<{ taskId: string; remindAt: number }>
    ) => {
      const task = state.tasks.find((t) => t.id === action.payload.taskId);
      if (task) {
        task.remindAt = action.payload.remindAt; // store timestamp
      }
    },
  },
});
export const {
  addTask,
  toggleHighlight,
  toggleCheckbox,
  addStep,
  editStepTitle,
  toggleStepCheck,
  promoteStepToTask,
  deleteStep,
  editTaskTitle,
  addReminder,
} = tasksSlice.actions;
export default tasksSlice.reducer;
