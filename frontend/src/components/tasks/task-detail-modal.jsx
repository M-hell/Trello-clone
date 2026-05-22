"use client";

import { Calendar, ExternalLink, FileText, Layers3 } from "lucide-react";

import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { TASK_STATUS_LOOKUP } from "@/constants/board";

export default function TaskDetailModal({ open, task, onClose, onEdit, onDelete, onDetach }) {
  if (!task) {
    return null;
  }

  const status = TASK_STATUS_LOOKUP[(task.status || "open").toLowerCase()] || TASK_STATUS_LOOKUP.open;

  return (
    <Modal open={open} title={task.task_title || "Task details"} description="Inspect the selected item and take action." onClose={onClose} size="md">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <Badge className={status.classes}>{status.label}</Badge>
          {task.card_id ? <Badge className="bg-slate-100 text-slate-700">Assigned</Badge> : <Badge className="bg-orange-50 text-orange-700">Unassigned</Badge>}
        </div>

        <div className="space-y-4 rounded-3xl border border-white/70 bg-white/80 p-5">
          <InfoRow icon={FileText} label="Description" value={task.task_description || "No description provided."} />
          <InfoRow
            icon={ExternalLink}
            label="File URL"
            value={task.task_file_url ? <a className="font-semibold text-orange-600 hover:text-orange-700" href={task.task_file_url} target="_blank" rel="noreferrer">Open file</a> : "No file attached."}
          />
          <InfoRow icon={Calendar} label="Updated" value={task.updated_at ? new Date(task.updated_at).toLocaleString() : "Unknown"} />
          <InfoRow icon={Layers3} label="Card" value={task.card_id ? `Card #${task.card_id}` : "Unassigned"} />
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3">
          {task.card_id ? <Button variant="subtle" onClick={() => onDetach(task)}>Unassign</Button> : null}
          <Button variant="secondary" onClick={() => onEdit(task)}>
            Edit
          </Button>
          <Button variant="danger" onClick={() => onDelete(task)}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="grid gap-2 sm:grid-cols-[9rem_1fr] sm:items-start">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
        <Icon className="h-4 w-4 text-orange-500" />
        {label}
      </div>
      <div className="text-sm leading-6 text-slate-600">{value}</div>
    </div>
  );
}