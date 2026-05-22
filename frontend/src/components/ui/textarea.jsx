"use client";

import { forwardRef } from "react";

import { cn } from "@/lib/utils";

const Textarea = forwardRef(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(
        "min-h-[120px] w-full rounded-2xl border border-white/70 bg-white/85 px-4 py-3 text-sm text-slate-900 shadow-sm shadow-orange-500/5 placeholder:text-slate-400 focus:border-orange-300 focus:outline-none focus:ring-4 focus:ring-orange-200/60",
        className,
      )}
      {...props}
    />
  );
});

export default Textarea;