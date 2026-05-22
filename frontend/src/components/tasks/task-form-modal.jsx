"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Modal from "@/components/ui/modal";
import Textarea from "@/components/ui/textarea";
import { TASK_STATUS_OPTIONS } from "@/constants/board";
import { taskSchema } from "@/lib/validation";

export default function TaskFormModal({ open, onClose, onSubmit, initialValues, loading, title, description }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      task_title: "",
      task_description: "",
      task_file_url: "",
      status: "open",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        task_title: initialValues?.task_title || "",
        task_description: initialValues?.task_description || "",
        task_file_url: initialValues?.task_file_url || "",
        status: initialValues?.status || "open",
      });
    }
  }, [initialValues, open, reset]);

  return (
    <Modal open={open} title={title} description={description} onClose={onClose} size="lg">
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <Field label="Task title" error={errors.task_title?.message}>
          <Input placeholder="Review wireframes" {...register("task_title")} />
        </Field>
        <Field label="Description" error={errors.task_description?.message}>
          <Textarea placeholder="Add context, links, and acceptance notes." {...register("task_description")} />
        </Field>
        <Field label="File URL" error={errors.task_file_url?.message}>
          <Input placeholder="https://..." {...register("task_file_url")} />
        </Field>
        <Field label="Status" error={errors.status?.message}>
          <select
            className="h-11 w-full rounded-2xl border border-white/70 bg-white/85 px-4 text-sm text-slate-900 shadow-sm shadow-orange-500/5 focus:border-orange-300 focus:outline-none focus:ring-4 focus:ring-orange-200/60"
            {...register("status")}
          >
            {TASK_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>
        <div className="flex items-center justify-end gap-3">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save task"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {children}
      {error ? <span className="text-xs font-medium text-rose-600">{error}</span> : null}
    </label>
  );
}