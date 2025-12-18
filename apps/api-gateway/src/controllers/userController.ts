import { Request, Response } from "express";
import { userService } from "../services/userService";

export const userController = {
  getUsers: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      // If ID is provided, get single user
      if (id) {
        const user = await userService.getUser(id);
        return res.json(user);
      }

      // If no ID, get all non-admin users
      const result = await userService.getUsers();
      return res.json(result.users);
    } catch (error) {
      console.error("Get user(s) error:", error);
      res.status(500).json({ error: "Failed to fetch user(s)" });
    }
  },
};
