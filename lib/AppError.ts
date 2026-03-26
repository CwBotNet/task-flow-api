export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean; // Can we trust this error? Or is it a bug?

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message); // Calls Error constructor
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Fixes the prototype chain — critical for instanceof checks
    Object.setPrototypeOf(this, new.target.prototype);

    // Captures where the error originated in the stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}
