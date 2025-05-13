// services/StreamChat/handleChatPress.ts
import { User } from '@/components/types/auth';
import { Post } from '@/components/types/post';
import { useAuthStore } from '@/components/stores/AuthStore';
import { Channel } from 'stream-chat';

export const handleChatPress = async (
  currentUser: User,
  postDetails: Post
): Promise<Channel | null> => {

// Metadaten
const getPostMetadata = (user: User, post: Post) => ({
  custom_post_option: post.option,
  custom_post_category: post.category,
  custom_post_id: post.id,
  custom_post_user_id: post.userId,
  custom_post_vorname: post.vorname,
  custom_post_nachname: post.nachname,
  custom_post_profileImage: post.profileImageUrl,
  custom_post_userBio: post.userBio,
  custom_user_vorname: user.vorname,
  custom_user_nachname: user.nachname,
  custom_user_profileImage: user.profileImageUrl,
  custom_user_userBio: user.bio,
  custom_user_id: user.id,
});

// Initialnachricht
const formatInitialMessage = (post: Post) => {
  const prefix =
    post.option === 'bieten'
      ? 'bietet im Bereich '
      : post.option === 'suchen'
      ? 'sucht im Bereich '
      : '';
  const category =
    post.category?.charAt(0).toUpperCase() + post.category.slice(1);
  return `${post.vorname} ${post.nachname} ${prefix}${category}:\n\n\n${post.postText}`;
};

// Hashfunktion
function cyrb53(str: string, seed = 0): string {
  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 =
    Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
    Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 =
    Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
    Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString();
}


  const streamChatClient = useAuthStore.getState().streamChatClient;

  if (!streamChatClient) {
    throw new Error('Chat-Client konnte nicht initialisiert werden.');
  }

  if (!currentUser.id || !postDetails.userId) {
    throw new Error('Benutzer-IDs fehlen.');
  }

  try {
    // Eindeutige Channel-ID erzeugen
    const channelId = cyrb53(
      [currentUser.id, postDetails.userId].sort().join('-')
    );

    // Channel erstellen oder abrufen
    const channel = streamChatClient.channel('messaging', channelId, {
      members: [currentUser.id, postDetails.userId],
      created_by_id: currentUser.id,
      ...getPostMetadata(currentUser, postDetails),
    });

    if (!channel.initialized) {
      await channel.watch();
    }

    // Aktuelle Nachrichten abfragen
    const { messages } = await channel.query({ messages: { limit: 50 } });

    console.log('messages', messages);

    // Initialnachricht formatieren
    const initialText = formatInitialMessage(postDetails);

    // Prüfen, ob sie bereits existiert
    const initialMessageExists = messages.some(
      (msg) => msg.text === initialText
    );

    // Nur senden, wenn noch nicht vorhanden
    if (!initialMessageExists) {
      await channel.sendMessage({
        text: initialText,
        user_id: currentUser.id,
      });
    }

    return channel;
  } catch (error: any) {
    console.error('Fehler beim Starten des Chats:', error.message);
    throw new Error('Chat konnte nicht gestartet werden.');
  }
};
