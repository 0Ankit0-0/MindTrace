import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { createCheckin, getCheckinHistory } from "../services/checkin.service";
import { createAppError } from "../utils/app-error";

export const checkinSchema = z.object({
  mood: z.string().trim().min(1, "Mood is required"),
  sleep: z.coerce.number().min(0, "Sleep must be at least 0").max(24, "Sleep cannot exceed 24"),
});

export const addCheckin = (req: Request, res: Response, next: NextFunction): void => {
  try {
    if (!req.user) {
      throw createAppError(401, "Authentication required");
    }

    const checkin = createCheckin({
      userId: req.user.id,
      mood: req.body.mood,
      sleep: req.body.sleep,
    });

    res.status(201).json({
      success: true,
      data: checkin,
    });
  } catch (error) {
    next(error);
  }
};

export const history = (req: Request, res: Response, next: NextFunction): void => {
  try {
    if (!req.user) {
      throw createAppError(401, "Authentication required");
    }

    const checkins = getCheckinHistory(req.user.id);
    res.json({
      success: true,
      data: { checkins },
    });
  } catch (error) {
    next(error);
  }
};
