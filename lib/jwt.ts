import jwt, { JwtPayload } from "jsonwebtoken";

export interface ITokenPayload extends JwtPayload {
  id: string;
}

const secret = process.env.JWT_SECRET!;

const generateToken = (userId: string) => {
  const payload = { id: userId };

  return jwt.sign(payload, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN as any,
  });
};

const verifyToken = (userToken: string): ITokenPayload => {
  return jwt.verify(userToken, secret) as ITokenPayload;
};

export { generateToken, verifyToken };
