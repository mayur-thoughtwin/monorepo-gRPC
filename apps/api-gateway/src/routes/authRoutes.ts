import { Router } from "express";
import { authController } from "../controllers/authController";
import { authenticateToken, authorizeRoles } from "../middleware/authMiddleware";
import { validate, registerSchema, loginSchema } from "../validation";

const router = Router();

// Public routes with validation
router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);

// Protected routes (require authentication)
router.get("/profile", authenticateToken, authController.getProfile);

// Admin only route example
router.get("/admin-only", authenticateToken, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Welcome admin!", user: req.user });
});

export default router;
