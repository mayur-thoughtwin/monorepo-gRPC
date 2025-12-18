import { Request, Response } from "express";
import { taskService } from "../services/taskService";
import { CreateTaskInput, UpdateTaskInput, GetTaskParamsInput } from "../validation";

export const taskController = {
  createTask: async (req: Request, res: Response) => {
    try {
      // Request body is already validated by zod middleware
      const { title, description, status } = req.body as CreateTaskInput["body"];
      const author = (req as any).user?.userId;

      if (!author) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      const result = await taskService.createTask({
        title,
        description,
        author,
        status: status || "pending",
      });

      res.status(201).json(result);
    } catch (error) {
      console.error("Create task error:", error);
      res.status(500).json({ error: "Failed to create task" });
    }
  },

  getTask: async (req: Request, res: Response) => {
    try {
      // Params are already validated by zod middleware
      const { id } = req.params as GetTaskParamsInput["params"];
      const task = await taskService.getTask(id);
      res.json(task);
    } catch (error) {
      console.error("Get task error:", error);
      res.status(500).json({ error: "Failed to fetch task" });
    }
  },

  getMyTasks: async (req: Request, res: Response) => {
    try {
      const authorId = (req as any).user?.userId;

      if (!authorId) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      const result = await taskService.getTasksByAuthor(authorId);
      res.json(result);
    } catch (error) {
      console.error("Get my tasks error:", error);
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  },

  getAllTasks: async (req: Request, res: Response) => {
    try {
      const result = await taskService.getAllTasks();
      res.json(result);
    } catch (error) {
      console.error("Get all tasks error:", error);
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  },

  updateTask: async (req: Request, res: Response) => {
    try {
      // Params and body are already validated by zod middleware
      const { id } = req.params as UpdateTaskInput["params"];
      const { title, description, status } = req.body as UpdateTaskInput["body"];

      const result = await taskService.updateTask({
        id,
        title,
        description,
        status,
      });

      res.json(result);
    } catch (error) {
      console.error("Update task error:", error);
      res.status(500).json({ error: "Failed to update task" });
    }
  },

  deleteTask: async (req: Request, res: Response) => {
    try {
      // Params are already validated by zod middleware
      const { id } = req.params as GetTaskParamsInput["params"];
      const result = await taskService.deleteTask(id);
      res.json(result);
    } catch (error) {
      console.error("Delete task error:", error);
      res.status(500).json({ error: "Failed to delete task" });
    }
  },
};
