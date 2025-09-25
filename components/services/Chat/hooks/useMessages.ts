// components/services/Chat/hooks/useMessages.ts
import { useLiveQuery } from '@/components/hooks/useLiveQuery';
import { TOPIC } from '@/components/lib/liveBus';

export function useMessages(db: any, channelId: string, limit = 50, beforeCreated?: number, beforeId?: string) {
  // Seek-Pagination in SQL; initial: ohne 'before' die neuesten N:
  const base = `
  SELECT * FROM messages_local
  WHERE channel_id = ?
    ${beforeCreated ? 'AND (created_at < ? OR (created_at = ? AND id < ?))' : ''}
    AND (sync_state IN ('pending','synced','local')) -- 'failed' ausblenden (optional)
  ORDER BY created_at DESC, id DESC
  LIMIT ?
`;
  const params = beforeCreated
    ? [channelId, beforeCreated, beforeCreated, beforeId, limit]
    : [channelId, limit];

  return useLiveQuery<any>(
    db,
    base,
    params,
    [TOPIC.MESSAGES(channelId)]
  );
}