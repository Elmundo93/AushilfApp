type Chat = {
    id: string;
    user1: string;
    user2: string;
    blocked_by: string | null;
    created_at: string;
  
    post_id?: string;
    post_text?: string;
    category?: string;
    option?: string;
  
    post_author_id?: string;
    post_author_vorname?: string;
    post_author_nachname?: string;
    post_author_profile_image?: string;
    post_author_bio?: string;
  
    initiator_vorname?: string;
    initiator_nachname?: string;
    initiator_profile_image?: string;
    initiator_bio?: string;
  };

  // components/types/chat.ts
export type ChannelRow = {
  id: string;                 // uuid
  custom_type: string | null;
  custom_category: string | null;
  updated_at: number;         // ms epoch
  last_message_at: number | null;
  last_message_text: string | null;
  last_sender_id: string | null;
  meta: string;               // JSON string
};

export type MessageRow = {
  id: string;                 // uuid ODER client_id bei pending
  channel_id: string;
  sender_id: string;
  body: string;
  created_at: number;         // ms epoch
  edited_at: number | null;
  deleted_at: number | null;
  client_id: string;          // idempotenz
  meta: string;               // JSON string
  sync_state: 'pending' | 'synced' | 'failed';
};