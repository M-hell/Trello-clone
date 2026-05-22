"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import AuthForm from "@/components/auth/auth-form";
import { register, selectAuthError, selectAuthStatus, selectAuthUser } from "@/store/slices/auth-slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  const status = useAppSelector(selectAuthStatus);
  const error = useAppSelector(selectAuthError);

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [router, user]);

  const handleSubmit = async (values) => {
    const result = await dispatch(register(values));
    if (register.fulfilled.match(result)) {
      router.replace("/dashboard");
    }
  };

  return <AuthForm mode="register" onSubmit={handleSubmit} loading={status === "loading"} errorMessage={error} />;
}