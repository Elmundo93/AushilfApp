// components/SQLite/Services/chat/memberService.ts
import type { SQLiteDatabase } from 'expo-sqlite';

export async function upsertMembershipsLocal(
  db: SQLiteDatabase,
  entries: Array<{
    channel_id: string;
    user_id: string;
    role?: string | null;
    muted?: boolean;
    joined_at?: number | null;
  }>
) {
  const stmt = await db.prepareAsync(
    `INSERT OR REPLACE INTO channel_members_local
      (channel_id, user_id, role, muted, joined_at)
     VALUES (?, ?, ?, ?, ?)`
  );
  try {
    for (const e of entries) {
      await stmt.executeAsync([
        e.channel_id,
        e.user_id,
        e.role ?? 'member',
        e.muted ? 1 : 0,
        e.joined_at ?? null
      ]);
    }
  } finally {
    await stmt.finalizeAsync();
  }
}