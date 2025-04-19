import { SQLiteDatabase } from 'expo-sqlite';

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 9; // 🔼 Neue Version hochsetzen

  // Get the current database version
  const { user_version: currentDbVersion = 0 } =
    (await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version')) ?? { user_version: 0 };

  console.log(`Current DB Version: ${currentDbVersion}, Target Version: ${DATABASE_VERSION}`);
  if (currentDbVersion >= DATABASE_VERSION) {
    return; // No migration needed
  }

  if (currentDbVersion < DATABASE_VERSION) {
    try {
      await db.execAsync(`
        BEGIN TRANSACTION;

        -- Create a new table for fetched posts
        CREATE TABLE IF NOT EXISTS posts_fetched (
            id INTEGER PRIMARY KEY NOT NULL,
            created_at TEXT NOT NULL,
            location TEXT NOT NULL,
            nachname TEXT NOT NULL,
            option TEXT NOT NULL,
            postText TEXT NOT NULL,
            userId TEXT NOT NULL,
            profileImageUrl TEXT NOT NULL,
            long REAL NOT NULL,
            lat REAL NOT NULL,
            vorname TEXT NOT NULL,
            userBio TEXT,
            category TEXT NOT NULL
        );

        -- Create a new table for fetched danksagungen
        CREATE TABLE IF NOT EXISTS danksagungen_fetched (
            id INTEGER PRIMARY KEY NOT NULL,
            created_at TEXT NOT NULL,
            vorname TEXT NOT NULL,
            nachname TEXT NOT NULL,
            writtenText TEXT NOT NULL,
            userId TEXT NOT NULL,
            location TEXT NOT NULL,
            authorID TEXT NOT NULL,
            long REAL NOT NULL,
            lat REAL NOT NULL,
            profileImageUrl TEXT NOT NULL
        );

        -- Create a new table for fetched channels
        CREATE TABLE IF NOT EXISTS channels_fetched (
          cid TEXT PRIMARY KEY,
          channel_id TEXT,
          channel_type TEXT,
          custom_post_category TEXT,
          custom_post_id INTEGER,
          custom_post_user_id TEXT,
          custom_user_vorname TEXT,
          custom_user_nachname TEXT,
          custom_user_profileImage TEXT,
          custom_user_userBio TEXT,
          last_message_at TEXT,
          updated_at TEXT,
          created_at TEXT
        );

        -- Create a new table for fetched messages
        CREATE TABLE IF NOT EXISTS messages_fetched (
          message_id TEXT PRIMARY KEY,
          cid TEXT,
          user_id TEXT,
          text TEXT,
          created_at TEXT,
          updated_at TEXT,
          FOREIGN KEY (cid) REFERENCES channels_fetched(cid)
        );

      -- Drop old table if exists (nur für Dev!)
DROP TABLE IF EXISTS user_info_local;

-- Create a new table for locally stored user info (Anmeldedaten)
CREATE TABLE IF NOT EXISTS user_info_local (
  id TEXT PRIMARY KEY,
  created_at TEXT,
  location TEXT,
  vorname TEXT,
  nachname TEXT,
  email TEXT,
  profileImageUrl TEXT,
  bio TEXT,
  straße TEXT,
  hausnummer TEXT,
  plz TEXT,
  wohnort TEXT,
  telefonnummer TEXT,
  steuernummer TEXT
);

        COMMIT;

        PRAGMA user_version = ${DATABASE_VERSION};
      `);
      console.log('Database migrated to version', DATABASE_VERSION);
    } catch (error) {
      console.error('Error migrating database', error);
    }
  }
}