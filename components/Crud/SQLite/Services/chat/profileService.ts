// components/SQLite/Services/chat/profileService.ts
import type { SQLiteDatabase } from 'expo-sqlite';

export async function upsertProfileSnapshot(
  db: SQLiteDatabase,
  p: { id: string; vorname?: string; nachname?: string; avatar_url?: string }
) {
  await db.runAsync(
    `INSERT OR REPLACE INTO profiles_local (id, vorname, nachname, name, avatar_url, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      p.id,
      p.vorname ?? null,
      p.nachname ?? null,
      [p.vorname, p.nachname].filter(Boolean).join(' ') || null,
      p.avatar_url ?? null,
      Date.now()
    ]
  );
}