import { sendMessage } from '@/services/ChatService';
import { Chat } from '@/stores/useChatStore';
import { User } from '@/components/types/auth';

export async function sendInitialMessage(chat: Chat, currentUser: User) {
  if (!chat || !chat.post_text || !chat.category || !chat.option) {
    console.warn('Unvollständige Chatdaten für Initialnachricht.');
    return;
  }

  let prefix = '';
  if (chat.option === 'bieten') {
    prefix = 'bietet im Bereich';
  } else if (chat.option === 'suchen') {
    prefix = 'sucht im Bereich';
  }

  const capitalizedCategory = chat.category.charAt(0).toUpperCase() + chat.category.slice(1);
  const messageText = `${chat.post_author_vorname ?? ''} ${chat.post_author_nachname ?? ''} ${prefix} ${capitalizedCategory}:\n\n${chat.post_text}`;

  await sendMessage(chat.id, messageText, currentUser.id);
}