export async function loadMessagesFromSQLite(chatId: string) {
    return new Promise<void>((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          `SELECT * FROM messages_fetched WHERE chat_id = ? ORDER BY created_at ASC`,
          [chatId],
          (_, { rows }) => {
            const messages = rows._array;
            useChatStore.getState().setMessages(chatId, messages);
            resolve();
          },
          (_, error) => {
            console.error('Fehler beim Laden der Nachrichten:', error);
            reject(error);
            return true;
          }
        );
      });
    });
  }