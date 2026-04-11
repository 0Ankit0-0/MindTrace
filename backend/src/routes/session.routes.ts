import { Router } from "express";
import { analyzeUserSession } from "../controllers/session.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { validateBody } from "../middleware/validate.middleware";
import { analyzeSessionSchema } from "../validations/session.validation";

const router = Router();

router.post("/", requireAuth, validateBody(analyzeSessionSchema), analyzeUserSession);

export default router;
