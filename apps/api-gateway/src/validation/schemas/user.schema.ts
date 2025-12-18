import { z } from "zod";

// User roles enum
export const UserRole = z.enum(["admin", "user"]);
export type UserRoleType = z.infer<typeof UserRole>;

// Register user schema
export const registerSchema = z.object({
  body: z.object({
    name: z
      .string({ message: "Name is required" })
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must not exceed 100 characters")
      .trim(),
    email: z
      .string({ message: "Email is required" })
      .email("Invalid email format")
      .toLowerCase()
      .trim(),
    password: z
      .string({ message: "Password is required" })
      .min(6, "Password must be at least 6 characters")
      .max(128, "Password must not exceed 128 characters"),
    role: UserRole.optional().default("user"),
  }),
});

// Login schema
export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ message: "Email is required" })
      .email("Invalid email format")
      .toLowerCase()
      .trim(),
    password: z
      .string({ message: "Password is required" })
      .min(1, "Password is required"),
  }),
});

// Get user by ID params schema
export const getUserParamsSchema = z.object({
  params: z.object({
    id: z
      .string({ message: "User ID is required" })
      .regex(/^[a-fA-F0-9]{24}$/, "Invalid user ID format (must be a valid MongoDB ObjectId)"),
  }),
});

// Export inferred types
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type GetUserParamsInput = z.infer<typeof getUserParamsSchema>;
