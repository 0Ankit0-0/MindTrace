import { NextFunction, Request, Response } from "express";
import { getStudyPlan } from "../services/study-plan.service";
import { createAppError } from "../utils/app-error";

export const studyPlan = (req: Request, res: Response, next: NextFunction): void => {
  try {
    if (!req.user) {
      throw createAppError(401, "Authentication required");
    }

    const result = getStudyPlan(req.user.id);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
