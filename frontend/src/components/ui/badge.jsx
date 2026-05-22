import { cn } from "@/lib/utils";

export default function Badge({ className, children }) {
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide", className)}>{children}</span>;
}