import Card from "@/components/ui/card";

export default function EmptyState({ title, description, action }) {
  return (
    <Card className="flex flex-col items-center justify-center gap-3 px-6 py-10 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
        <span className="text-2xl">◎</span>
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        <p className="max-w-sm text-sm leading-6 text-slate-600">{description}</p>
      </div>
      {action}
    </Card>
  );
}