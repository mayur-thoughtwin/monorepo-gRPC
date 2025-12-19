console.log("==========>>>>>>API Gateway service running...");

import express from "express";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import taskRoutes from "./routes/taskRoutes";

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/auth", authRoutes);       // Auth routes: /auth/register, /auth/login, /auth/profile
app.use("/users", userRoutes);       // User routes (can add authentication middleware)
app.use("/tasks", taskRoutes);       // Task routes: /tasks (CRUD operations)

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Global 404 handler - catches all undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
    method: req.method
  });
});

app.listen(3000, () => {
  console.log("API Gateway running on port 3000");
});
