import { Request, Response, NextFunction } from "express";
import { AppError } from "../lib/AppError";

interface ErrorResponse {
  success: boolean;
  status: string;
  statusCode: number;
  message: string;
  stack?: string;
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;

  const status = statusCode >= 500 ? "error" : "fail";

  const isOperational = err instanceof AppError ? err.isOperational : false;

  if (!isOperational) {
    console.error("(BUG) System ERROR 💥", {
      message: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
    });
  } else {
    console.warn("⚠️ Operational Error: ", err.message);
  }

  const response: ErrorResponse = {
    success: false,
    status,
    statusCode,
    message: isOperational
      ? err.message
      : "Something went wrong. please try again later",
  };

  if (process.env.NODE_ENV === "development") {
    if (err.stack !== undefined) response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};
