import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { analyzeMindState } from "../services/analyze.service";

export const analyzeSchema = z.object({
  mood: z.string().trim().min(1, "Mood is required"),
  sleep: z.coerce.number().min(0, "Sleep must be at least 0").max(24, "Sleep cannot exceed 24"),
});

export const analyze = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const result = analyzeMindState(req.body);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
