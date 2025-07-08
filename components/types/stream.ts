import { Channel as ChannelType } from "stream-chat";



export interface CategoryStyles {
  backgroundColor: string;
}

export interface CategoryIcons {
  [key: string]: any;
}

export type CategoryType = 'garten' | 'haushalt' | 'gastro' | 'soziales' | 'handwerk' | 'bildung';


export type ChannelMetadata = {
    postVorname?: string;
    postNachname?: string;
    postLocation?: string;
    postOption?: string;
    postCategory?: string;
    userVorname?: string;
    userNachname?: string;
    userLocation?: string;
    userProfilImage?: string;
    postProfilImage?: string;
  };
  


  // types/stream.ts



  export interface ChannelPreviewProps {
    channel: StoredChannel;
    onSelect: (channel: StoredChannel) => void;
  }

export interface StoredChannel {
  cid: string;
  meId: string; 
  channel_id: string;
  channel_type: string;
  custom_post_category_choosen: string;
  custom_post_option: string;
  custom_post_category: string;
  custom_post_id: number;
  custom_post_user_id: string;
  custom_post_vorname: string;
  custom_post_nachname: string;
  custom_post_profileImage: string;
  custom_post_userBio: string;
  custom_user_vorname: string;
  custom_user_nachname: string;
  custom_user_profileImage: string;
  custom_user_userBio: string;
  custom_user_id: string;
  last_message_text: string;
  last_message_at: string | null;
  updated_at: string | null;
  created_at: string | null;
  unread_count: number;
  partner_user_id: string;
}
export interface ChatMessage {
  id: string;
  cid: string;
  sender_id: string;
  sender_vorname: string;
  sender_nachname: string;
  sender_image: string;
  post_category: string;
  post_option: string;
  post_vorname: string;
  post_nachname: string;
  post_image: string;
  content: string;
  created_at: string;
  read: number;
  custom_type?: 'initial' | 'message' | 'system' | string; 

}

