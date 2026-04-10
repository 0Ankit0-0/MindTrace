import { NextFunction, Request, Response } from "express";
import { updateOnboarding } from "../services/onboarding.service";

export const updateMyOnboarding = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const profile = updateOnboarding(req.user!.id, req.body);

    res.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};
