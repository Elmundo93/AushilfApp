import { useEffect, useState } from 'react';
import { getDB } from '@/components/Crud/SQLite/bridge';
import { syncChannelsOnce } from '@/components/services/Chat/chatSync';

export function useChannels() {
  const db = getDB();
  const [channels, setChannels] = useState<any[]>([]);

  useEffect(() => {
    const read = async () =>
      await db.getAllAsync<any>(
        `select * from channels_local
         order by (last_message_at is null), last_message_at desc`
      );

    const init = async () => {
      setChannels(await read());
      await syncChannelsOnce();
      setChannels(await read());
    };

    void init();
  }, [db]);

  return channels;
}