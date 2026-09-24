import { z } from "zod";

export const createTaskSchema = z.strictObject({
  title: z
    .string()
    .trim()
    .min(1, "Task title is required")
    .max(200, "Task title must be 200 characters or less"),

  priority: z.enum(["low", "medium", "high"]),
});

export const updateTaskSchema = z
  .strictObject({
    title: z
      .string()
      .trim()
      .min(1, "Task title cannot be empty")
      .max(200, "Task title must be 200 characters or less")
      .optional(),

    priority: z.enum(["low", "medium", "high"]).optional(),

    status: z.enum(["todo", "in-progress", "done"]).optional(),
  })
  .refine(
    (data) =>
      data.title !== undefined ||
      data.priority !== undefined ||
      data.status !== undefined,
    {
      message: "At least one field must be provided",
    },
  );
