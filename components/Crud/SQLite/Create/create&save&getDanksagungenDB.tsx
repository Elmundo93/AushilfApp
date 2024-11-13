import * as SQLite from 'expo-sqlite';
import { Danksagung } from '@/components/types/Danksagungen';
import { fetchDanksagungen } from '@/components/Crud/Danksagungen/fetchDanksagung';

// SQLite-Datenbank initialisieren
let db: SQLite.SQLiteDatabase;

export const initDanksagungenDatabase = async () => {
  try {
    db = await SQLite.openDatabaseAsync('appDatabase.db');

    // Tabelle erstellen
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS Danksagungen (
        id TEXT PRIMARY KEY,
        created_at TEXT,
        vorname TEXT,
        nachname TEXT,
        writtenText TEXT,
        userId TEXT,
        profileImage TEXT,
        location TEXT,
        authorId TEXT,
        long REAL,
        lat REAL,
        userBio TEXT
      );
    `);

    console.log('Tabelle Danksagungen erfolgreich erstellt oder existiert bereits.');
  } catch (error) {
    console.error('Fehler bei der Initialisierung der Datenbank:', error);
  }
};

// Funktion zum Speichern der gefetchten Danksagungen in die SQLite-Datenbank
export const saveDanksagungenToSQLite = async () => {
  try {
    const danksagungen = await fetchDanksagungen();

    // Beginne eine Transaktion
    await db.execAsync('BEGIN TRANSACTION;');

    await db.execAsync('DELETE FROM Danksagungen;');

    for (const danksagung of danksagungen) {
      await db.runAsync(
        `INSERT OR REPLACE INTO Danksagungen (
          id, created_at, vorname, nachname, writtenText, userId, profileImage, location, authorId, long, lat, userBio
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          danksagung.id,
          danksagung.created_at,
          danksagung.vorname,
          danksagung.nachname,
          danksagung.writtenText,
          danksagung.userId,
          danksagung.profileImage,
          danksagung.location,
          danksagung.authorId,
          danksagung.long,
          danksagung.lat,
          danksagung.userBio,
        ]
      );
    }

    // Transaktion abschließen
    await db.execAsync('COMMIT;');

    console.log('Alle Danksagungen wurden erfolgreich in SQLite gespeichert.');
  } catch (error) {
    // Bei Fehlern Transaktion zurückrollen
    await db.execAsync('ROLLBACK;');
    console.error('Fehler beim Speichern der Danksagungen in SQLite:', error);
  }
};

export const getDanksagungenFromSQLite = async (userId: string) => {
  try {
    const danksagungen = await db.getAllAsync(
      'SELECT * FROM Danksagungen WHERE userId = ? ORDER BY created_at DESC;',
      [userId]
    );
    return danksagungen;
  } catch (error) {
    console.error('Fehler beim Abrufen der Danksagungen aus SQLite:', error);
    return [];
  }
};

// Datenbank initialisieren
initDanksagungenDatabase();