// components/services/Chat/chatSync.ts
import { fetchChannelPage, fetchMessages, pageMessages } from './chatApi';
import { getDB } from '@/components/Crud/SQLite/bridge';

/** Channels initial/refresh sync: spiegelt neue Felder mit */
export async function syncChannelsOnce() {
  const db = getDB();
  const channels = await fetchChannelPage(100);

  await db.withTransactionAsync(async () => {
    for (const c of channels) {
      await db.runAsync(
        `insert or replace into channels_local
         (id, custom_type, custom_category, updated_at, last_message_at, last_message_text, last_sender_id, meta)
         values (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          c.id,
          c.custom_type ?? null,
          c.custom_category ?? null,
          new Date(c.updated_at).getTime(),
          c.last_message_at ? new Date(c.last_message_at).getTime() : null,
          c.last_message_text ?? null,
          c.last_sender_id ?? null,
          typeof c.meta === 'string' ? (c.meta || '{}') : JSON.stringify(c.meta ?? {}),
        ]
      );
    }
  });

  return channels.map((c: any) => c.id);
}

/** Erst-Befüllung eines Channels (aufsteigend) */
export async function backfillMessages(channelId: string, sinceMs?: number) {
  const db = getDB();
  const sinceIso = sinceMs ? new Date(sinceMs).toISOString() : undefined;
  const msgs = await fetchMessages(channelId, sinceIso, 500);

  await db.withTransactionAsync(async () => {
    for (const m of msgs) {
      await db.runAsync(
        `insert or replace into messages_local
         (id, channel_id, sender_id, body, created_at, edited_at, deleted_at, client_id, meta, sync_state)
         values (?, ?, ?, ?, ?, ?, ?, ?, ?, 'synced')`,
        [
          m.id,
          m.channel_id,
          m.sender_id,
          m.body,
          new Date(m.created_at).getTime(),
          m.edited_at ? new Date(m.edited_at).getTime() : null,
          m.deleted_at ? new Date(m.deleted_at).getTime() : null,
          m.client_id,
          JSON.stringify(m.meta ?? {}),
        ]
      );
    }
  });
}


/** Ältere Nachrichten via Seek-Pagination laden (für Infinite-Scroll nach oben) */
export async function loadOlderMessages(channelId: string, beforeCreatedMs?: number, beforeId?: string, limit = 50) {
  const db = getDB();
  const beforeCreatedIso = beforeCreatedMs ? new Date(beforeCreatedMs).toISOString() : undefined;
  const page = await pageMessages(channelId, beforeCreatedIso, beforeId, limit);

  // page ist absteigend; für lokale Speicherung egal – wir speichern und lesen sowieso sortiert
  await db.withTransactionAsync(async () => {
    for (const m of page) {
      await db.runAsync(
        `insert or replace into messages_local
         (id, channel_id, sender_id, body, created_at, edited_at, deleted_at, client_id, meta, sync_state)
         values (?, ?, ?, ?, ?, ?, ?, ?, ?, 'synced')`,
        [
          m.id,
          m.channel_id,
          m.sender_id,
          m.body,
          new Date(m.created_at).getTime(),
          m.edited_at ? new Date(m.edited_at).getTime() : null,
          m.deleted_at ? new Date(m.deleted_at).getTime() : null,
          m.client_id,
          JSON.stringify(m.meta ?? {}),
        ]
      );
    }
  });

  return page as any[];
}