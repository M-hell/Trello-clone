"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Input from "@/components/ui/input";
import { authSchemaForMode } from "@/lib/validation";

export default function AuthForm({ mode, onSubmit, loading, errorMessage }) {
  const schema = authSchemaForMode(mode);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    reset({ name: "", email: "", password: "" });
  }, [mode, reset]);

  return (
    <div className="mx-auto flex min-h-[100svh] w-full max-w-6xl items-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid w-full gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="flex flex-col justify-between rounded-[36px] border border-white/50 bg-gradient-to-br from-orange-500 via-orange-400 to-amber-400 px-8 py-8 text-white shadow-[0_32px_110px_rgba(249,115,22,0.28)] sm:px-10 sm:py-10 lg:min-h-[760px] lg:px-12 lg:py-12">
          <div className="max-w-xl space-y-6">
            <span className="inline-flex rounded-full border border-white/25 bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-white/90 backdrop-blur">
              Trello Flow
            </span>
            <div className="space-y-5">
              <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                A polished task platform built for fast-moving teams.
              </h1>
              <p className="max-w-lg text-base leading-7 text-white/85 sm:text-lg">
                Manage cards, assign work, and drag tasks across boards with a sleek enterprise interface designed around your backend.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["Cookie auth", "HttpOnly sessions with withCredentials."],
              ["Drag and drop", "Task movement across unassigned and card lanes."],
              ["Scalable UI", "Reusable, modular, production-minded patterns."],
            ].map(([title, detail]) => (
              <Card key={title} className="border-white/20 bg-white/12 px-4 py-4 text-white shadow-none backdrop-blur-sm">
                <p className="text-sm font-semibold">{title}</p>
                <p className="mt-1 text-sm leading-6 text-white/80">{detail}</p>
              </Card>
            ))}
          </div>
        </section>

        <Card className="flex flex-col justify-center px-6 py-7 sm:px-8 sm:py-8 lg:px-10">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h2>
            <p className="text-sm leading-6 text-slate-600">
              {mode === "login"
                ? "Sign in to continue to your board and session-based dashboard."
                : "Register once and the dashboard will load with the backend cookie session."}
            </p>
          </div>

          {mode === "login" ? (
            <div className="mt-6 rounded-2xl border border-dashed border-orange-200 bg-orange-50 px-4 py-4 text-sm text-slate-700">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-600">Demo credentials</p>
              <div className="mt-3 space-y-1">
                <p>
                  <span className="font-medium text-slate-900">Email:</span> samrat@gmail.com
                </p>
                <p>
                  <span className="font-medium text-slate-900">Password:</span> 123123123
                </p>
              </div>
            </div>
          ) : null}

          <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {mode === "register" ? (
              <Field label="Full name" error={errors.name?.message}>
                <Input placeholder="John Doe" {...register("name")} />
              </Field>
            ) : null}

            <Field label="Email address" error={errors.email?.message}>
              <Input type="email" placeholder="john@example.com" {...register("email")} />
            </Field>

            <Field label="Password" error={errors.password?.message}>
              <Input type="password" placeholder="••••••••" {...register("password")} />
            </Field>

            {errorMessage ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{errorMessage}</p> : null}

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
            </Button>
          </form>

          <p className="mt-6 text-sm text-slate-600">
            {mode === "login" ? "New here?" : "Already have an account?"}{" "}
            <Link href={mode === "login" ? "/register" : "/login"} className="font-semibold text-orange-600 hover:text-orange-700">
              {mode === "login" ? "Create one" : "Sign in"}
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {children}
      {error ? <span className="text-xs font-medium text-rose-600">{error}</span> : null}
    </label>
  );
}