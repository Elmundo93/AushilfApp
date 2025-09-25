// components/services/Chat/chatOutbox.ts
import { v4 as uuid } from 'uuid';
import { sendMessageRpc } from './chatApi';
import { getDB } from '@/components/Crud/SQLite/bridge';
import { supabase } from '@/components/config/supabase';

export async function enqueueMessage(channelId: string, body: string, meta: any = {}) {
  const db = getDB();
  const clientId = uuid();
  const now = Date.now();

  // aktuelle User-ID laden
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user?.id) throw new Error('User not authenticated');
  const currentUserId = data.user.id;

  await db.withTransactionAsync(async () => {
    await db.runAsync(
      `INSERT OR REPLACE INTO outbox_messages (client_id, channel_id, body, meta, created_at)
       VALUES (?, ?, ?, ?, ?)`,
      [clientId, channelId, body, JSON.stringify(meta), now]
    );
    await db.runAsync(
      `INSERT OR REPLACE INTO messages_local
       (id, channel_id, sender_id, body, created_at, edited_at, deleted_at, client_id, meta, sync_state)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [clientId, channelId, currentUserId, body, now, null, null, clientId, JSON.stringify(meta)]
    );
  });

  return clientId;
}

export async function uploadOutbox(currentUserId: string) {
  const db = getDB();
  const rows = await db.getAllAsync(`select * from outbox_messages order by created_at asc limit 20`) as any[];

  for (const r of rows) {
    try {
      const realId = await sendMessageRpc(r.channel_id, r.body, r.client_id, JSON.parse(r.meta));
      await db.withTransactionAsync(async () => {
        await db.runAsync(`delete from outbox_messages where client_id = ?`, [r.client_id]);
        await db.runAsync(
          `update messages_local
             set id = ?, sender_id = ?, sync_state = 'synced'
           where client_id = ?`,
          [realId, currentUserId, r.client_id]
        );
      });
    } catch {
      await db.runAsync(
        `update messages_local
           set sync_state = 'failed'
         where client_id = ? and sync_state = 'pending'`,
        [r.client_id]
      );
    }
  }
}