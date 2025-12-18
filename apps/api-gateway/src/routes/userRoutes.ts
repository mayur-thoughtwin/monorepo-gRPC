import { Router } from "express";
import { userController } from "../controllers/userController";
import { authenticateToken } from "../middleware/authMiddleware";
import { validate, getUsersParamsSchema } from "../validation";

const router = Router();

// Protected routes - requires authentication
// GET /users - Get all non-admin users
// GET /users/:id - Get single user by ID
router.get("/{:id}", authenticateToken, validate(getUsersParamsSchema), userController.getUsers);

export default router;
