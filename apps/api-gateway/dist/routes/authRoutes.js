"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const validation_1 = require("../validation");
const router = (0, express_1.Router)();
// Public routes with validation
router.post("/register", (0, validation_1.validate)(validation_1.registerSchema), authController_1.authController.register);
router.post("/login", (0, validation_1.validate)(validation_1.loginSchema), authController_1.authController.login);
// Protected routes (require authentication)
router.get("/profile", authMiddleware_1.authenticateToken, authController_1.authController.getProfile);
// Admin only route example
router.get("/admin-only", authMiddleware_1.authenticateToken, (0, authMiddleware_1.authorizeRoles)("admin"), (req, res) => {
    res.json({ message: "Welcome admin!", user: req.user });
});
exports.default = router;
