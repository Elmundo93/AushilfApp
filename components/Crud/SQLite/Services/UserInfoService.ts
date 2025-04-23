import { SQLiteDatabase } from 'expo-sqlite';
import { User } from '@/components/types/auth';


export async function saveUserInfo(db: SQLiteDatabase, user: User) {
  // Alten Datensatz löschen
  await db.execAsync(`DELETE FROM user_info_local;`);

  // Alle Spalten befüllen – die Reihenfolge muss zur VALUES-Liste passen!
  await db.runAsync(
    `INSERT INTO user_info_local (
       id,
       created_at,
       location,
       vorname,
       nachname,
       email,
       profileImageUrl,
       bio,
       straße,
       hausnummer,
       plz,
       wohnort,
       telefonnummer,
       steuernummer
     ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?);`,
    [
      user.id ?? '',
      user.created_at ?? '',
      user.location ? JSON.stringify(user.location) : '',
      user.vorname ?? '',
      user.nachname ?? '',
      user.email ?? '',
      user.profileImageUrl ?? '',
      user.bio ?? '',
      user.straße ?? '',
      user.hausnummer ?? '',
      user.plz ?? '',
      user.wohnort ?? '',
      user.telefonnummer ?? '',
      user.steuernummer ?? '',
    ]
  );
}

export async function loadUserInfo(db: SQLiteDatabase): Promise<User | null> {
  const row = await db.getFirstAsync<any>(
    `SELECT * FROM user_info_local LIMIT 1;`
  );
  if (!row) return null;

  // Alle Spalten wieder in dein User-Objekt mappen
  return {
    id: row.id,
    created_at: row.created_at,
    location: row.location ? JSON.parse(row.location) : null,
    vorname: row.vorname,
    nachname: row.nachname,
    email: row.email,
    profileImageUrl: row.profileImageUrl,
    bio: row.bio,
    straße: row.straße,
    hausnummer: row.hausnummer,
    plz: row.plz,
    wohnort: row.wohnort,
    telefonnummer: row.telefonnummer,
    steuernummer: row.steuernummer,
  };
}

export async function deleteUserInfo(db: SQLiteDatabase) {
  await db.execAsync(`DELETE FROM user_info_local;`);
}

