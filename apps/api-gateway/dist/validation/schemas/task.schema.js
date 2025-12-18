"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTaskParamsSchema = exports.getTaskParamsSchema = exports.updateTaskSchema = exports.createTaskSchema = exports.TaskStatus = void 0;
const zod_1 = require("zod");
// Task status enum
exports.TaskStatus = zod_1.z.enum(["pending", "inprogress", "completed"]);
// Create task schema
exports.createTaskSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z
            .string({ message: "Title is required" })
            .min(1, "Title is required")
            .max(200, "Title must not exceed 200 characters")
            .trim(),
        description: zod_1.z
            .string({ message: "Description is required" })
            .min(1, "Description is required")
            .max(2000, "Description must not exceed 2000 characters")
            .trim(),
        status: exports.TaskStatus.optional().default("pending"),
    }),
});
// Update task schema
exports.updateTaskSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z
            .string({ message: "Task ID is required" })
            .regex(/^[a-fA-F0-9]{24}$/, "Invalid task ID format (must be a valid MongoDB ObjectId)"),
    }),
    body: zod_1.z.object({
        title: zod_1.z
            .string()
            .min(1, "Title cannot be empty")
            .max(200, "Title must not exceed 200 characters")
            .trim()
            .optional(),
        description: zod_1.z
            .string()
            .min(1, "Description cannot be empty")
            .max(2000, "Description must not exceed 2000 characters")
            .trim()
            .optional(),
        status: exports.TaskStatus.optional(),
    }).refine((data) => data.title || data.description || data.status, { message: "At least one field (title, description, or status) must be provided for update" }),
});
// Get task by ID params schema
exports.getTaskParamsSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z
            .string({ message: "Task ID is required" })
            .regex(/^[a-fA-F0-9]{24}$/, "Invalid task ID format (must be a valid MongoDB ObjectId)"),
    }),
});
// Delete task params schema (same as get)
exports.deleteTaskParamsSchema = exports.getTaskParamsSchema;
