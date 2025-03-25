import { useSQLiteContext } from 'expo-sqlite';
import { Channel as StreamChannel } from 'stream-chat';

export function useChannelService() {
  const db = useSQLiteContext();

    async function getChannels() {
    const channels = await db.getAllAsync<StreamChannel>('SELECT * FROM channels_fetched');
    console.log('getChannels', channels)
    return channels
  }

  async function getChannelsForUser(userId: string) {
    return await db.getAllAsync<StreamChannel>('SELECT * FROM channels_fetched WHERE userId = ?', [userId]);
  }

  async function addChannels(channels: StreamChannel[]) {
    try {
      console.log('channels', channels)
      await db.execAsync('BEGIN TRANSACTION;');
  
      // Wenn du vorher die Tabelle leeren willst
      await db.execAsync('DELETE FROM channels_fetched;');
  
      for (const channel of channels) {
        // Extrahierung und sichere Fallbacks
        const cid = channel.cid || '';
        const channelId = channel.id || '';
        const channelType = channel.type || '';
        const custom_post_category = typeof channel.data?.custom_post_category === 'string' 
          ? channel.data.custom_post_category 
          : ' ';
        const custom_post_id = typeof channel.data?.custom_post_id === 'number' 
          ? channel.data.custom_post_id 
          : null;
        const custom_post_user_id = typeof channel.data?.custom_post_user_id === 'string'
          ? channel.data.custom_post_user_id
          : ' ';
        const custom_user_vorname = typeof channel.data?.custom_user_vorname === 'string'
          ? channel.data.custom_user_vorname
          : ' ';
        const custom_user_nachname = typeof channel.data?.custom_user_nachname === 'string'
          ? channel.data.custom_user_nachname
          : ' ';
        const custom_user_profileImage = typeof channel.data?.custom_user_profileImage === 'string'
          ? channel.data.custom_user_profileImage
          : ' ';
        const custom_user_userBio = typeof channel.data?.custom_user_userBio === 'string'
          ? channel.data.custom_user_userBio
          : ' ';
  
        // last_message_at, updated_at, created_at sollten Strings oder null sein
        const last_message_at = typeof channel.data?.last_message_at === 'string'
          ? channel.data.last_message_at
          : ' ';
        const updated_at = typeof channel.data?.updated_at === 'string'
          ? channel.data.updated_at
          : ' ';
        const created_at = typeof channel.data?.created_at === 'string'
          ? channel.data.created_at
          : ' ';
        const unreadCount = typeof channel.data?.unreadCount =='string'
        ? channel.data.unreadCount
        : ' ';
        
        await db.runAsync(
          `INSERT INTO channels_fetched (
              cid, channel_id, channel_type, custom_post_category, custom_post_id, 
              custom_post_user_id, custom_user_vorname, custom_user_nachname, 
              custom_user_profileImage, custom_user_userBio, last_message_at, updated_at, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
          [
            cid,
            channelId,
            channelType,
            custom_post_category,
            custom_post_id,
            custom_post_user_id,
            custom_user_vorname,
            custom_user_nachname,
            custom_user_profileImage,
            custom_user_userBio,
            last_message_at,
            updated_at,
            created_at,
            unreadCount
          ]
        );
        console.log('channel saved:', channel.cid) 
      }
  
      await db.execAsync('COMMIT;');
      console.log('Fetched channels successfully stored in channels_fetched table.');
    } catch (error) {
      await db.execAsync('ROLLBACK;');
      console.error('Error storing fetched channels in channels_fetched table:', error);
    }
  }
  

  return {
    getChannels,
    addChannels,
    getChannelsForUser,
  };
}