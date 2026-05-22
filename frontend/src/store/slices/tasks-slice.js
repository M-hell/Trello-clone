import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { createTask, detachTask, fetchAllTasks as fetchAllTasksRequest, fetchUnassignedTasks as fetchUnassignedTasksRequest, hardDeleteTask, updateTask } from "@/services/task-service";
import { fetchCards } from "@/store/slices/cards-slice";

const initialState = {
  unassigned: [],
  allItems: [],
  status: "idle",
  error: null,
};

export const fetchUnassignedTasks = createAsyncThunk("tasks/fetchUnassignedTasks", async (_, { rejectWithValue }) => {
  try {
    return await fetchUnassignedTasksRequest();
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const fetchAllTasks = createAsyncThunk("tasks/fetchAllTasks", async (_, { rejectWithValue }) => {
  try {
    return await fetchAllTasksRequest();
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const createTaskThunk = createAsyncThunk("tasks/createTask", async (payload, { dispatch, rejectWithValue }) => {
  try {
    const response = await createTask(payload);
    await Promise.all([dispatch(fetchUnassignedTasks()), dispatch(fetchAllTasks())]);
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const updateTaskThunk = createAsyncThunk("tasks/updateTask", async ({ taskId, payload }, { dispatch, rejectWithValue }) => {
  try {
    const response = await updateTask(taskId, payload);
    await Promise.all([dispatch(fetchCards()), dispatch(fetchUnassignedTasks()), dispatch(fetchAllTasks())]);
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const detachTaskThunk = createAsyncThunk("tasks/detachTask", async (taskId, { dispatch, rejectWithValue }) => {
  try {
    const response = await detachTask(taskId);
    await Promise.all([dispatch(fetchCards()), dispatch(fetchUnassignedTasks()), dispatch(fetchAllTasks())]);
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const hardDeleteTaskThunk = createAsyncThunk("tasks/hardDeleteTask", async (taskId, { dispatch, rejectWithValue }) => {
  try {
    const response = await hardDeleteTask(taskId);
    await Promise.all([dispatch(fetchCards()), dispatch(fetchUnassignedTasks()), dispatch(fetchAllTasks())]);
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUnassignedTasks.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUnassignedTasks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.unassigned = action.payload || [];
      })
      .addCase(fetchUnassignedTasks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to fetch tasks.";
      })
      .addCase(fetchAllTasks.fulfilled, (state, action) => {
        state.allItems = action.payload || [];
      });
  },
});

export const selectUnassignedTasks = (state) => state.tasks.unassigned;
export const selectAllTasks = (state) => state.tasks.allItems;
export const selectTasksStatus = (state) => state.tasks.status;
export const selectTasksError = (state) => state.tasks.error;

export default tasksSlice.reducer;