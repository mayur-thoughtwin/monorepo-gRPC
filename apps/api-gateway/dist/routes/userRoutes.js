"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const validation_1 = require("../validation");
const router = (0, express_1.Router)();
// Protected route - requires authentication and validation
router.get("/:id", authMiddleware_1.authenticateToken, (0, validation_1.validate)(validation_1.getUserParamsSchema), userController_1.userController.getUser);
exports.default = router;
