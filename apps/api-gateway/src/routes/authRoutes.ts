import { Router } from "express";
import { authController } from "../controllers/authController";
import { authenticateToken, authorizeRoles } from "../middleware/authMiddleware";

const router = Router();

// Public routes
router.post("/register", authController.register);
router.post("/login", authController.login);

// Protected routes (require authentication)
router.get("/profile", authenticateToken, authController.getProfile);

// Admin only route example
router.get("/admin-only", authenticateToken, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Welcome admin!", user: req.user });
});

export default router;
