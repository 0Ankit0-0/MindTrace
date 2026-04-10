import { Router } from "express";
import { updateMyProfile } from "../controllers/profile.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { validateBody } from "../middleware/validate.middleware";
import { updateProfileSchema } from "../validations/profile.validation";

const router = Router();

router.put("/me", requireAuth, validateBody(updateProfileSchema), updateMyProfile);

export default router;
