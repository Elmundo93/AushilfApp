// components/SQLite/Services/chat/channelService.ts
import type { SQLiteDatabase } from 'expo-sqlite';
import type { ChannelCategory, ChannelMeta, ChannelCustomType } from '@/components/types/chat';
import { jsonStr, nowUnix } from '@/components/utils/chatutils';

export async function upsertChannelLocal(
  db: SQLiteDatabase,
  params: {
    id: string;
    custom_category: ChannelCategory;
    custom_type: ChannelCustomType;
    last_message_text?: string;
    last_message_at?: number | null;
    last_sender_id?: string | null;
    meta: ChannelMeta;
  }
) {
  const {
    id, custom_category, custom_type,
    last_message_text, last_message_at, last_sender_id, meta
  } = params;

  const updated_at = nowUnix();

  await db.runAsync(
    `INSERT OR REPLACE INTO channels_local
      (id, custom_type, custom_category, updated_at, last_message_at, last_message_text, last_sender_id, meta)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      custom_type,
      custom_category,
      updated_at,
      last_message_at ?? null,
      last_message_text ?? null,
      last_sender_id ?? null,
      jsonStr(meta),
    ]
  );
}

export async function getChannelLocal(db: SQLiteDatabase, id: string) {
  return db.getFirstAsync<any>(
    `SELECT * FROM channels_local WHERE id = ? LIMIT 1`,
    [id]
  );
}

export async function adjustChannelLocal(
  db: SQLiteDatabase,
  id: string,
  customCategory: string,
  opts?: { updated_at?: number }
) {
  const fields: string[] = ['custom_category = ?'];
  const values: any[] = [customCategory];

  if (typeof opts?.updated_at === 'number') {
    fields.push('updated_at = ?');
    values.push(opts?.updated_at);
  }
  values.push(id);

  await db.runAsync(
    `UPDATE channels_local SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
}