import { Request, Response } from "express";
import { userService } from "../services/userService";
import { GetUserParamsInput } from "../validation";

export const userController = {
  getUser: async (req: Request, res: Response) => {
    try {
      // Params are already validated by zod middleware
      const { id } = req.params as GetUserParamsInput["params"];
      const user = await userService.getUser(id);
      res.json(user);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  },
};
