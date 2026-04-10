import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../config/jwt";
import { getUserById } from "../services/auth.service";

export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    res.status(401).json({ success: false, message: "Authentication required" });
    return;
  }

  const token = authorization.replace("Bearer ", "").trim();

  try {
    const payload = verifyToken(token);
    const user = getUserById(payload.id);

    if (!user) {
      res.status(401).json({ success: false, message: "Invalid token" });
      return;
    }

    req.user = user;
    next();
  } catch {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};
