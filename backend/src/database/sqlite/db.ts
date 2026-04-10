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
`);

ensureColumn("users", "password TEXT");
ensureColumn("profiles", "goals TEXT");
ensureColumn("profiles", "stress_level TEXT");
ensureColumn("profiles", "study_hours REAL");
ensureColumn("profiles", "onboarding_completed INTEGER NOT NULL DEFAULT 0");

export default db;
