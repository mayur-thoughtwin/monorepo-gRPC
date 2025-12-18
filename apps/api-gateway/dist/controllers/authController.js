"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const authService_1 = require("../services/authService");
const authMiddleware_1 = require("../middleware/authMiddleware");
exports.authController = {
    // Register a new user
    register: async (req, res) => {
        try {
            // Request body is already validated by zod middleware
            const { name, email, password, role } = req.body;
            const result = await authService_1.authService.register({ name, email, password, role });
            if (!result.success) {
                res.status(400).json({ error: result.message });
                return;
            }
            res.status(201).json({
                success: true,
                message: result.message,
                userId: result.userId,
            });
        }
        catch (error) {
            console.error("Registration error:", error);
            res.status(500).json({ error: "Registration failed" });
        }
    },
    // Login user
    login: async (req, res) => {
        try {
            // Request body is already validated by zod middleware
            const { email, password } = req.body;
            const result = await authService_1.authService.login({ email, password });
            if (!result.success) {
                res.status(401).json({ error: result.message });
                return;
            }
            // Generate JWT tokens
            const tokenPayload = {
                userId: result.userId,
                email: result.email,
                name: result.name,
                role: result.role,
            };
            const accessToken = (0, authMiddleware_1.generateToken)(tokenPayload);
            const refreshToken = (0, authMiddleware_1.generateRefreshToken)(tokenPayload);
            res.json({
                success: true,
                message: result.message,
                user: {
                    id: result.userId,
                    email: result.email,
                    name: result.name,
                    role: result.role,
                },
                accessToken,
                refreshToken,
            });
        }
        catch (error) {
            console.error("Login error:", error);
            res.status(500).json({ error: "Login failed" });
        }
    },
    // Get current user profile (protected route example)
    getProfile: async (req, res) => {
        try {
            // req.user is set by authenticateToken middleware
            if (!req.user) {
                res.status(401).json({ error: "Not authenticated" });
                return;
            }
            res.json({
                user: req.user,
            });
        }
        catch (error) {
            console.error("Get profile error:", error);
            res.status(500).json({ error: "Failed to get profile" });
        }
    },
};
