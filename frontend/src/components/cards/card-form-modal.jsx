"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Modal from "@/components/ui/modal";
import Textarea from "@/components/ui/textarea";
import { cardSchema } from "@/lib/validation";

export default function CardFormModal({ open, onClose, onSubmit, initialValues, loading, title }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      card_name: "",
      due_date: "",
      tags: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        card_name: initialValues?.card_name || "",
        due_date: initialValues?.due_date || "",
        tags: initialValues?.tags || "",
      });
    }
  }, [initialValues, open, reset]);

  return (
    <Modal open={open} title={title} description="Create or update a board column." onClose={onClose}>
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <Field label="Card title" error={errors.card_name?.message}>
          <Input placeholder="Sprint Planning" {...register("card_name")} />
        </Field>
        <Field label="Due date" error={errors.due_date?.message}>
          <Input type="date" {...register("due_date")} />
        </Field>
        <Field label="Tags" error={errors.tags?.message}>
          <Textarea placeholder="Design, Priority, Client" {...register("tags")} className="min-h-[96px]" />
        </Field>
        <div className="flex items-center justify-end gap-3">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save card"}
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