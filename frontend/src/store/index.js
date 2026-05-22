import { configureStore } from "@reduxjs/toolkit";

import authReducer from "@/store/slices/auth-slice";
import cardsReducer from "@/store/slices/cards-slice";
import tasksReducer from "@/store/slices/tasks-slice";
import usersReducer from "@/store/slices/users-slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cards: cardsReducer,
    tasks: tasksReducer,
    users: usersReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});