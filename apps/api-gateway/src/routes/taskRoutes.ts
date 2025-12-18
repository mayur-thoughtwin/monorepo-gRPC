import { Router } from "express";
import { taskController } from "../controllers/taskController";
import { authenticateToken } from "../middleware/authMiddleware";
import {
  validate,
  createTaskSchema,
  updateTaskSchema,
  getTaskParamsSchema,
  deleteTaskParamsSchema,
} from "../validation";

const router = Router();

// All task routes require authentication
router.use(authenticateToken);

// Create a new task
router.post("/", validate(createTaskSchema), taskController.createTask);

// Get all tasks for the authenticated user
router.get("/my-tasks", taskController.getMyTasks);

// Get all tasks (admin or public view)
router.get("/", taskController.getAllTasks);

// Get a specific task by ID
router.get("/:id", validate(getTaskParamsSchema), taskController.getTask);

// Update a task
router.put("/:id", validate(updateTaskSchema), taskController.updateTask);

// Delete a task
router.delete("/:id", validate(deleteTaskParamsSchema), taskController.deleteTask);

export default router;
