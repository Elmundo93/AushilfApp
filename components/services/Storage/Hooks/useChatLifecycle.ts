// useChatLifecycle.ts
import { useEffect } from 'react';
import { useAuthStore } from '@/components/stores/AuthStore';

export const useChatLifecycle = (userId: string | undefined, db: any) => {
  const { clearChatState } = useAuthStore();

  useEffect(() => {
    if (!userId) return;

    clearChatState();

    const clearChatTables = async () => {
      try {
        await db.execAsync('DELETE FROM messages_fetched;');
        await db.execAsync('DELETE FROM channels_fetched;');
      } catch (e) {
        console.error('❌ Fehler beim Zurücksetzen der Chat-Datenbank:', e);
      }
    };

    clearChatTables();
  }, [userId]);
};
