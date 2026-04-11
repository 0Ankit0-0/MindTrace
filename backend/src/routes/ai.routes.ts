import { Router } from "express";
import { brainDump, chat, recommend } from "../controllers/ai.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { validateBody } from "../middleware/validate.middleware";
import {
  brainDumpRequestSchema,
  chatRequestSchema,
  recommendationRequestSchema,
} from "../validations/ai.validation";

const router = Router();

router.post("/chat", requireAuth, validateBody(chatRequestSchema), chat);
router.post("/brain-dump", requireAuth, validateBody(brainDumpRequestSchema), brainDump);
router.post("/recommend", requireAuth, validateBody(recommendationRequestSchema), recommend);

export default router;
