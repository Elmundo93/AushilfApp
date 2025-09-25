// components/services/Chat/chatRealtime.ts
import { supabase } from '@/components/config/supabase';
import { getDB } from '@/components/Crud/SQLite/bridge';
import { liveBus, TOPIC } from '@/components/lib/liveBus';

export type ChannelEvent = 'INSERT' | 'UPDATE' | 'DELETE';
export type ChannelRowLocal = {
  id: string;
  custom_type: string | null;
  custom_category: string | null;
  updated_at: number;           // ms
  last_message_at: number | null;
  last_message_text: string | null;
  last_sender_id: string | null;
  meta: string;                 // JSON string (lokal)
};

export function subscribeChannels(
  onChange?: (row: ChannelRowLocal, event: ChannelEvent) => void
) {
  const db = getDB();

  const sub = supabase
    .channel('channels_all')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'channels' }, async (payload) => {
      const event = payload.eventType as ChannelEvent;

      if (event === 'DELETE') {
        const oldRow = payload.old as any;
        // sqlite up2date halten
        await db.runAsync(`delete from channels_local where id = ?`, [oldRow.id]);

        // snappy remove nach oben melden
        onChange?.(
          {
            id: oldRow.id,
            custom_type: null,
            custom_category: null,
            updated_at: 0,
            last_message_at: null,
            last_message_text: null,
            last_sender_id: null,
            meta: '{}',
          },
          'DELETE'
        );
        // 🔔 UI invalidieren
        liveBus.emit(TOPIC.CHANNELS);
        return;
      }

      const c = payload.new as any;

      // sqlite up2date
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

      // snappy row nach oben melden (direkt in Local-Format)
      onChange?.(
        {
          id: c.id,
          custom_type: c.custom_type ?? null,
          custom_category: c.custom_category ?? null,
          updated_at: new Date(c.updated_at).getTime(),
          last_message_at: c.last_message_at ? new Date(c.last_message_at).getTime() : null,
          last_message_text: c.last_message_text ?? null,
          last_sender_id: c.last_sender_id ?? null,
          meta: typeof c.meta === 'string' ? (c.meta || '{}') : JSON.stringify(c.meta ?? {}),
        },
        event
      );
      // 🔔 UI invalidieren
      liveBus.emit(TOPIC.CHANNELS);
    })
    .subscribe();

  return () => sub.unsubscribe();
}