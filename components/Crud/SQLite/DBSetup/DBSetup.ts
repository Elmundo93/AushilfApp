import { SQLiteDatabase } from 'expo-sqlite';

const DATABASE_VERSION = 1;

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  let { user_version: currentDbVersion = 0 } = await db.getFirstAsync<{ user_version: number }>(
    'PRAGMA user_version'
  ) ?? { user_version: 0 };

  if (currentDbVersion >= DATABASE_VERSION) {
    return; // Keine Migration notwendig
  }

  if (currentDbVersion === 0) {
    await db.execAsync(`
      PRAGMA journal_mode = 'wal';
      CREATE TABLE posts (id INTEGER PRIMARY KEY NOT NULL, created_at TEXT NOT NULL, location TEXT NOT NULL, nachname TEXT NOT NULL, option TEXT NOT NULL, postText TEXT NOT NULL, userId TEXT NOT NULL, profileImageUrl TEXT NOT NULL, long REAL NOT NULL, lat REAL NOT NULL, vorname TEXT NOT NULL, authorId TEXT NOT NULL, userBio TEXT NOT NULL, category TEXT NOT NULL);
      CREATE TABLE messages (id INTEGER PRIMARY KEY NOT NULL, sender_id INTEGER, receiver_id INTEGER, message TEXT, timestamp TEXT);
      CREATE TABLE danksagungen (id INTEGER PRIMARY KEY NOT NULL, created_at TEXT NOT NULL, vorname TEXT NOT NULL, nachname TEXT NOT NULL, userId TEXT NOT NULL, writtenText TEXT NOT NULL, profileImageUrl TEXT NOT NULL, location TEXT NOT NULL, long REAL NOT NULL, lat REAL NOT NULL, authorId TEXT NOT NULL);
    `);
    currentDbVersion = 1;
  }

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}