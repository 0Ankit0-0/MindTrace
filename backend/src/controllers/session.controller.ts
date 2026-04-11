import { NextFunction, Request, Response } from "express";
import { analyzeSession } from "../services/session.service";
import { createAppError } from "../utils/app-error";

export const analyzeUserSession = (req: Request, res: Response, next: NextFunction): void => {
  try {
    if (!req.user) {
      throw createAppError(401, "Authentication required");
    }

    const result = analyzeSession(req.user.id, req.body);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
