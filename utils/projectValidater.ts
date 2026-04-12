import { AppError } from "../lib";
import { Types } from "mongoose";

export const projectValidator = (
  userId: Types.ObjectId,
  owner: Types.ObjectId,
) => {
  if (!userId.equals(owner)) {
    throw new AppError("Unauthorized to access this project", 401);
  }
};
