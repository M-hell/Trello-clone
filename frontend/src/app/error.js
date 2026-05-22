"use client";

import Button from "@/components/ui/button";

export default function GlobalError({ error, reset }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="glass-panel max-w-xl rounded-[32px] p-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-600">Application error</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">Something went wrong.</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">{error?.message || "The dashboard could not load. Retry to recover the current route."}</p>
        <div className="mt-6 flex justify-center gap-3">
          <Button variant="secondary" onClick={() => window.location.assign("/dashboard")}>
            Go to dashboard
          </Button>
          <Button onClick={() => reset()}>Retry</Button>
        </div>
      </div>
    </div>
  );
}