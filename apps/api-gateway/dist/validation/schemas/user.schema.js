"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserParamsSchema = exports.loginSchema = exports.registerSchema = exports.UserRole = void 0;
const zod_1 = require("zod");
// User roles enum
exports.UserRole = zod_1.z.enum(["admin", "user"]);
// Register user schema
exports.registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({ message: "Name is required" })
            .min(2, "Name must be at least 2 characters")
            .max(100, "Name must not exceed 100 characters")
            .trim(),
        email: zod_1.z
            .string({ message: "Email is required" })
            .email("Invalid email format")
            .toLowerCase()
            .trim(),
        password: zod_1.z
            .string({ message: "Password is required" })
            .min(6, "Password must be at least 6 characters")
            .max(128, "Password must not exceed 128 characters"),
        role: exports.UserRole.optional().default("user"),
    }),
});
// Login schema
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({ message: "Email is required" })
            .email("Invalid email format")
            .toLowerCase()
            .trim(),
        password: zod_1.z
            .string({ message: "Password is required" })
            .min(1, "Password is required"),
    }),
});
// Get user by ID params schema
exports.getUserParamsSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z
            .string({ message: "User ID is required" })
            .regex(/^[a-fA-F0-9]{24}$/, "Invalid user ID format (must be a valid MongoDB ObjectId)"),
    }),
});
