import { Router } from "express";
import { updateMyOnboarding } from "../controllers/onboarding.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { validateBody } from "../middleware/validate.middleware";
import { updateOnboardingSchema } from "../validations/onboarding.validation";

const router = Router();

router.put("/", requireAuth, validateBody(updateOnboardingSchema), updateMyOnboarding);

export default router;
