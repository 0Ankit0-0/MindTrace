import { NextFunction, Request, Response } from "express";
import { getUserById, loginUser, registerUser } from "../services/auth.service";
import { createAppError } from "../utils/app-error";

export const register = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const result = registerUser(req.body);
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const login = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const result = loginUser(req.body);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const me = (req: Request, res: Response, next: NextFunction): void => {
  try {
    if (!req.user) {
      throw createAppError(401, "Authentication required");
    }

    const user = getUserById(req.user.id);

    if (!user) {
      throw createAppError(404, "User not found");
    }

    res.json({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};
