export type ChannelRow = {
  id: string;                 // uuid
  custom_type: string | null;
  custom_category: string | null;
  updated_at: number;         // ms epoch
  last_message_at: number | null;
  last_message_text: string | null;
  last_sender_id: string | null;
  meta: ChannelMeta;               // JSON string
};

export type MessageRow = {
  id: string;                 // uuid ODER client_id bei pending/local
  channel_id: string;
  sender_id: string;
  body: string;
  created_at: number;         // ms epoch
  edited_at: number | null;
  deleted_at: number | null;
  client_id: string;          // idempotenz
  meta: string;               // JSON string
  sync_state: SyncState;
};

export type ChannelCustomType = 'direct' | 'post' | 'group';
export type ChannelCategory =
  | 'gastro' | 'garten' | 'haushalt' | 'soziales' | 'handwerk' | 'bildung';

export interface PartnerSnapshot {
  user_id: string;
  vorname?: string;
  nachname?: string;
  profileImageUrl?: string;
}

export interface PostSnapshot {
  id: number | string;
  userId: string;
  category: ChannelCategory;
  previewText?: string;
}

export interface ChannelMeta {
  origin: 'postDetail' | 'directStart' | 'system';
  post?: PostSnapshot;
  initiator_id: string;
  recipient_id: string;
  locale?: string;
  initial_message?: string;
  partner_snapshot?: PartnerSnapshot;
  permissions?: { allow_images?: boolean; allow_files?: boolean };
  [key: string]: any;
}

export type SyncState = 'pending' | 'synced' | 'failed' | 'local';

export interface InitOptions {
  showLoading?: boolean;
  onError?: (msg: string) => void;
  onSuccess?: (cid: string) => void;
}

export type Msg = {
  id: string;
  channel_id: string;
  sender_id: string;
  body: string;
  created_at: number; // ms epoch
  edited_at: number | null;
  deleted_at: number | null;
  client_id: string;
  meta: string;
  sync_state: 'pending'|'synced'|'failed'|'local';
};