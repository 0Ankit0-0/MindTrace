import { NextFunction, Request, Response } from "express";
import { updateProfile } from "../services/profile.service";

export const updateMyProfile = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const profile = updateProfile(req.user!.id, req.body);

    res.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};
