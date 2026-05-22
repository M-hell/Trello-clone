import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";

import { loginUser, logoutUser, registerUser } from "@/services/auth-service";

const initialState = {
  user: null,
  status: "idle",
  error: null,
};

export const login = createAsyncThunk("auth/login", async (payload, { rejectWithValue }) => {
  try {
    return await loginUser(payload);
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const register = createAsyncThunk("auth/register", async (payload, { rejectWithValue }) => {
  try {
    return await registerUser(payload);
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const performLogout = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
  try {
    return await logoutUser();
  } catch (error) {
    return rejectWithValue(error);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    hydrateAuth(state, action) {
      state.user = action.payload || null;
      state.error = null;
      state.status = "idle";
    },
    clearAuthState(state) {
      state.user = null;
      state.error = null;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload?.user || null;
        state.error = null;
        toast.success(action.payload?.message || "Welcome back.");
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Login failed.";
      })
      .addCase(register.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload?.user || null;
        state.error = null;
        toast.success(action.payload?.message || "Account created.");
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Registration failed.";
      })
      .addCase(performLogout.fulfilled, (state, action) => {
        state.user = null;
        state.status = "idle";
        state.error = null;
        toast.success(action.payload?.message || "Logged out.");
      })
      .addCase(performLogout.rejected, (state, action) => {
        state.user = null;
        state.status = "idle";
        state.error = action.payload?.message || "Logout failed.";
      });
  },
});

export const { hydrateAuth, clearAuthState } = authSlice.actions;

export const selectAuthUser = (state) => state.auth.user;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;