🧭 Projektübersicht – AushilfApp
Ziel:
Mobile App für Nachbarschaftshilfe (Hilfe anbieten/suchen) mit Chat, Onboarding, Verifizierung, Offlinefähigkeit.
Tech Stack:
React Native (Expo)
Zustand (State)
Expo Router (Routing)
SQLite (expo-sqlite, lokal)
Supabase (Backend: Auth, DB, Storage, Edge Functions)
Stripe (Verifizierung)
Chat: aktuell getStream, geplant Supabase-Architektur
Module:
Auth & Session Mgmt
Onboarding
Pinnwand & Posts
Chat / Messaging
SQLite Sync Layer
Stripe Verifizierung
Toxicity Filter (lokal/Flask-API)
Barrierefreies UI
💬 Chat-Modul Architektur
Komponenten:
ChatScreen, MessageBubble, ChatInput, ChatHeader
State:
useStreamChatStore (Channel-Liste)
useActiveChatStore (Aktueller Chat + Nachrichten)
Lokale Speicherung:
channels_fetched (Channels)
messages_fetched (Nachrichten)
Datenfluss:
User → ChatScreen → SQLite Load → Zustand → UI
User Action → StreamChat → SQLite Sync → Zustand Update
Synchronisation:
Listener: useChatListeners
Initial-Sync: useChannelSync, useMessageSync
Lifecycle Reset: useChatLifecycle
Provider: ChatProvider
Wichtige TODOs:
- [x] SQLite-Transaktionen strukturieren (race conditions vermeiden)
- [x] StreamChat-Events debuggen (message.new, channel.updated)
- [x] ChatProvider vereinheitlichen
- [x] Offlinefähigkeit testen (Basis-Checks, Logging, Sync-Logik)
- [x] Lesebestätigung finalisieren (read: boolean, UI)
- [x] Scrollverhalten & Auto-Focus prüfen (UI-Logik prüfen)
🔄 DataProvider Layer
Ziel:
Zentrale Koordination von SQLite + Supabase Daten + Zustand
Hooks:
useChannelSync
useMessageSync
useChatListeners
Speicherorte:
SQLite (offline)
Zustand (useStreamChatStore, useActiveChatStore)
🗃️ SQLite-Datenstruktur
Tabellen:
posts_fetched
channels_fetched
messages_fetched
danksagungen_fetched
users_fetched
Migration:
- [x] Versionierung via user_version
- [x] Migration-Script vorhanden und geprüft (DBSetup/DBSetup.ts)
🔐 Authentifizierungs-Flow
Technologien:
Supabase Auth
Apple / Google OAuth
SecureStore für Tokens
Ablauf:
Login-Methode wählen (Email, Google, Apple)
Session erzeugen, Tokens speichern
Token-Refresh im Hintergrund
Redirect zu Onboarding oder MainApp
Tokens:
Supabase Access/Refresh Token
Optional: getStream Token (Legacy)
🚀 Onboarding-Flow
Schritte:
userInfo.tsx → Name, E-Mail
password.tsx → Passwort
intent.tsx → Hilfe anbieten/suchen
kategorien.tsx → Auswahlhilfe
bio.tsx → Freitext
summary.tsx → Vorschau & Abschluss
State:
useOnboardingStore (persistiert via Zustand-Middleware)
Validierungslogik je Screen
To-dos:
Validierung zentralisieren
Schritt-Tracking robuster machen
SQLite-Zwischenspeicherung
Recovery:
Onboarding-Zwischenstand via SQLite sichern, um bei App-Absturz/Schließen recovern zu können.
☁️ Supabase Edge Functions
Aktive Functions:
getStreamToken
userBlock
userUnblock
chatDelete
Sicherheit:
Auth Token required
RLS-konforme Checks
🧠 Chat-Sync & Message-Persistenz (Checkpoint)
Lokale Tabellen:
channels_fetched (Channel-Metadaten)
messages_fetched (Nachrichten als StoredMessage)
Sync-Strategie:
App-Start: useChannelSync
Einzel-Channel: useMessageSync
Subscriptions: useChatListeners
Zustand: useStreamChatStore, useActiveChatStore
Fehlerquellen & Lösungen:
Transaktionsfehler: Transaktionslogik zentralisieren, mutex/Lock nutzen
Channel undefined/partnerData null: Metadaten prüfen, Guards & Fallbacks einbauen
Doppelte Nachrichten: INSERT OR IGNORE oder EXISTS-Prüfung
Empfohlene Struktur:
Komponenten: ChatView, MessageBubble, MessageInput
Services: channelService, messageService, streamService, syncService
Hooks: useChannelSync, useMessageSync, useChatListeners, useChatLifecycle
Stores: useStreamChatStore, useActiveChatStore
Offene Aufgaben:
Transaktionen & race conditions vermeiden
Events debuggen
ChatProvider prüfen
Offlinefähigkeit testen
Lesebestätigung & Scrollverhalten verbessern
💡 Hinweise für Entwicklung & KI
- [x] SQLite-Tabellenstruktur und Migrationsstrategie dokumentiert
- [x] Defensive Programmierung bei Datenmapping (z. B. Fallbacks für fehlende Felder)
- [x] Logging für Debugging ausgebaut
- [x] Alle Services, Hooks und Stores modular und einzeln testbar
- [x] Architektur und Zustandsflüsse in den AI-Dokumenten als Referenz für Erweiterungen und Bugfixes dokumentiert