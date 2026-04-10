import bcrypt from "bcrypt";
import db from "../database/sqlite/db";
import { env } from "../config/env";
import { signToken } from "../config/jwt";
import { AppUser } from "../types/auth";
import { createAppError } from "../utils/app-error";

interface UserRow {
  id: number;
  email: string;
  password: string | null;
  password_hash: string | null;
  created_at: string;
  name: string | null;
  legacy_name: string | null;
  age: number | null;
  gender: string | null;
  onboarding_completed: number | null;
  goals: string | null;
  stress_level: string | null;
  study_hours: number | null;
}

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

const toAppUser = (user: UserRow): AppUser => ({
  id: user.id,
  email: user.email,
  name: user.name ?? user.legacy_name,
  age: user.age,
  gender: user.gender,
  onboardingCompleted: Boolean(user.onboarding_completed),
  goals: user.goals,
  stressLevel: user.stress_level,
  studyHours: user.study_hours,
  createdAt: user.created_at,
});

const getTableColumns = (tableName: string) => {
  return db.prepare(`PRAGMA table_info(${tableName})`).all() as Array<{ name: string }>;
};

const userColumns = getTableColumns("users");
const hasLegacyNameColumn = userColumns.some((column) => column.name === "name");
const hasLegacyPasswordHashColumn = userColumns.some((column) => column.name === "password_hash");

const baseUserQuery = `
  SELECT
    users.id,
    users.email,
    users.password,
    ${hasLegacyPasswordHashColumn ? "users.password_hash," : "NULL AS password_hash,"}
    users.created_at,
    ${hasLegacyNameColumn ? "users.name AS legacy_name," : "NULL AS legacy_name,"}
    profiles.name,
    profiles.age,
    profiles.gender,
    profiles.onboarding_completed,
    profiles.goals,
    profiles.stress_level,
    profiles.study_hours
  FROM users
  LEFT JOIN profiles ON profiles.user_id = users.id
`;

export const getUserByEmail = (email: string): UserRow | undefined => {
  return db
    .prepare(`${baseUserQuery} WHERE users.email = ?`)
    .get(email) as UserRow | undefined;
};

export const getUserById = (id: number): AppUser | undefined => {
  const user = db
    .prepare(`${baseUserQuery} WHERE users.id = ?`)
    .get(id) as UserRow | undefined;

  return user ? toAppUser(user) : undefined;
};

export const registerUser = ({ name, email, password }: RegisterInput) => {
  const normalizedEmail = email.trim().toLowerCase();

  if (getUserByEmail(normalizedEmail)) {
    throw createAppError(409, "Email already registered");
  }

  const passwordHash = bcrypt.hashSync(password, env.saltRounds);
  const fields = ["email", "password"];
  const values: Array<string> = [normalizedEmail, passwordHash];

  if (hasLegacyNameColumn) {
    fields.unshift("name");
    values.unshift(name.trim());
  }

  if (hasLegacyPasswordHashColumn) {
    fields.push("password_hash");
    values.push(passwordHash);
  }

  const placeholders = fields.map(() => "?").join(", ");
  const result = db
    .prepare(`INSERT INTO users (${fields.join(", ")}) VALUES (${placeholders})`)
    .run(...values);

  const userId = Number(result.lastInsertRowid);

  db.prepare("INSERT INTO profiles (user_id, name) VALUES (?, ?)").run(userId, name.trim());

  const user = getUserById(userId);

  if (!user) {
    throw createAppError(500, "Failed to create user");
  }

  return {
    token: signToken({ id: user.id }),
    user,
  };
};

export const loginUser = ({ email, password }: LoginInput) => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = getUserByEmail(normalizedEmail);

  const storedPasswordHash = user?.password || user?.password_hash;

  if (!storedPasswordHash || !bcrypt.compareSync(password, storedPasswordHash)) {
    throw createAppError(401, "Invalid email or password");
  }

  return {
    token: signToken({ id: user.id }),
    user: toAppUser(user),
  };
};
