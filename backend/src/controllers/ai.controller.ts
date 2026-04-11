import { NextFunction, Request, Response } from "express";
import { extractBrainDumpInsights, generateChatReply, generateRecommendations } from "../services/ai.service";

export const chat = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await generateChatReply(req.body);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const brainDump = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await extractBrainDumpInsights(req.body);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const recommend = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await generateRecommendations(req.body);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
