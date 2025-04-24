import { SQLiteDatabase } from 'expo-sqlite';

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 13;

  // Aktuelle DB-Version auslesen
  const { user_version: currentDbVersion = 0 } =
    (await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version')) ?? { user_version: 0 };

  console.log(`Current DB Version: ${currentDbVersion}, Target Version: ${DATABASE_VERSION}`);
  if (currentDbVersion >= DATABASE_VERSION) {
    return; // Keine Migration nötig
  }

  try {
    await db.execAsync(`
      BEGIN TRANSACTION;

      -- Posts
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

      -- Danksagungen
   DROP TABLE IF EXISTS danksagungen_fetched;
CREATE TABLE IF NOT EXISTS danksagungen_fetched (
  id TEXT PRIMARY KEY NOT NULL,
  created_at TEXT NOT NULL,
  vorname TEXT NOT NULL,
  nachname TEXT NOT NULL,
  writtenText TEXT NOT NULL,
  userId TEXT NOT NULL,
  location TEXT NOT NULL,
  authorId TEXT NOT NULL,         
  long REAL NOT NULL,
  lat REAL NOT NULL,
  profileImageUrl TEXT NOT NULL
);

      -- Channels
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

    DROP TABLE IF EXISTS messages_fetched;
CREATE TABLE IF NOT EXISTS messages_fetched (
  id TEXT PRIMARY KEY NOT NULL,
  chat_id TEXT NOT NULL,
  sender_id TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TEXT NOT NULL,
  read INTEGER NOT NULL
);

DROP TABLE IF EXISTS chats_fetched;

CREATE TABLE IF NOT EXISTS chats_fetched (
  id TEXT PRIMARY KEY NOT NULL,
  user1 TEXT NOT NULL,
  user2 TEXT NOT NULL,
  blocked_by TEXT,
  created_at TEXT NOT NULL,

  post_id TEXT,
  post_text TEXT,
  category TEXT,
  option TEXT,

  post_author_id TEXT,
  post_author_vorname TEXT,
  post_author_nachname TEXT,
  post_author_profile_image TEXT,
  post_author_bio TEXT,

  initiator_vorname TEXT,
  initiator_nachname TEXT,
  initiator_profile_image TEXT,
  initiator_bio TEXT
);

      -- Alte User-Tabelle löschen (nur Dev)
      DROP TABLE IF EXISTS user_info_local;

      -- Neue Tabelle für lokal gespeicherte User-Daten
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