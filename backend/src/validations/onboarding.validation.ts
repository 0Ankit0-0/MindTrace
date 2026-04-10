import { z } from "zod";

export const updateOnboardingSchema = z.object({
  goals: z.string().trim().min(1, "Goals are required"),
  stressLevel: z.string().trim().min(1, "Stress level is required"),
  studyHours: z.coerce.number().min(0, "Study hours cannot be negative").max(24, "Study hours cannot exceed 24"),
});
