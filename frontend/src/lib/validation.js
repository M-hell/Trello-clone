import { z } from "zod";

export function authSchemaForMode(mode) {
  const base = {
    email: z.string().email("Enter a valid email address."),
    password: z.string().min(6, "Password must be at least 6 characters."),
  };

  if (mode === "register") {
    return z.object({
      name: z.string().min(2, "Name must be at least 2 characters."),
      ...base,
    });
  }

  return z.object(base);
}

export const cardSchema = z.object({
  card_name: z.string().min(2, "Card name is required."),
  due_date: z.string().optional().or(z.literal("")),
  tags: z.string().optional().or(z.literal("")),
});

export const taskSchema = z.object({
  task_title: z.string().min(2, "Task title is required."),
  task_description: z.string().optional().or(z.literal("")),
  task_file_url: z.string().url("Enter a valid URL.").optional().or(z.literal("")),
  status: z.string().optional(),
});