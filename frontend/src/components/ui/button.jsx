"use client";

import { cn } from "@/lib/utils";

export default function Button({ className, variant = "primary", size = "md", as: Component = "button", ...props }) {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 rounded-2xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-0 disabled:pointer-events-none disabled:opacity-60";

  const variants = {
    primary: "bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-500/25",
    secondary: "border border-white/60 bg-white/70 text-slate-800 hover:bg-white",
    ghost: "bg-transparent text-slate-700 hover:bg-orange-50",
    danger: "bg-rose-500 text-white hover:bg-rose-600",
    subtle: "bg-orange-50 text-orange-700 hover:bg-orange-100",
  };

  const sizes = {
    sm: "h-9 px-3",
    md: "h-11 px-4",
    lg: "h-12 px-5",
  };

  return <Component className={cn(baseClasses, variants[variant], sizes[size], className)} {...props} />;
}