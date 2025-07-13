// components/Crud/SQLite/DBSetup/DBSetup.ts
import { SQLiteDatabase } from 'expo-sqlite';

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 57;

  // Aktuelle DB-Version auslesen
  const { user_version: currentDbVersion = 0 } =
    (await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version')) ?? { user_version: 0 };

  // console.log(`Current DB Version: ${currentDbVersion}, Target Version: ${DATABASE_VERSION}`);
  if (currentDbVersion >= DATABASE_VERSION) {
    return; // Keine Migration nötig
  }

  try {
    await db.execAsync(`
      BEGIN TRANSACTION;

      -- Posts
      DROP TABLE IF EXISTS posts_fetched;
      CREATE TABLE IF NOT EXISTS posts_fetched (
        id TEXT PRIMARY KEY,
        created_at TEXT,
        location TEXT,
        nachname TEXT,
        option TEXT,
        postText TEXT,
        userId TEXT,
        profileImageUrl TEXT,
        long REAL,
        lat REAL,
        vorname TEXT,
        userBio TEXT,
        category TEXT,
        kategorien TEXT
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
  location TEXT,
  authorId TEXT NOT NULL,         
  long REAL NOT NULL,
  lat REAL NOT NULL,
  profileImageUrl TEXT NOT NULL
);

      -- Channels
      DROP TABLE IF EXISTS channels_fetched;
      CREATE TABLE IF NOT EXISTS channels_fetched (
        cid TEXT PRIMARY KEY,
        meId TEXT,
        channel_id TEXT,
        channel_type TEXT,
        custom_post_category_choosen TEXT,
        custom_post_option TEXT,
        custom_post_category TEXT,
        custom_post_id INTEGER,
        custom_post_user_id TEXT,
        custom_post_vorname TEXT,
        custom_post_nachname TEXT,
        custom_post_profileImage TEXT,
        custom_post_userBio TEXT,
        custom_user_vorname TEXT,
        custom_user_nachname TEXT,
        custom_user_profileImage TEXT,

        custom_user_userBio TEXT,
        custom_user_id TEXT,
        last_message_text TEXT,
        last_message_at TEXT,
        updated_at TEXT,
        created_at TEXT,
        unread_count INTEGER,
        partner_user_id TEXT
      );

    DROP TABLE IF EXISTS messages_fetched;
CREATE TABLE IF NOT EXISTS messages_fetched (
  id TEXT PRIMARY KEY NOT NULL,        -- message.id
  cid TEXT NOT NULL,                   -- zu welchem Channel
  sender_id TEXT NOT NULL,
  sender_vorname TEXT,
  custom_type TEXT,
  sender_nachname TEXT,
  sender_image TEXT,
  post_category TEXT,
  post_option TEXT,
  post_vorname TEXT,
  post_nachname TEXT,
  post_image TEXT,
  content TEXT NOT NULL,
  created_at TEXT NOT NULL,
  read INTEGER NOT NULL                -- 0 = ungelesen, 1 = gelesen
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
  steuernummer TEXT,
  kategorien TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  is_id_verified BOOLEAN DEFAULT FALSE
);

      COMMIT;

      PRAGMA user_version = ${DATABASE_VERSION};
    `);

    // console.log('Database migrated to version', DATABASE_VERSION);
  } catch (error) {
    console.error('Error migrating database', error);
  }
}