// components/Crud/SQLite/DBSetup/DBSetup.ts
import { SQLiteDatabase } from 'expo-sqlite';

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 63
  ;

  const { user_version: currentDbVersion = 0 } =
    (await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version')) ?? { user_version: 0 };

  if (currentDbVersion >= DATABASE_VERSION) return;

  try {
    await db.execAsync(`
      BEGIN TRANSACTION;

      -- Posts (unchanged)
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

      -- Danksagungen (unchanged)
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

      -- User info (unchanged)
      DROP TABLE IF EXISTS user_info_local;
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

      -- 🔹 Profiles local cache (neu): für Partnernamen/Avatare offline-first
      DROP TABLE IF EXISTS profiles_local;
      CREATE TABLE IF NOT EXISTS profiles_local (
        id TEXT PRIMARY KEY,
        vorname TEXT,
        nachname TEXT,
        name TEXT,
        avatar_url TEXT,
        updated_at INTEGER
      );

      -- Chat: channels (already with preview fields)
      DROP TABLE IF EXISTS channels_local;
      CREATE TABLE IF NOT EXISTS channels_local (
        id TEXT PRIMARY KEY,
        custom_type TEXT,
        custom_category TEXT,
        updated_at INTEGER NOT NULL,
        last_message_at INTEGER,
        last_message_text TEXT,
        last_sender_id TEXT,
        meta TEXT DEFAULT '{}' NOT NULL
      );

      -- 🔹 Index für snappy Sortierung der Liste
      DROP INDEX IF EXISTS idx_channels_local_last_msg_at;
      CREATE INDEX IF NOT EXISTS idx_channels_local_last_msg_at
        ON channels_local (last_message_at DESC);

      -- Channel members
      DROP TABLE IF EXISTS channel_members_local;
      CREATE TABLE IF NOT EXISTS channel_members_local (
        last_read_at INTEGER,
        channel_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        role TEXT,
        muted INTEGER NOT NULL DEFAULT 0,
        joined_at INTEGER,
        PRIMARY KEY (channel_id, user_id)
      );

      -- 🔹 Indizes für schnelle Lookups
      DROP INDEX IF EXISTS idx_ch_members_local_user;
      DROP INDEX IF EXISTS idx_ch_members_local_channel;
      CREATE INDEX IF NOT EXISTS idx_ch_members_local_user
        ON channel_members_local (user_id);
      CREATE INDEX IF NOT EXISTS idx_ch_members_local_channel
        ON channel_members_local (channel_id);

      -- Messages
      DROP TABLE IF EXISTS messages_local;
      CREATE TABLE IF NOT EXISTS messages_local (
        id TEXT PRIMARY KEY,
        channel_id TEXT NOT NULL,
        sender_id TEXT NOT NULL,
        body TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        edited_at INTEGER,
        deleted_at INTEGER,
        client_id TEXT NOT NULL,
        meta TEXT NOT NULL,
        sync_state TEXT NOT NULL
      );

      -- Bestehender Index
      DROP INDEX IF EXISTS idx_msg_local_channel_created;
      CREATE INDEX IF NOT EXISTS idx_msg_local_channel_created
        ON messages_local (channel_id, created_at);

      -- 🔹 Seek-Pagination stabilisieren (bei gleichen Timestamps)
      DROP INDEX IF EXISTS idx_msg_local_channel_created_id;
      CREATE INDEX IF NOT EXISTS idx_msg_local_channel_created_id
        ON messages_local (channel_id, created_at, id);

      -- Outbox
      DROP TABLE IF EXISTS outbox_messages;
      CREATE TABLE IF NOT EXISTS outbox_messages (
        client_id TEXT PRIMARY KEY,
        channel_id TEXT NOT NULL,
        body TEXT NOT NULL,
        meta TEXT NOT NULL,
        created_at INTEGER NOT NULL
      );

      COMMIT;

      PRAGMA user_version = ${DATABASE_VERSION};
    `);
  } catch (error) {
    console.error('Error migrating database', error);
  }
}