import db from "../database/sqlite/db";

interface GamificationRow {
  user_id: number;
  xp: number;
  streak: number;
  badges: string;
  last_session_date: string | null;
}

interface ApplySessionInput {
  userId: number;
  stressScore: number;
  previousStressScore?: number;
}

export interface GamificationStatus {
  xp: number;
  streak: number;
  badges: string[];
}

const parseBadges = (value: string | null) => {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? parsed.filter((badge): badge is string => typeof badge === "string") : [];
  } catch {
    return [];
  }
};

const today = () => new Date().toISOString().slice(0, 10);

const getOrCreateGamificationRow = (userId: number): GamificationRow => {
  const existing = db
    .prepare("SELECT user_id, xp, streak, badges, last_session_date FROM gamification WHERE user_id = ?")
    .get(userId) as GamificationRow | undefined;

  if (existing) {
    return existing;
  }

  db.prepare("INSERT INTO gamification (user_id, xp, streak, badges) VALUES (?, 0, 0, '[]')").run(userId);

  return {
    user_id: userId,
    xp: 0,
    streak: 0,
    badges: "[]",
    last_session_date: null,
  };
};

export const getGamificationStatus = (userId: number): GamificationStatus => {
  const row = getOrCreateGamificationRow(userId);

  return {
    xp: row.xp,
    streak: row.streak,
    badges: parseBadges(row.badges),
  };
};

export const applySessionGamification = ({
  previousStressScore,
  stressScore,
  userId,
}: ApplySessionInput): GamificationStatus => {
  const row = getOrCreateGamificationRow(userId);
  const badges = new Set(parseBadges(row.badges));
  const currentDate = today();
  let xp = row.xp;
  let streak = row.streak;

  if (stressScore > 60) {
    xp += 25;
    badges.add("Resilience XP");
  } else {
    xp += 10;
  }

  if (previousStressScore !== undefined && stressScore < previousStressScore) {
    badges.add("Recovery Achieved");
    xp += 30;
  }

  if (row.last_session_date !== currentDate) {
    streak += 1;
  }

  db.prepare(
    `
      UPDATE gamification
      SET xp = ?, streak = ?, badges = ?, last_session_date = ?
      WHERE user_id = ?
    `,
  ).run(xp, streak, JSON.stringify(Array.from(badges)), currentDate, userId);

  return {
    xp,
    streak,
    badges: Array.from(badges),
  };
};
