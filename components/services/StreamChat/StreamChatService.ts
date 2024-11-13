import { User } from '@/components/types/auth';
import { Post } from '@/components/types/post';
import { useAuthStore } from '@/components/stores/AuthStore';

export const handleChatPress = async (
  currentUser: User,
  postDetails: Post
): Promise<string | null> => {
  const streamChatClient = useAuthStore.getState().streamChatClient;

  if (!streamChatClient) {
    throw new Error(
      'Chat-Client konnte nicht initialisiert werden. Bitte versuchen Sie es später erneut.'
    );
  }

  if (!currentUser.id || !postDetails.userId) {
    throw new Error('Benutzer-ID oder Post-Benutzer-ID ist nicht definiert.');
  }

  try {
    console.log('Aktueller User ID:', currentUser.id);
    console.log('Post User ID:', postDetails.userId);

    // Implementierung der Hash-Funktion
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

    // Sortieren der User-IDs für Konsistenz
    const userIds = [currentUser.id, postDetails.userId].sort();
    const concatenatedIds = userIds.join('-');

    // Generieren des Hashes der kombinierten IDs
    const channelId = cyrb53(concatenatedIds);

    // Einbinden benutzerdefinierter Felder bei der Kanal-Erstellung
    const channel = streamChatClient.channel('messaging', channelId, {
      members: [currentUser.id, postDetails.userId],
      created_by_id: currentUser.id,
      custom_post_option: postDetails.option,
      custom_post_category: postDetails.category,
      custom_post_id: postDetails.id,
      custom_post_user_id: postDetails.userId,
      custom_post_vorname: postDetails.vorname,
      custom_post_nachname: postDetails.nachname,
      custom_post_profileImage: postDetails.profileImageUrl,
      custom_post_userBio: postDetails.userBio,
      custom_user_vorname: currentUser.vorname,
      custom_user_nachname: currentUser.nachname,
      custom_user_profileImage: currentUser.profileImageUrl,
      custom_user_userBio: currentUser.bio,

    });

    console.log('PostDetails:', postDetails);

    // Sicherstellen, dass der Kanal existiert
    console.log('Kanal wird überwacht...');
    await channel.watch();

    if (!channel.cid) {
      throw new Error(
        'Kanal konnte nicht erfolgreich erstellt oder abgerufen werden.'
      );
    }

    console.log('Channel ID:', channel.cid);

    // Nachrichten im Kanal abrufen
    const existingMessages = channel.state.messages;

    // Prüfen, ob der postText bereits in den Nachrichten vorhanden ist
    const postTextExists = existingMessages.some(
      (message) =>
        message.text === postDetails.postText 
    );

    if (!postTextExists) {
      // Nachrichtentext dynamisch zusammenbauen
      let prefix = '';
      if (postDetails.option === 'bieten') {
        prefix = 'bietet im Bereich ';
      } else if (postDetails.option === 'suchen') {
        prefix = 'sucht im Bereich ';
      }

      const category = (postDetails.category && postDetails.category.charAt(0).toUpperCase() + postDetails.category.slice(1)) || '';
      const messageText = `${postDetails.vorname} ${postDetails.nachname} ${prefix}${category}:\n\n\n${postDetails.postText}`;

      // Initiale Nachricht senden
      await channel.sendMessage({
        text: messageText,
        user_id: currentUser.id, // ID des aktuellen Benutzers
        custom_fields: {
          is_post: true, // Kennzeichnet die Nachricht als Post
          option: postDetails.option,
          category: postDetails.category,
          post_id: postDetails.id, // Eindeutige Post-ID
        },
        // Anhänge hinzufügen, wenn vorhanden
    
      });
    }

    return channel.cid;
  } catch (error: unknown) {
    console.error(
      'Fehler beim Starten des Chats:',
      error instanceof Error ? error.message : String(error)
    );
    throw new Error(
      'Fehler beim Starten des Chats. Bitte versuchen Sie es später erneut.'
    );
  }
};