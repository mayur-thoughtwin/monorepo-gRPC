import { Router } from "express";
import { taskController } from "../controllers/taskController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

// All task routes require authentication
router.use(authenticateToken);

// Create a new task
router.post("/", taskController.createTask);

// Get all tasks for the authenticated user
router.get("/my-tasks", taskController.getMyTasks);

// Get all tasks (admin or public view)
router.get("/", taskController.getAllTasks);

// Get a specific task by ID
router.get("/:id", taskController.getTask);

// Update a task
router.put("/:id", taskController.updateTask);

// Delete a task
router.delete("/:id", taskController.deleteTask);

export default router;
