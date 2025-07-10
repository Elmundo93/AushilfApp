// useChatLifecycle.ts
import { useEffect } from 'react';
import { useAuthStore } from '@/components/stores/AuthStore';

export const useChatLifecycle = (userId: string | undefined, db: any) => {
  const { clearChatState } = useAuthStore();

  useEffect(() => {
    if (!userId) return;

    clearChatState();

    // Don't clear channels on every user change - only clear messages
    const clearChatTables = async () => {
      try {
        await db.execAsync('DELETE FROM messages_fetched;');
        // Don't delete channels - they should persist across sessions
        // await db.execAsync('DELETE FROM channels_fetched;');
      } catch (e) {
        console.error('❌ Fehler beim Zurücksetzen der Chat-Datenbank:', e);
      }
    };

    clearChatTables();
  }, [userId]);
};
