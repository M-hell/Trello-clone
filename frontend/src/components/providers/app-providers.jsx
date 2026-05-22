"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { Toaster } from "sonner";

import { clearStoredUser, readStoredUser, writeStoredUser } from "@/lib/storage";
import { store } from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { hydrateAuth, selectAuthUser } from "@/store/slices/auth-slice";

function AuthHydrator() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);

  useEffect(() => {
    dispatch(hydrateAuth(readStoredUser()));
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      writeStoredUser(user);
    } else {
      clearStoredUser();
    }
  }, [user]);

  return null;
}

export default function AppProviders({ children }) {
  return (
    <Provider store={store}>
      <AuthHydrator />
      {children}
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          style: {
            borderRadius: "16px",
            border: "1px solid rgba(255,255,255,0.6)",
            background: "rgba(255,255,255,0.92)",
            boxShadow: "0 24px 80px rgba(15, 23, 42, 0.12)",
          },
        }}
      />
    </Provider>
  );
}