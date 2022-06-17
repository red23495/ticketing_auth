import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../../config";

declare global {
    namespace Express {
        interface Request {
            currentUser?: UserPayload | null,
        }
    }
}

interface UserPayload {
    id: string,
    email: string,
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.session?.token ?? "";
  try {
    const payload = jwt.verify(token, config.jwtKey) as UserPayload;
    req.currentUser = payload;
  } catch (e) {
    req.currentUser = null;
  }
  next();
};
