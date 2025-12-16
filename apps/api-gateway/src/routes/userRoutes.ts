import { Router } from "express";
import { userController } from "../controllers/userController";
import { authenticateToken, authorizeRoles } from "../middleware/authMiddleware";

const router = Router();

// Protected route - requires authentication
router.get("/:id", authenticateToken, userController.getUser);


export default router;
