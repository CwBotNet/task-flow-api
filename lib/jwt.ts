import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET!;

const generateToken = (userId: string) => {
  const payload = { id: userId };

  return jwt.sign(payload, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN as any,
  });
};

const verifyToken = (userToken: string) => {
  return jwt.verify(userToken, secret);
};

export { generateToken, verifyToken };
