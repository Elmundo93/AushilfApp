// hooks/useChannels.ts
import { useLiveQuery } from '@/components/hooks/useLiveQuery';
import { TOPIC } from '@/components/lib/liveBus';

export function useChannels(db: any, category?: string) {
  const sql = category
    ? `SELECT * FROM channels_local WHERE custom_category = ? ORDER BY last_message_at DESC, updated_at DESC`
    : `SELECT * FROM channels_local ORDER BY last_message_at DESC, updated_at DESC`;

  return useLiveQuery<any>(
    db,
    sql,
    category ? [category] : [],
    [TOPIC.CHANNELS]
  );
}