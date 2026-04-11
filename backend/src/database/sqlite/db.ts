import Database from "better-sqlite3";
import path from "path";

const databasePath = path.resolve(process.cwd(), "mindtrace.db");
const db = new Database(databasePath);

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

const hasColumn = (tableName: string, columnName: string) => {
  const columns = db.prepare(`PRAGMA table_info(${tableName})`).all() as Array<{ name: string }>;
  return columns.some((column) => column.name === columnName);
};

const ensureColumn = (tableName: string, definition: string) => {
  const columnName = definition.split(" ")[0];

  if (!hasColumn(tableName, columnName)) {
    db.exec(`ALTER TABLE ${tableName} ADD COLUMN ${definition}`);
  }
};

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL UNIQUE,
    name TEXT,
    age INTEGER,
    gender TEXT,
    goals TEXT,
    stress_level TEXT,
    study_hours REAL,
    onboarding_completed INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS checkins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    mood TEXT NOT NULL,
    sleep REAL NOT NULL,
    timestamp TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id)
  );

  CREATE INDEX IF NOT EXISTS idx_checkins_user_timestamp
  ON checkins (user_id, timestamp DESC);

  CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    accuracy REAL NOT NULL,
    response_time REAL NOT NULL,
    stress_score INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS gamification (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL UNIQUE,
    xp INTEGER NOT NULL DEFAULT 0,
    streak INTEGER NOT NULL DEFAULT 0,
    badges TEXT NOT NULL DEFAULT '[]',
    last_session_date TEXT,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_sessions_user_created
  ON sessions (user_id, created_at DESC);
`);

ensureColumn("users", "password TEXT");
ensureColumn("profiles", "goals TEXT");
ensureColumn("profiles", "stress_level TEXT");
ensureColumn("profiles", "study_hours REAL");
ensureColumn("profiles", "onboarding_completed INTEGER NOT NULL DEFAULT 0");
ensureColumn("profiles", "baseline_accuracy REAL NOT NULL DEFAULT 0.75");
ensureColumn("profiles", "baseline_response_time REAL NOT NULL DEFAULT 1200");
ensureColumn("sessions", "drift_detected INTEGER NOT NULL DEFAULT 0");
ensureColumn("sessions", "mood TEXT NOT NULL DEFAULT 'steady'");
ensureColumn("sessions", "sleep REAL NOT NULL DEFAULT 7");
ensureColumn("gamification", "badges TEXT NOT NULL DEFAULT '[]'");
ensureColumn("gamification", "last_session_date TEXT");

export default db;
