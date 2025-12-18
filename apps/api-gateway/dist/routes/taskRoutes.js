"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const taskController_1 = require("../controllers/taskController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const validation_1 = require("../validation");
const router = (0, express_1.Router)();
// All task routes require authentication
router.use(authMiddleware_1.authenticateToken);
// Create a new task
router.post("/", (0, validation_1.validate)(validation_1.createTaskSchema), taskController_1.taskController.createTask);
// Get all tasks for the authenticated user
router.get("/my-tasks", taskController_1.taskController.getMyTasks);
// Get all tasks (admin or public view)
router.get("/", taskController_1.taskController.getAllTasks);
// Get a specific task by ID
router.get("/:id", (0, validation_1.validate)(validation_1.getTaskParamsSchema), taskController_1.taskController.getTask);
// Update a task
router.put("/:id", (0, validation_1.validate)(validation_1.updateTaskSchema), taskController_1.taskController.updateTask);
// Delete a task
router.delete("/:id", (0, validation_1.validate)(validation_1.deleteTaskParamsSchema), taskController_1.taskController.deleteTask);
exports.default = router;
