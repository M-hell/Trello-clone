import { cn } from "@/lib/utils";

export default function Skeleton({ className }) {
  return <div className={cn("skeleton-shimmer rounded-2xl", className)} aria-hidden="true" />;
}