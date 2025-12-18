"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log("==========>>>>>>API Gateway service running...");
const express_1 = __importDefault(require("express"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const taskRoutes_1 = __importDefault(require("./routes/taskRoutes"));
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
// Routes
app.use("/auth", authRoutes_1.default); // Auth routes: /auth/register, /auth/login, /auth/profile
app.use("/users", userRoutes_1.default); // User routes (can add authentication middleware)
app.use("/tasks", taskRoutes_1.default); // Task routes: /tasks (CRUD operations)
// Health check
app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});
app.listen(3000, () => {
    console.log("API Gateway running on port 3000");
});
