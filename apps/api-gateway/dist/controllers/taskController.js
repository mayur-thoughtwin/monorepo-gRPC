"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskController = void 0;
const taskService_1 = require("../services/taskService");
exports.taskController = {
    createTask: async (req, res) => {
        try {
            // Request body is already validated by zod middleware
            const { title, description, status } = req.body;
            const author = req.user?.userId;
            if (!author) {
                return res.status(401).json({ error: "User not authenticated" });
            }
            const result = await taskService_1.taskService.createTask({
                title,
                description,
                author,
                status: status || "pending",
            });
            res.status(201).json(result);
        }
        catch (error) {
            console.error("Create task error:", error);
            res.status(500).json({ error: "Failed to create task" });
        }
    },
    getTask: async (req, res) => {
        try {
            // Params are already validated by zod middleware
            const { id } = req.params;
            const task = await taskService_1.taskService.getTask(id);
            res.json(task);
        }
        catch (error) {
            console.error("Get task error:", error);
            res.status(500).json({ error: "Failed to fetch task" });
        }
    },
    getMyTasks: async (req, res) => {
        try {
            const authorId = req.user?.userId;
            if (!authorId) {
                return res.status(401).json({ error: "User not authenticated" });
            }
            const result = await taskService_1.taskService.getTasksByAuthor(authorId);
            res.json(result);
        }
        catch (error) {
            console.error("Get my tasks error:", error);
            res.status(500).json({ error: "Failed to fetch tasks" });
        }
    },
    getAllTasks: async (req, res) => {
        try {
            const result = await taskService_1.taskService.getAllTasks();
            res.json(result);
        }
        catch (error) {
            console.error("Get all tasks error:", error);
            res.status(500).json({ error: "Failed to fetch tasks" });
        }
    },
    updateTask: async (req, res) => {
        try {
            // Params and body are already validated by zod middleware
            const { id } = req.params;
            const { title, description, status } = req.body;
            const result = await taskService_1.taskService.updateTask({
                id,
                title,
                description,
                status,
            });
            res.json(result);
        }
        catch (error) {
            console.error("Update task error:", error);
            res.status(500).json({ error: "Failed to update task" });
        }
    },
    deleteTask: async (req, res) => {
        try {
            // Params are already validated by zod middleware
            const { id } = req.params;
            const result = await taskService_1.taskService.deleteTask(id);
            res.json(result);
        }
        catch (error) {
            console.error("Delete task error:", error);
            res.status(500).json({ error: "Failed to delete task" });
        }
    },
};
