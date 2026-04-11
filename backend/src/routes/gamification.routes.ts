import { Router } from "express";
import { status } from "../controllers/gamification.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.get("/status", requireAuth, status);

export default router;
