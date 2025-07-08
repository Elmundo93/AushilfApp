// components/services/sqlite/channelService.ts
import { SQLiteDatabase } from 'expo-sqlite';
import { Channel } from 'stream-chat';
import { StoredChannel } from '@/components/types/stream';
import { dbMutex } from './dbMutex';
import { migrateDbIfNeeded } from '../DBSetup/DBSetup';

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
    custom_post_category_choosen: '', // This should be empty initially - user will set it locally
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
    const validCategories = ['gastro', 'garten', 'haushalt', 'soziales', 'handwerk', 'bildung'];
    const isValidCategory = (category: string) => validCategories.includes(category);

    console.log(`🔄 Speichere ${channels.length} Channels in SQLite (optimiert)...`);

    await dbMutex.runExclusive(async () => {
      await db.withExclusiveTransactionAsync(async () => {
        // Batch-Operation für bessere Performance
        if (channels.length === 0) {
          console.log('📝 Keine Channels zum Speichern');
          return;
        }

        // Hole existierende Kategorien für alle Channels auf einmal
        const cids = channels.map(c => c.cid);
        const existingChannels = await db.getAllAsync<{ cid: string; custom_post_category_choosen: string }>(
          'SELECT cid, custom_post_category_choosen FROM channels_fetched WHERE cid IN (' + 
          cids.map(cid => `'${cid}'`).join(',') + ')'
        );
        
        const existingCategoriesMap = new Map(
          existingChannels.map(ec => [ec.cid, ec.custom_post_category_choosen])
        );

        // Batch-Insert für Channels
        const channelValues = channels.map(channel => {
          const v = mapChannelToDbValues(channel);
          
          // Preserve valid user choice if exists
          const existingCategory = existingCategoriesMap.get(v.cid);
          if (existingCategory && isValidCategory(existingCategory)) {
            v.custom_post_category_choosen = existingCategory;
          }
          
          return `('${v.cid}', '${v.meId}', '${v.channel_id}', '${v.channel_type}', '${v.custom_post_category_choosen}', '${v.custom_post_option}', '${v.custom_post_category}', ${v.custom_post_id}, '${v.custom_post_user_id}', '${v.custom_post_vorname?.replace(/'/g, "''") || ''}', '${v.custom_post_nachname?.replace(/'/g, "''") || ''}', '${v.custom_post_profileImage || ''}', '${v.custom_post_userBio?.replace(/'/g, "''") || ''}', '${v.custom_user_vorname?.replace(/'/g, "''") || ''}', '${v.custom_user_nachname?.replace(/'/g, "''") || ''}', '${v.custom_user_profileImage || ''}', '${v.custom_user_userBio?.replace(/'/g, "''") || ''}', '${v.custom_user_id}', '${v.last_message_text?.replace(/'/g, "''") || ''}', ${v.last_message_at ? `'${v.last_message_at}'` : 'NULL'}, ${v.updated_at ? `'${v.updated_at}'` : 'NULL'}, ${v.created_at ? `'${v.created_at}'` : 'NULL'}, ${v.unread_count}, '${v.partner_user_id}')`;
        }).join(',');
        
        await db.runAsync(`
          INSERT OR REPLACE INTO channels_fetched (
            cid, meId, channel_id, channel_type, custom_post_category_choosen,
            custom_post_option, custom_post_category, custom_post_id, custom_post_user_id,
            custom_post_vorname, custom_post_nachname, custom_post_profileImage,
            custom_post_userBio, custom_user_vorname, custom_user_nachname,
            custom_user_profileImage, custom_user_userBio, custom_user_id,
            last_message_text, last_message_at, updated_at, created_at,
            unread_count, partner_user_id
          ) VALUES ${channelValues}
        `);
        
        console.log(`✅ ${channels.length} Channels erfolgreich gespeichert`);
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
    const channels = (await db.getAllAsync<StoredChannel>(
      'SELECT * FROM channels_fetched WHERE meId = ? ORDER BY last_message_at DESC;',
      [userId]
    )) || [];
    
    // Debug: Log what's loaded from database
    // console.log('🔍 Debugging channels loaded from SQLite:');
    // channels.forEach((channel, index) => {
    //   const effectiveCategory = (channel.custom_post_category_choosen && isValidCategory(channel.custom_post_category_choosen)) 
    //     ? channel.custom_post_category_choosen 
    //     : channel.custom_post_category;
    //   console.log(`SQLite Channel ${index}:`, {
    //     cid: channel.cid,
    //     custom_post_category: channel.custom_post_category,
    //     custom_post_category_choosen: channel.custom_post_category_choosen,
    //     effectiveCategory: effectiveCategory,
    //     isValid: channel.custom_post_category_choosen ? isValidCategory(channel.custom_post_category_choosen) : 'N/A'
    //   });
    // });
    
    return channels;
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

export async function adjustCategory(db: SQLiteDatabase, category: string, cid?: string) {
  try {
    // Validate that the category is valid
    const validCategories = ['gastro', 'garten', 'haushalt', 'soziales', 'handwerk', 'bildung'];
    if (!validCategories.includes(category)) {
      console.warn('⚠️ Invalid category provided:', category, 'Valid categories:', validCategories);
      throw new Error(`Invalid category: ${category}. Must be one of: ${validCategories.join(', ')}`);
    }

    // First, ensure the table exists
    const tableExists = await db.getFirstAsync<{ count: number }>(
      "SELECT COUNT(*) as count FROM sqlite_master WHERE type='table' AND name='channels_fetched'"
    );
    
    if (!tableExists || tableExists.count === 0) {
      console.error('❌ channels_fetched table does not exist. Running migration...');
      await migrateDbIfNeeded(db);
    }

    await dbMutex.runExclusive(async () => {
      await db.withExclusiveTransactionAsync(async () => {
        if (cid) {
          // Update specific channel
          await db.runAsync(
            'UPDATE channels_fetched SET custom_post_category_choosen = ? WHERE cid = ?', 
            [category, cid]
          );
          console.log('✅ Kategorie für Channel', cid, 'aktualisiert:', category);
        } else {
          // Update all channels (legacy behavior)
          await db.runAsync('UPDATE channels_fetched SET custom_post_category_choosen = ?', [category]);
          console.log('✅ Alle Channels Kategorie aktualisiert:', category);
        }
      });
    });
  } catch (err) {
    console.warn('⚠️ Fehler beim Anpassen der Kategorie:', err);
    throw err;
  }
}

export async function saveChannelObjects(
  db: SQLiteDatabase,
  channels: StoredChannel[]
): Promise<void> {
  try {
    const validCategories = ['gastro', 'garten', 'haushalt', 'soziales', 'handwerk', 'bildung'];
    const isValidCategory = (category: string) => validCategories.includes(category);

    await dbMutex.runExclusive(async () => {
      await db.withExclusiveTransactionAsync(async () => {
        for (const ch of channels) {
          // Check if this channel already exists and has a valid user-chosen category
          const existingChannel = await db.getFirstAsync<{ custom_post_category_choosen: string }>(
            'SELECT custom_post_category_choosen FROM channels_fetched WHERE cid = ?',
            [ch.cid]
          );
          
          // Only preserve existing user choice if it's a valid category
          if (existingChannel && existingChannel.custom_post_category_choosen && isValidCategory(existingChannel.custom_post_category_choosen)) {
            ch.custom_post_category_choosen = existingChannel.custom_post_category_choosen;
            console.log('✅ Preserved valid category choice for channel object:', ch.cid, 'category:', ch.custom_post_category_choosen);
          } else if (existingChannel && existingChannel.custom_post_category_choosen && !isValidCategory(existingChannel.custom_post_category_choosen)) {
            console.log('⚠️ Skipped invalid category for channel object:', ch.cid, 'invalid category:', existingChannel.custom_post_category_choosen);
          }
          
          await db.runAsync(
            `INSERT OR REPLACE INTO channels_fetched (
               cid, meId, channel_id, channel_type, custom_post_category_choosen,
               custom_post_option, custom_post_category, custom_post_id, custom_post_user_id,
               custom_post_vorname, custom_post_nachname, custom_post_profileImage,
               custom_post_userBio, custom_user_vorname, custom_user_nachname,
               custom_user_profileImage, custom_user_userBio, custom_user_id,
               last_message_text, last_message_at, updated_at, created_at,
               unread_count, partner_user_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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

export async function cleanupInvalidCategories(db: SQLiteDatabase) {
  try {
    const validCategories = ['gastro', 'garten', 'haushalt', 'soziales', 'handwerk', 'bildung'];
    
    await dbMutex.runExclusive(async () => {
      await db.withExclusiveTransactionAsync(async () => {
        // Get all channels with invalid custom_post_category_choosen
        const invalidChannels = await db.getAllAsync<{ cid: string; custom_post_category_choosen: string }>(
          'SELECT cid, custom_post_category_choosen FROM channels_fetched WHERE custom_post_category_choosen NOT IN (?, ?, ?, ?, ?, ?) AND custom_post_category_choosen != ""',
          validCategories
        );
        
        console.log('🔍 Found invalid categories:', invalidChannels);
        
        // Reset invalid categories to empty string
        for (const channel of invalidChannels) {
          await db.runAsync(
            'UPDATE channels_fetched SET custom_post_category_choosen = "" WHERE cid = ?',
            [channel.cid]
          );
          console.log('✅ Reset invalid category for channel:', channel.cid, 'from:', channel.custom_post_category_choosen);
        }
      });
    });
  } catch (error) {
    console.error('❌ Fehler beim Cleanup der invalid categories:', error);
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
    adjustCategory,
    cleanupInvalidCategories,
  };
}   