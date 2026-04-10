import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  age: z.coerce.number().int().min(1, "Age must be at least 1").max(120, "Age must be realistic"),
  gender: z.string().trim().min(1, "Gender is required"),
});
