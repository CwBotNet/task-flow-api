import { Request, Response, NextFunction } from "express";
import { AppError, asyncHandler, verifyToken } from "../lib";
import User from "../models/user.model";

export const authHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
      throw new AppError("Unauthorized", 401);
    }

    const decodedToken = verifyToken(token);

    if (!decodedToken) {
      throw new AppError("Token expired", 401);
    }

    const userId = decodedToken.id;
    const user = await User.findById(userId);

    if (!user) {
      throw new AppError("Invalid Token", 401);
    }

    req.user = user;
    next();
  },
);
