import db from "../database/sqlite/db";
import { createAppError } from "../utils/app-error";
import { AppUser, UserProfileInput } from "../types/auth";
import { getUserById } from "./auth.service";

const ensureProfileRow = (userId: number) => {
  db.prepare(
    "INSERT INTO profiles (user_id) SELECT ? WHERE NOT EXISTS (SELECT 1 FROM profiles WHERE user_id = ?)",
  ).run(userId, userId);
};

export const updateProfile = (userId: number, input: UserProfileInput): AppUser => {
  ensureProfileRow(userId);

  db.prepare(
    "UPDATE profiles SET name = ?, age = ?, gender = ? WHERE user_id = ?",
  ).run(input.name.trim(), input.age, input.gender.trim(), userId);

  const user = getUserById(userId);

  if (!user) {
    throw createAppError(404, "User not found");
  }

  return user;
};
