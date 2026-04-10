import db from "../database/sqlite/db";
import { createAppError } from "../utils/app-error";
import { AppUser, OnboardingInput } from "../types/auth";
import { getUserById } from "./auth.service";

const ensureProfileRow = (userId: number) => {
  db.prepare(
    "INSERT INTO profiles (user_id) SELECT ? WHERE NOT EXISTS (SELECT 1 FROM profiles WHERE user_id = ?)",
  ).run(userId, userId);
};

export const updateOnboarding = (userId: number, input: OnboardingInput): AppUser => {
  ensureProfileRow(userId);

  db.prepare(
    "UPDATE profiles SET goals = ?, stress_level = ?, study_hours = ?, onboarding_completed = 1 WHERE user_id = ?",
  ).run(input.goals.trim(), input.stressLevel.trim(), input.studyHours, userId);

  const user = getUserById(userId);

  if (!user) {
    throw createAppError(404, "User not found");
  }

  return user;
};
