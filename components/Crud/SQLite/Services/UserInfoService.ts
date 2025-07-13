// components/services/sqlite/userService.ts
import { SQLiteDatabase } from 'expo-sqlite';
import { User } from '@/components/types/auth';

export async function saveUserInfo(db: SQLiteDatabase, user: User) {
  try {
    // Check if database is still valid
    if (!db || !user?.id) {
      console.warn('⚠️ Database or user not available for saveUserInfo');
      return;
    }

    await db.withExclusiveTransactionAsync(async () => {
      // delete old
      await db.runAsync('DELETE FROM user_info_local;');
      // insert new
      await db.runAsync(
        `INSERT OR REPLACE INTO user_info_local (
      id, created_at, location, vorname, nachname, email, profileImageUrl, bio,
      straße, hausnummer, plz, wohnort, telefonnummer, steuernummer, kategorien, onboarding_completed, is_id_verified
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
          JSON.stringify(user.kategorien ?? []),
          user.onboarding_completed ? 1 : 0,
          user.is_id_verified ? 1 : 0,
        ]
      );
    });
  } catch (error) {
    console.error('❌ Error saving user info:', error);
    // Don't throw the error to prevent app crashes
    // Just log it and continue
  }
}

export async function loadUserInfo(db: SQLiteDatabase): Promise<User | null> {
  try {
    // Check if database is still valid
    if (!db) {
      console.warn('⚠️ Database not available for loadUserInfo');
      return null;
    }

    const row = await db.getFirstAsync<any>(
      'SELECT * FROM user_info_local LIMIT 1;'
    );
    if (!row) return null;
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
      kategorien: row.kategorien ? JSON.parse(row.kategorien) : [],
      onboarding_completed: row.onboarding_completed === 1,
      is_id_verified: row.is_id_verified === 1,
    };
  } catch (error) {
    console.error('❌ Error loading user info:', error);
    return null;
  }
}

export async function deleteUserInfo(db: SQLiteDatabase) {
  try {
    // Check if database is still valid
    if (!db) {
      console.warn('⚠️ Database not available for deleteUserInfo');
      return;
    }

    // single exec – no need for a full transaction
    await db.runAsync('DELETE FROM user_info_local;');
  } catch (error) {
    console.error('❌ Error deleting user info:', error);
    // Don't throw the error to prevent app crashes
  }
}