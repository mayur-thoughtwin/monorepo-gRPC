import { z } from "zod";

// Task status enum
export const TaskStatus = z.enum(["pending", "inprogress", "completed"]);
export type TaskStatusType = z.infer<typeof TaskStatus>;

// Create task schema
export const createTaskSchema = z.object({
  body: z.object({
    title: z
      .string({ message: "Title is required" })
      .min(1, "Title is required")
      .max(200, "Title must not exceed 200 characters")
      .trim(),
    description: z
      .string({ message: "Description is required" })
      .min(1, "Description is required")
      .max(2000, "Description must not exceed 2000 characters")
      .trim(),
    status: TaskStatus.optional().default("pending"),
  }),
});

// Update task schema
export const updateTaskSchema = z.object({
  params: z.object({
    id: z
      .string({ message: "Task ID is required" })
      .regex(/^[a-fA-F0-9]{24}$/, "Invalid task ID format (must be a valid MongoDB ObjectId)"),
  }),
  body: z.object({
    title: z
      .string()
      .min(1, "Title cannot be empty")
      .max(200, "Title must not exceed 200 characters")
      .trim()
      .optional(),
    description: z
      .string()
      .min(1, "Description cannot be empty")
      .max(2000, "Description must not exceed 2000 characters")
      .trim()
      .optional(),
    status: TaskStatus.optional(),
  }).refine(
    (data) => data.title || data.description || data.status,
    { message: "At least one field (title, description, or status) must be provided for update" }
  ),
});

// Get task by ID params schema
export const getTaskParamsSchema = z.object({
  params: z.object({
    id: z
      .string({ message: "Task ID is required" })
      .regex(/^[a-fA-F0-9]{24}$/, "Invalid task ID format (must be a valid MongoDB ObjectId)"),
  }),
});

// Delete task params schema (same as get)
export const deleteTaskParamsSchema = getTaskParamsSchema;

// Export inferred types
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type GetTaskParamsInput = z.infer<typeof getTaskParamsSchema>;
