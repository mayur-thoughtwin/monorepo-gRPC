import { Router } from "express";
import { userController } from "../controllers/userController";
import { authenticateToken } from "../middleware/authMiddleware";
import { validate, getUserParamsSchema } from "../validation";

const router = Router();

// Protected route - requires authentication and validation
router.get("/:id", authenticateToken, validate(getUserParamsSchema), userController.getUser);

export default router;
