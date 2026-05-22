"use client";

import { useMemo } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Calendar, Copy, Edit3, Plus, Trash2 } from "lucide-react";

import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import TaskCard from "@/components/tasks/task-card";
import { cn } from "@/lib/utils";

export default function CardColumn({ card, onOpenTask, onAddTask, onEditCard, onDeleteCard, onCopyCard, tasks }) {
  const containerId = `card-${card.id}`;
  const { setNodeRef, isOver } = useDroppable({
    id: containerId,
    data: {
      type: "card-container",
      containerId,
      cardId: card.id,
    },
  });

  const taskIds = useMemo(() => tasks.map((task) => `task-${task.id}`), [tasks]);
  const tagItems = (card.tags || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  return (
    <Card
      ref={setNodeRef}
      className={cn(
        "flex h-full min-w-[20rem] max-w-[20rem] flex-col overflow-hidden border border-white/70 p-4 transition",
        isOver && "ring-2 ring-orange-300",
      )}
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-orange-600/80">Board column</div>
            <h3 className="line-clamp-2 text-lg font-semibold tracking-tight text-slate-950">{card.card_name}</h3>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => onCopyCard(card)}>
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="sm" onClick={() => onEditCard(card)}>
              <Edit3 className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="sm" onClick={() => onDeleteCard(card)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-slate-500">
          {card.due_date ? (
            <Badge className="bg-orange-50 text-orange-700">
              <Calendar className="mr-1 h-3.5 w-3.5" />
              {card.due_date}
            </Badge>
          ) : null}
          {tagItems.map((tag) => (
            <Badge key={tag} className="bg-slate-100 text-slate-700">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <div className="mt-4 flex min-h-0 flex-1 flex-col rounded-3xl border border-dashed border-orange-200/80 bg-orange-50/40 p-3">
        <Button variant="ghost" size="sm" className="mb-3 self-start" onClick={() => onAddTask(card)}>
          <Plus className="h-4 w-4" />
          Add task
        </Button>

        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          <div className="thin-scrollbar flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-1">
            {tasks.length ? (
              tasks.map((task) => <TaskCard key={task.id} task={task} containerId={containerId} onOpen={onOpenTask} />)
            ) : (
              <div className="flex flex-1 items-center justify-center rounded-[22px] border border-dashed border-orange-200 bg-white/60 px-4 py-8 text-center text-sm text-slate-500">
                Drop tasks here or create one from the sidebar.
              </div>
            )}
          </div>
        </SortableContext>
      </div>
    </Card>
  );
}