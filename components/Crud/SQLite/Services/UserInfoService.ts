import { SQLiteDatabase } from 'expo-sqlite';
import { User } from '@/components/types/auth';

export async function saveUserInfo(db: SQLiteDatabase, user: User) {
  await db.execAsync(`DELETE FROM user_info_local;`);
  await db.runAsync(
    `INSERT INTO user_info_local (
      vorname, nachname, straße, hausnummer, plz, wohnort, email, telefonnummer, steuernummer
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      user.vorname ?? '',
      user.nachname ?? '',
      user.straße ?? '',
      user.hausnummer ?? '',
      user.plz ?? '',
      user.wohnort ?? '',
      user.email ?? '',
      user.telefonnummer ?? '',
      user.steuernummer ?? ''
    ]
  );
}

export async function loadUserInfo(db: SQLiteDatabase): Promise<User | null> {
  const result = await db.getFirstAsync<User>(`SELECT * FROM user_info_local LIMIT 1;`);
  return result ?? null;
}

export async function deleteUserInfo(db: SQLiteDatabase) {
  await db.execAsync(`DELETE FROM user_info_local;`);
}
