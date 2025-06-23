# 💬 Chat-Modul Architektur – AushilfApp

## Struktur
- Chat-Komponenten: `ChatScreen`, `MessageBubble`, `ChatInput`, `ChatHeader`
- Zustand:
  - `useStreamChatStore` – Channel-Liste
  - `useActiveChatStore` – Aktueller Chat + Nachrichten
- Lokale Speicherung:
  - Tabelle `channels_fetched`
  - Tabelle `messages_fetched`

## Datenfluss
```
User -> ChatScreen -> SQLite Load -> Zustand -> UI
User Action -> StreamChat -> SQLite Sync -> Zustand Update
```

## Synchronisation
- Listener (`useChatListeners`)
- Initial-Sync (`useChannelSync`, `useMessageSync`)
- Lifecycle Reset (`useChatLifecycle`)
- Provider: `ChatProvider`

> [KI] Zeichne ein Sequenzdiagramm für "Neue Nachricht empfangen" inkl. SQLite Speicherung.
