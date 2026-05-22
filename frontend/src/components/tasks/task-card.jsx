"use client";

import { memo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { EllipsisVertical, GripVertical, Link2, SquareCheckBig } from "lucide-react";

import Badge from "@/components/ui/badge";
import Card from "@/components/ui/card";
import { TASK_STATUS_LOOKUP } from "@/constants/board";
import { cn } from "@/lib/utils";

function TaskCard({ task, containerId, compact = false, onOpen }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `task-${task.id}`,
    data: {
      type: "task",
      task,
      containerId,
    },
  });

  const status = TASK_STATUS_LOOKUP[(task.status || "open").toLowerCase()] || TASK_STATUS_LOOKUP.open;

  return (
    <Card
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={cn(
        "group cursor-grab border border-white/70 p-4 shadow-[0_18px_44px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_28px_60px_rgba(15,23,42,0.12)] active:cursor-grabbing",
        isDragging && "rotate-1 scale-[0.99] opacity-70",
        compact && "p-3",
      )}
      onClick={() => onOpen(task)}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={status.classes}>{status.label}</Badge>
            {task.card_id ? <Badge className="bg-slate-100 text-slate-700">Assigned</Badge> : <Badge className="bg-orange-50 text-orange-700">Unassigned</Badge>}
          </div>
          <h4 className="line-clamp-2 text-sm font-semibold leading-6 text-slate-950">{task.task_title || "Untitled task"}</h4>
          {task.task_description ? <p className="line-clamp-2 text-sm leading-6 text-slate-600">{task.task_description}</p> : null}
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <GripVertical className="h-4 w-4" />
          <EllipsisVertical className="h-4 w-4 opacity-0 transition group-hover:opacity-100" />
        </div>
      </div>

      {task.task_file_url ? (
        <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-orange-600">
          <Link2 className="h-3.5 w-3.5" />
          Attachment
        </div>
      ) : null}

      <div className="mt-4 flex items-center justify-between gap-2 text-xs text-slate-500">
        <span>{task.updated_at ? new Date(task.updated_at).toLocaleDateString() : "Recently updated"}</span>
        {task.status?.toLowerCase() === "done" ? <SquareCheckBig className="h-4 w-4 text-emerald-500" /> : null}
      </div>
    </Card>
  );
}

export default memo(TaskCard);