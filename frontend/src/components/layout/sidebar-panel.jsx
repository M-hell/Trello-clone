"use client";

import { Plus, Search } from "lucide-react";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Input from "@/components/ui/input";
import TaskCard from "@/components/tasks/task-card";

export default function SidebarPanel({ search, onSearch, onCreateTask, tasks, onOpenTask }) {
  const taskIds = tasks.map((task) => `task-${task.id}`);

  return (
    <div className="flex h-full flex-col gap-4 bg-transparent p-4">
      <Card className="border border-white/70 bg-white/85 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-600/80">Inbox</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">Unassigned tasks</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">Drag these into a board column or edit them from the sidebar.</p>
          </div>
          <Button variant="subtle" size="sm" onClick={onCreateTask}>
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>

        <label className="mt-4 block space-y-2">
          <span className="text-sm font-medium text-slate-700">Search</span>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Search title or description" className="pl-11" />
          </div>
        </label>
      </Card>

      <div className="min-h-0 flex-1 overflow-hidden rounded-[28px] border border-white/70 bg-white/75 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-900">Available items</p>
          <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-700">{tasks.length}</span>
        </div>

        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          <div className="thin-scrollbar flex h-[calc(100%-2rem)] flex-col gap-3 overflow-y-auto pr-1">
            {tasks.length ? (
              tasks.map((task) => <TaskCard key={task.id} task={task} containerId="unassigned" compact onOpen={onOpenTask} />)
            ) : (
              <div className="flex h-full items-center justify-center rounded-[22px] border border-dashed border-orange-200 bg-orange-50/60 px-4 py-10 text-center text-sm text-slate-500">
                No tasks match your search.
              </div>
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}