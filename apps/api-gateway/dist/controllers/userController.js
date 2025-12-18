"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const userService_1 = require("../services/userService");
exports.userController = {
    getUser: async (req, res) => {
        try {
            // Params are already validated by zod middleware
            const { id } = req.params;
            const user = await userService_1.userService.getUser(id);
            res.json(user);
        }
        catch (error) {
            console.error("Get user error:", error);
            res.status(500).json({ error: "Failed to fetch user" });
        }
    },
};
