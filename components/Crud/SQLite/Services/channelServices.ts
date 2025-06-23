// components/services/sqlite/channelService.ts
import { SQLiteDatabase } from 'expo-sqlite';
import { Channel } from 'stream-chat';
import { StoredChannel } from '@/components/types/stream';
import { dbMutex } from './dbMutex';

function formatMaybeDate(input: string | Date | undefined | null): string | null {
  if (!input) return null;
  const d = input instanceof Date ? input : new Date(input);
  return isNaN(d.getTime()) ? null : d.toISOString();
}

function safeGetPartner(channel: Channel): any {
  try {
    const meId = channel.getClient().userID;
    return Object.values(channel.state.members).find((m) => m.user?.id !== meId)?.user || {};
  } catch (e) {
    console.warn('[WARN] Partnerdaten konnten nicht extrahiert werden:', e);
    return {};
  }
}

export function mapChannelToDbValues(channel: Channel): StoredChannel {
  if (!channel) {
    console.warn('[WARN] mapChannelToDbValues: channel ist undefined/null');
    return {} as StoredChannel;
  }
  const lastMsg = channel.state?.messages?.slice(-1)[0] || {};
  const meId = channel.getClient().userID;
  const partner = safeGetPartner(channel);

  return {
    cid: channel.cid,
    meId: channel.getClient().userID || '',
    channel_id: channel.id || '',
    channel_type: channel.type,
    custom_post_option: (channel.data?.custom_post_option as string) || '',
    custom_post_category: (channel.data?.custom_post_category as string) || '',
    custom_post_id: (channel.data?.custom_post_id as number) || 0,
    custom_post_user_id: (channel.data?.custom_post_user_id as string) || '',
    custom_post_vorname: (channel.data?.custom_post_vorname as string) || '',
    custom_post_nachname: (channel.data?.custom_post_nachname as string) || '',
    custom_post_profileImage: (channel.data?.custom_post_profileImage as string) || '',
    custom_post_userBio: (channel.data?.custom_post_userBio as string) || '',
    custom_user_vorname: partner?.vorname || '',
    custom_user_nachname: partner?.nachname || '',
    custom_user_profileImage: partner?.image || '',
    custom_user_userBio: partner?.userBio || '',
    custom_user_id: partner?.id || '',
    last_message_text: lastMsg?.text || '',
    last_message_at: lastMsg?.created_at?.toISOString() || null,
    updated_at: formatMaybeDate(channel.data?.updated_at as any),
    created_at: formatMaybeDate(channel.data?.created_at as any),
    unread_count: channel.countUnread(),
    partner_user_id: partner?.id || '',
  };
}

export async function saveChannelsToDb(
  db: SQLiteDatabase,
  channels: Channel[]
): Promise<void> {
  try {
    await dbMutex.runExclusive(async () => {
      await db.withExclusiveTransactionAsync(async () => {
        for (const channel of channels) {
          const v = mapChannelToDbValues(channel);
          await db.runAsync(
            `INSERT OR REPLACE INTO channels_fetched (
               cid,  meId, channel_id, channel_type, custom_post_option,
               custom_post_category, custom_post_id, custom_post_user_id,
               custom_post_vorname, custom_post_nachname, custom_post_profileImage,
               custom_post_userBio, custom_user_vorname, custom_user_nachname,
               custom_user_profileImage, custom_user_userBio, custom_user_id,
               last_message_text, last_message_at, updated_at, created_at,
               unread_count, partner_user_id
             ) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            Object.values(v)
          );
        }
      });
    });
  } catch (error) {
    console.error('❌ Fehler beim Speichern der Channels in SQLite:', error);
    throw error;
  }
}

export async function getChannelsFromDb(
  db: SQLiteDatabase,
  userId: string
): Promise<StoredChannel[]> {
  try {
    return (
      (await db.getAllAsync<StoredChannel>(
        'SELECT * FROM channels_fetched WHERE meId = ? ORDER BY last_message_at DESC;',
        [userId]
      )) || []
    );
  } catch (error) {
    console.error('❌ Fehler beim Laden der Channels aus SQLite:', error);
    return [];
  }
}

export async function handlePostSignupCleanup(db: SQLiteDatabase) {
  try {
    await dbMutex.runExclusive(async () => {
      await db.withExclusiveTransactionAsync(async () => {
        await db.runAsync('DELETE FROM channels_fetched');
        await db.runAsync('DELETE FROM messages_fetched');
      });
    });
    console.log('✅ SQLite Cleanup nach Registrierung durchgeführt');
  } catch (err) {
    console.warn('⚠️ SQLite Cleanup fehlgeschlagen:', err);
    throw err;
  }
}

export async function saveChannelObjects(
  db: SQLiteDatabase,
  channels: StoredChannel[]
): Promise<void> {
  try {
    await dbMutex.runExclusive(async () => {
      await db.withExclusiveTransactionAsync(async () => {
        for (const ch of channels) {
          await db.runAsync(
            `INSERT OR REPLACE INTO channels_fetched (
               cid, meId, channel_id, channel_type, custom_post_option,
               custom_post_category, custom_post_id, custom_post_user_id,
               custom_post_vorname, custom_post_nachname, custom_post_profileImage,
               custom_post_userBio, custom_user_vorname, custom_user_nachname,
               custom_user_profileImage, custom_user_userBio, custom_user_id,
               last_message_text, last_message_at, updated_at, created_at,
               unread_count, partner_user_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            Object.values(ch)
          );
        }
      });
    });
  } catch (error) {
    console.error('❌ Fehler beim Speichern der Channel-Objekte in SQLite:', error);
    throw error;
  }
}

export function useChannelServices() {
  return {
    mapChannelToDbValues,
    saveChannelsToDb,
    getChannelsFromDb,
    saveChannelObjects,
    handlePostSignupCleanup,
  };
}   