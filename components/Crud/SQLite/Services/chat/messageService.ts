// components/SQLite/Services/chat/messageService.ts
import type { SQLiteDatabase } from 'expo-sqlite';
import type { SyncState } from '@/components/types/chat';
import { jsonStr, nowUnix } from '@/components/utils/chatutils';

export async function insertLocalMessage(
  db: SQLiteDatabase,
  m: {
    id: string;
    channel_id: string;
    sender_id: string;
    body: string;
    created_at?: number;     // unix
    edited_at?: number | null;
    deleted_at?: number | null;
    client_id: string;
    meta?: any;
    sync_state: SyncState;
  }
) {
  await db.runAsync(
    `INSERT OR REPLACE INTO messages_local
      (id, channel_id, sender_id, body, created_at, edited_at, deleted_at, client_id, meta, sync_state)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      m.id,
      m.channel_id,
      m.sender_id,
      m.body,
      m.created_at ?? nowUnix(),
      m.edited_at ?? null,
      m.deleted_at ?? null,
      m.client_id,
      jsonStr(m.meta ?? {}),
      m.sync_state
    ]
  );
}

export async function insertOutbox(
  db: SQLiteDatabase,
  o: { client_id: string; channel_id: string; body: string; meta?: any; created_at?: number }
) {
  await db.runAsync(
    `INSERT OR REPLACE INTO outbox_messages (client_id, channel_id, body, meta, created_at)
     VALUES (?, ?, ?, ?, ?)`,
    [o.client_id, o.channel_id, o.body, jsonStr(o.meta ?? {}), o.created_at ?? nowUnix()]
  );
}