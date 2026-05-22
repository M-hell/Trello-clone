import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { fetchUsers as fetchUsersRequest } from "@/services/auth-service";

const initialState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchUsersThunk = createAsyncThunk("users/fetchUsers", async (_, { rejectWithValue }) => {
  try {
    return await fetchUsersRequest();
  } catch (error) {
    return rejectWithValue(error);
  }
});

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUsersThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload?.users || [];
      })
      .addCase(fetchUsersThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to fetch users.";
      });
  },
});

export const selectUsers = (state) => state.users.items;
export const selectUsersStatus = (state) => state.users.status;
export const selectUsersError = (state) => state.users.error;

export default usersSlice.reducer;