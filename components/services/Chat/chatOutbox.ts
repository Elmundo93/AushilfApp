import { v4 as uuid } from 'uuid';
import { sendMessageRpc } from './chatApi';
import { getDB } from '@/components/Crud/SQLite/bridge';

export async function enqueueMessage(channelId: string, body: string, meta: any = {}) {
  const db = getDB();
  const clientId = uuid();
  const now = Date.now();

  await db.withTransactionAsync(async () => {
    await db.runAsync(
      `insert into outbox_messages (client_id, channel_id, body, meta, created_at)
       values (?, ?, ?, ?, ?)`,
      [clientId, channelId, body, JSON.stringify(meta), now]
    );
    await db.runAsync(
      `insert or replace into messages_local
       (id, channel_id, sender_id, body, created_at, edited_at, deleted_at, client_id, meta, sync_state)
       values (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [clientId, channelId, '', body, now, null, null, clientId, JSON.stringify(meta)]
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