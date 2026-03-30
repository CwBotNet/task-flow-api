import jwt from "jsonwebtoken";

export const generateToken = (userId: string) => {
  const payload = { id: userId };
  const secret = process.env.JWT_SECRET!;

  return jwt.sign(payload, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN as any,
  });
};
