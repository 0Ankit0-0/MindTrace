import { z } from "zod";

export const analyzeSessionSchema = z
  .object({
    answers: z.array(z.boolean()).min(2, "At least two answers are required"),
    responseTimes: z.array(z.coerce.number().positive("Response times must be positive")).min(2),
    mood: z.string().trim().min(1).optional(),
    sleep: z.coerce.number().min(0).max(24).optional(),
  })
  .refine((value) => value.answers.length === value.responseTimes.length, {
    message: "answers and responseTimes must have the same length",
    path: ["responseTimes"],
  });
