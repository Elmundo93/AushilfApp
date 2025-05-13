// components/services/sqlite/channelService.ts
import { SQLiteDatabase } from 'expo-sqlite';
import { Channel } from 'stream-chat';
import { StoredChannel } from '@/components/types/stream';

function formatMaybeDate(input: string | Date | undefined | null): string | null {
  if (!input) return null;
  const d = input instanceof Date ? input : new Date(input);
  return isNaN(d.getTime()) ? null : d.toISOString();
}

export function useChannelServices() {
  function mapChannelToDbValues(channel: Channel): StoredChannel {
    const lastMsg = channel.state.messages?.slice(-1)[0];
    const partner = Object.values(channel.state.members)
      .find((m) => m.user?.id !== channel.getClient().userID)
      ?.user as any;

    return {
      cid: channel.cid,
      channel_id: channel.id || '',
      channel_type: channel.type,
      custom_post_category: (channel.data?.custom_post_category as string) || null,
      custom_post_id: (channel.data?.custom_post_id as number) || null,
      custom_post_user_id: (channel.data?.custom_post_user_id as string) || null,
      custom_user_vorname: partner?.vorname || '',
      custom_user_nachname: partner?.nachname || '',
      custom_user_profileImage: partner?.image || '',
      custom_user_userBio: partner?.userBio || '',
      last_message_text: lastMsg?.text || '',
      last_message_at: lastMsg?.created_at?.toISOString() || null,
      updated_at: formatMaybeDate(channel.data?.updated_at as any),
      created_at: formatMaybeDate(channel.data?.created_at as any),
      unread_count: channel.countUnread(),
      partner_user_id: partner?.id || null,
    };
  }

  /**
   * Persist an array of Stream channels into SQLite in one atomic batch.
   */
  async function saveChannelsToDb(
    db: SQLiteDatabase,
    channels: Channel[]
  ): Promise<void> {
    try {
      await db.withExclusiveTransactionAsync(async () => {
        // (Optional) clear out old rows first:
        // await db.execAsync('DELETE FROM channels_fetched;');

        for (const channel of channels) {
          const v = mapChannelToDbValues(channel);
          await db.runAsync(
            `INSERT OR REPLACE INTO channels_fetched (
               cid, channel_id, channel_type, custom_post_category,
               custom_post_id, custom_post_user_id, custom_user_vorname,
               custom_user_nachname, custom_user_profileImage, custom_user_userBio,
               last_message_text, last_message_at, updated_at, created_at,
               unread_count, partner_user_id
             ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            Object.values(v)
          );
        }
      });
    } catch (error) {
      console.error('❌ Fehler beim Speichern der Channels in SQLite:', error);
      throw error;
    }
  }

  async function getChannelsFromDb(
    db: SQLiteDatabase
  ): Promise<StoredChannel[]> {
    try {
      return (
        (await db.getAllAsync<StoredChannel>(
          'SELECT * FROM channels_fetched ORDER BY last_message_at DESC;'
        )) || []
      );
    } catch (error) {
      console.error('❌ Fehler beim Laden der Channels aus SQLite:', error);
      return [];
    }
  }

  /**
   * If you ever need to bulk‐write already‐mapped StoredChannel objects,
   * use the same exclusive-transaction approach.
   */
  async function saveChannelObjects(
    db: SQLiteDatabase,
    channels: StoredChannel[]
  ): Promise<void> {
    try {
      await db.withExclusiveTransactionAsync(async () => {
        for (const ch of channels) {
          await db.runAsync(
            `INSERT OR REPLACE INTO channels_fetched (
               cid, channel_id, channel_type, custom_post_category,
               custom_post_id, custom_post_user_id, custom_user_vorname,
               custom_user_nachname, custom_user_profileImage, custom_user_userBio,
               last_message_text, last_message_at, updated_at, created_at,
               unread_count, partner_user_id
             ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            Object.values(ch)
          );
        }
      });
    } catch (error) {
      console.error('❌ Fehler beim Speichern der Channel-Objekte in SQLite:', error);
      throw error;
    }
  }

  return {
    mapChannelToDbValues,
    saveChannelsToDb,
    getChannelsFromDb,
    saveChannelObjects,
  };
}