// components/services/Chat/chatInit.ts
import type { SQLiteDatabase } from 'expo-sqlite';

import { ensure1on1Channel, setChannelMeta } from './chatApi';
import { upsertChannelLocal } from '@/components/Crud/SQLite/Services/chat/channelService';
import { upsertMembershipsLocal } from '@/components/Crud/SQLite/Services/chat/memberService';
import { upsertProfileSnapshot } from '@/components/Crud/SQLite/Services/chat/profileService';
import { enqueueMessage } from './chatOutbox';
import { nowUnix } from '@/components/utils/chatutils';
import type { ChannelCategory, ChannelMeta, InitOptions } from '@/components/types/chat';
import { liveBus, TOPIC } from '@/components/lib/liveBus';

type InitArgs = {
  db: SQLiteDatabase;
  currentUser: { id: string; vorname?: string; nachname?: string; profileImageUrl?: string };
  selectedPost: {
    id: number | string;
    userId: string;
    category: ChannelCategory;
    postText?: string;
    vorname?: string;
    nachname?: string;
    profileImageUrl?: string;
  };
  opts?: InitOptions;
};



/**
 * Prüft, ob der Channel bereits in der lokalen Datenbank existiert
 */
async function channelExistsLocally(db: SQLiteDatabase, cid: string): Promise<boolean> {
  try {
    console.log('cid', cid);
    const result = await db.getFirstAsync<{ count: number }>(
      `SELECT COUNT(*) as count FROM channels_local WHERE id = ?`,
      [cid]
    );
    console.log('result', result);
    console.log('result.count', result?.count);
    
    return (result?.count || 0) > 0;
  } catch (e) {
    console.warn('[channelExistsLocally] Fehler beim Prüfen des lokalen Channels:', e);
    return false;
  }
}

/**
 * Prüft, ob bereits eine Initial-Nachricht im Channel existiert
 */
async function hasInitialMessage(db: SQLiteDatabase, channelId: string): Promise<boolean> {
  try {
    const result = await db.getFirstAsync<{ count: number }>(
      `SELECT COUNT(*) as count FROM messages_local 
       WHERE channel_id = ? AND meta LIKE '%"custom_type":"initial"%'`,
      [channelId]
    );
    
    return (result?.count || 0) > 0;
  } catch (e) {
    console.warn('[hasInitialMessage] Fehler beim Prüfen der Initial-Nachricht:', e);
    return false;
  }
}

export async function initializeChatWithPost(args: InitArgs): Promise<string | null> {
  const { db, currentUser, selectedPost, opts } = args;

  try {
    const initiator_id = currentUser.id;
    const recipient_id = selectedPost.userId;
    if (!initiator_id || !recipient_id) throw new Error('User-IDs fehlen');

    console.log(`🔍 Initialisiere Chat zwischen ${initiator_id} und ${recipient_id}`);

    // ChannelMeta definieren
    const meta: ChannelMeta = {
      origin: 'postDetail',
      initiator_id,
      recipient_id,
      locale: 'de',
      initial_message: 'Hallo! Ich interessiere mich für deinen Beitrag. 😊',
      post: {
        id: selectedPost.id,
        userId: selectedPost.userId,
        category: selectedPost.category,
        previewText: (selectedPost.postText || '').slice(0, 140),
      },
      partner_snapshot: {
        user_id: recipient_id,
        vorname: selectedPost.vorname,
        nachname: selectedPost.nachname,
        profileImageUrl: selectedPost.profileImageUrl,
      },
    };

    // ensure1on1Channel prüft bereits auf existierende Channels und erstellt nur bei Bedarf einen neuen
    const cid = await ensure1on1Channel(recipient_id);
    console.log(`✅ Channel bereit: ${cid}`);

    // Prüfe, ob der Channel bereits lokal existiert
    const channelExists = await channelExistsLocally(db, cid);
    
    if (!channelExists) {
      console.log(`📝 Channel existiert nicht lokal, füge hinzu...`);
      
      // Meta für Channel setzen
      await setChannelMeta(cid, {
        custom_type: 'post',
        custom_category: selectedPost.category,
        meta, 
      });

      // Lokale Spiegelung nur für neue Channels
      const now = nowUnix();

      await upsertChannelLocal(db, {
        id: cid,
        custom_category: selectedPost.category,
        custom_type: 'post',
        last_message_text: (selectedPost.postText || '').slice(0, 100),
        last_message_at: null,
        last_sender_id: null,
        meta,
      });

      await upsertMembershipsLocal(db, [
        { channel_id: cid, user_id: initiator_id, role: 'member', muted: false, joined_at: now },
        { channel_id: cid, user_id: recipient_id, role: 'member', muted: false, joined_at: now },
      ]);

      await upsertProfileSnapshot(db, {
        id: recipient_id,
        vorname: meta.partner_snapshot?.vorname,
        nachname: meta.partner_snapshot?.nachname,
        avatar_url: meta.partner_snapshot?.profileImageUrl,
      });
    } else {
      console.log(`✅ Channel existiert bereits lokal`);
    }

    // Prüfe, ob bereits eine Initial-Nachricht existiert
    const hasInitial = await hasInitialMessage(db, cid);
    
    if (!hasInitial) {
      console.log(`📝 Füge Initial-Nachricht hinzu...`);
      
      // Initial-Nachricht hinzufügen
      const initBody = meta.initial_message ?? 'Hallo! Ich interessiere mich für deinen Beitrag. 😊';
      await enqueueMessage(cid, initBody, {
        custom_type: 'initial',
        by: 'system',
        post: meta.post, 
        partner_snapshot: meta.partner_snapshot,
      });
    } else {
      console.log(`✅ Initial-Nachricht bereits vorhanden`);
    }

    // UI invalidieren
    liveBus.emit(TOPIC.CHANNELS);
    liveBus.emit(TOPIC.MESSAGES(cid));
    opts?.onSuccess?.(cid);
    return cid;
  } catch (e: any) {
    console.error('[initializeChatWithPost] failed:', e);
    opts?.onError?.(e.message ?? 'Chat konnte nicht gestartet werden');
    return null;
  }
}