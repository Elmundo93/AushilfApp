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
  
  export type ChannelPreviewProps = {
    channel: ChannelType;
    onSelect: (channel: ChannelType) => void;
  };