import type { AppUser } from "./auth";

declare global {
  namespace Express {
    interface Request {
      user?: AppUser;
    }
  }
}

export {};
