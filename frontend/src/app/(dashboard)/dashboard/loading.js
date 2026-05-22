import Skeleton from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-5 px-1 py-2">
      <Skeleton className="h-16 w-full rounded-[28px]" />
      <div className="flex gap-4 overflow-x-auto">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="min-w-[20rem] rounded-[28px] border border-white/70 bg-white/80 p-4">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="mt-4 h-64 w-full rounded-[22px]" />
          </div>
        ))}
      </div>
    </div>
  );
}