// components/Nachrichten/utils/extractPartnerData.ts
import type { ChannelRow, ChannelMeta } from '@/components/types/chat';

export interface PartnerData {
  userId: string;
  vorname?: string;
  nachname?: string;
  profileImageUrl?: string;
  bio?: string;
  kategorien?: string[]; // oder string[]/jsonb -> du nutzt .map(lower)
}

export function extractPartnerDataFromChannel(
  channel: ChannelRow, 
  currentUserId: string
): PartnerData | null {
  try {
    const raw = (channel.meta ?? '').trim?.() ?? '';
    const meta: ChannelMeta = raw ? JSON.parse(raw) : ({} as any);

    // 1) Neuer Weg: participants[]
    const participants = Array.isArray((meta as any).participants) ? (meta as any).participants : [];
    if (participants.length) {
      const partner = participants.find((p: any) => p?.user_id && p.user_id !== currentUserId);
      if (partner) {
        return {
          userId: partner.user_id,
          vorname: partner.vorname || undefined,
          nachname: partner.nachname || undefined,
          profileImageUrl: (partner.profileImageUrl || '') || undefined,
          bio: partner.bio || undefined,
          kategorien: Array.isArray(partner.kategorien) ? partner.kategorien : undefined,
        };
      }
    }

    // 2) Legacy: partner_snapshot
    const snap = (meta as any).partner_snapshot;
    if (snap?.user_id && snap.user_id !== currentUserId) {
      return {
        userId: snap.user_id,
        vorname: snap.vorname || undefined,
        nachname: snap.nachname || undefined,
        profileImageUrl: snap.profileImageUrl || undefined,
        bio: snap.bio || undefined,
        kategorien: Array.isArray(snap.kategorien) ? snap.kategorien : undefined,
      };
    }

    // 3) Fallback: initiator/recipient
    if ((meta as any).initiator_id && (meta as any).recipient_id) {
      const partnerId = (meta as any).initiator_id === currentUserId 
        ? (meta as any).recipient_id 
        : (meta as any).initiator_id;
      return { userId: partnerId };
    }

    return null;
  } catch {
    return null;
  }
}

export function getChannelDisplayName(channel: ChannelRow, currentUserId: string): string {
  const p = extractPartnerDataFromChannel(channel, currentUserId);
  if (p?.vorname && p?.nachname) return `${p.vorname} ${p.nachname}`;
  if (p?.vorname) return p.vorname;
  return 'Chat';
}

export function getChannelDisplayImage(channel: ChannelRow, currentUserId: string): string | null {
  const p = extractPartnerDataFromChannel(channel, currentUserId);
  const url = p?.profileImageUrl?.trim?.() ?? '';
  return url.length > 0 ? url : null;
}
