import { NextFunction, Request, Response } from "express";
import { getGamificationStatus } from "../services/gamification.service";
import { createAppError } from "../utils/app-error";

export const status = (req: Request, res: Response, next: NextFunction): void => {
  try {
    if (!req.user) {
      throw createAppError(401, "Authentication required");
    }

    res.json({
      success: true,
      data: getGamificationStatus(req.user.id),
    });
  } catch (error) {
    next(error);
  }
};
