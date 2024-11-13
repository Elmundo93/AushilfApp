// postsDatabase.js

import * as SQLite from 'expo-sqlite';
import { fetchPosts } from '@/components/Crud/Post/FetchPost';

let db: SQLite.SQLiteDatabase;

export const initPostsDatabase = async () => {
  try {
    db = await SQLite.openDatabaseAsync('appDatabase.db');

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS Posts (
        id INTEGER PRIMARY KEY,
        created_at TEXT,
        location TEXT,
        nachname TEXT,
        vorname TEXT,
        option TEXT,
        category TEXT,
        profileImageUrl TEXT,
        long REAL,
        lat REAL,
        userBio TEXT,
        userId TEXT
      );
    `);

    console.log('Tabelle Posts erfolgreich erstellt oder existiert bereits.');
  } catch (error) {
    console.error('Fehler bei der Initialisierung der Posts-Datenbank:', error);
  }
};

export const savePostsToSQLite = async () => {
  try {
    const posts = await fetchPosts();

    await db.execAsync('BEGIN TRANSACTION;');

    await db.execAsync('DELETE FROM Posts;');

    for (const post of posts) {
      await db.runAsync(
        `INSERT OR REPLACE INTO Posts (
          id, created_at, location, nachname, vorname, option, category, profileImageUrl, long, lat, userBio, userId
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          post.id,
          post.created_at,
          post.location,
          post.nachname,
          post.vorname,
          post.option,
          post.category,
          post.profileImageUrl,
          post.long,
          post.lat,
          post.userBio,
          post.userId
        ]
      );
    }

    await db.execAsync('COMMIT;');

    console.log('Alle Posts wurden erfolgreich in SQLite gespeichert.');
  } catch (error) {
    await db.execAsync('ROLLBACK;');
    console.error('Fehler beim Speichern der Posts in SQLite:', error);
  }
};

export const getPostsFromSQLite = async () => {
  try {
    const posts = await db.getAllAsync('SELECT * FROM Posts ORDER BY created_at DESC;');
    return posts;
  } catch (error) {
    console.error('Fehler beim Abrufen der Posts aus SQLite:', error);
    return [];
  }
};