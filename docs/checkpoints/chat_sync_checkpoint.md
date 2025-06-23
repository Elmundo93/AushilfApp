
✅ Checkpoint: Chat-Sync & Message-Persistenz AushilfApp – Status & Debug-Basis

---

🔧 Zustand & Architektur

📦 Lokale SQLite Tabellen
- channels_fetched: speichert alle Channel-Metadaten
- messages_fetched: speichert Nachrichten als StoredMessage
- beide Tabellen werden via channelService & messageService geschrieben

🌐 Netzwerk- & Sync-Pfade
- Sync bei App-Start via useChannelSync
- Einzel-Channel-Sync via useMessageSync
- Subscriptions über useChatListeners
- Datenhaltung im Zustand via useStreamChatStore und useActiveChatStore

💬 StreamChat-Verbindung
- streamChatClient wird via useAuthStore zur Verfügung gestellt
- Channel-Sync verwendet .queryChannels
- Message-Sync verwendet .channel().query({ messages })

---

⚠️ Aktuelle Probleme

❗ Transaktionsfehler SQLite
Fehlermeldungen:
- cannot rollback - no transaction is active
- cannot start a transaction within a transaction

Mögliche Ursachen:
- saveMessagesToDb ruft innerhalb eines Abonnements (on("message.new")) db.runAsync() mehrfach auf → Konflikt bei gleichzeitigen Inserts
- kein transaction-Wrapping oder fehlerhafte Implementierung des Transaktionsbeginns/-endes
- mehrfach parallel gestartete INSERT-Operationen ohne Await-Kette

Lösungsansatz:
- Transaktionslogik zentralisieren und garantieren, dass keine Transaktion doppelt geöffnet wird (z. B. mit db.transaction(async tx => { ... }) oder mutex-basiertem Lock)

❗ Channel bleibt undefined, partnerData ist null

Logs:
- LOG Channel structure: undefined
- LOG partnerData null

Mögliche Ursachen:
- Channel wird aus SQLite geladen, aber currentUserId, custom_user_id, custom_post_user_id sind nicht sauber im Channel gespeichert
- Partnerdaten-Zugriff basiert auf Metadaten (custom_fields), die evtl. beim Channel-Bau fehlen
- Channel wird vorzeitig gerendert (z. B. undefined Zustand → channel.state.messages nicht verfügbar)

Lösungsansatz:
- Channel-Metadaten beim Erstellen zentral setzen (custom_fields)
- Channel-Load mit Guard (if (!channel || !channel.state) return)
- Robustheit beim Extrahieren von Partnerdaten verbessern (Fallbacks, Logging)

❗ Subscriptions liefern mehrfach Nachrichten / doppelter Eintrag

Fehler:
- Nachrichten werden in saveMessagesToDb() gespeichert, auch wenn sie schon existieren

Lösungsansatz:
- saveMessagesToDb() sollte INSERT OR IGNORE verwenden oder vorher EXISTS prüfen
- Bei activeMessages prüfen: if (messages.some(m => m.id === newMessage.id)) return;

---

📋 Offene TODOs & Empfehlungen

| Aufgabe | Ziel |
|--------|------|
| 🔁 saveMessagesToDb mit transaction oder mutex sichern | verhindert Race-Conditions & Transaktionsfehler |
| 🔁 mapMessageToDbValues() defensiver gestalten | gegen undefined channel, leere created_at, fehlende id schützen |
| 🧠 getPartnerDataFromChannel() robuster & testbar machen | aktuell null, wenn Metadaten fehlen |
| 🧹 clearChatState() nur bei Logout / Userwechsel triggern | nicht bei jedem useEffect-Mount |
| 🔍 Logging verfeinern (console.log("🧩 Save to DB:", values)) | bessere Debug-Basis |
| 💾 messages_fetched mit UNIQUE(id) + OR REPLACE | verhindert Dopplung |
| 🧱 Channel- & Message-Schema dokumentieren | für zukünftige Migrationsstrategien |

---

🧠 Empfehlung: Struktur für Weiterentwicklung

components/
├─ Chat/
│  ├─ ChatView.tsx            → rendert Channel-Header, Nachrichten, Input
│  ├─ MessageBubble.tsx       → eigene Nachrichtendarstellung
│  ├─ MessageInput.tsx        → Input-Feld mit Local Handling
├─ Services/
│  ├─ channelService.ts       → SQLite-basierte Channel-Funktionen
│  ├─ messageService.ts       → SQLite-basierte Nachrichten-Funktionen
│  ├─ streamService.ts        → Wrapper für StreamClient Ops
│  └─ syncService.ts          → batchartige Sync-Logik bei App-Start
├─ Hooks/
│  ├─ useChannelSync.ts       → App-Start-Sync
│  ├─ useMessageSync.ts       → Channel-Sync bei Öffnung
│  ├─ useChatListeners.ts     → Live-Update via Stream Events
│  └─ useChatLifecycle.ts     → Lifecycle-Handling, Cleanup

---

🧭 Nächste Schritte (konkret)

1. [ ] saveMessagesToDb mit db.runInTransaction oder Lock absichern
2. [ ] getPartnerDataFromChannel überarbeiten: eigene Utility bauen + Defaults
3. [ ] Channel-Erstellung prüfen: werden custom_user_id & Co. korrekt gespeichert?
4. [ ] Komplette message.new-Subscription isoliert testen (nur Log + Save)
5. [ ] SQLite Tabellenstruktur mit UNIQUE Constraints + Error-Handling absichern
6. [ ] Fallback-Werte bei mapMessageToDbValues einbauen (z. B. für created_at)

---

💡 Mission: Solider, fehlertoleranter Chat-Service, 100% offlinefähig, robuster Sync, sinnvoller Zustand – für echte gesellschaftliche Wirkung.

---

## 🧩 Projektstruktur & Zuständigkeiten

```txt
/components
  └─ Chat/
      ├─ CustomChatHeader.tsx         # Chatkopfzeile mit Namen, Bild etc.
      ├─ CustomInputField.tsx         # Eingabefeld für neue Nachrichten
      ├─ CustomMessageBubble.tsx      # Darstellung einzelner Nachrichten
  └─ Crud/
      └─ SQLite/
          └─ Services/
              ├─ channelServices.ts   # Channel-Speicherung, Mapping & Laden
              └─ messagesService.ts   # Nachrichten-Speicherung & Abfrage
  └─ services/
      └─ Storage/
          └─ Syncs/
              ├─ useChannelSync.ts    # Synchronisiert Channels Stream → SQLite
              └─ useMessageSync.ts    # Synchronisiert Nachrichten pro Channel
  └─ stores/
      ├─ useStreamChatStore.ts        # Enthält Channels & Lade-Status
      └─ useActiveChatStore.ts        # Nachrichten & aktueller Chat
  └─ hooks/
      ├─ useChatListeners.ts          # Stream Subscriptions für Nachrichten
      └─ useChatLifecycle.ts          # Reset bei Loginwechsel

/contexts
  └─ ChatProvider.tsx                 # Versorgt App mit Chatkontext
```

---

## 🧠 KI-Kontext (für Cursor & Team)

> Diese Datei stellt den zentralen Entwicklungsstand des Chat-Moduls der AushilfApp dar.  
> Sie dient der Fehleranalyse, Synchronisationsstrategie und Erweiterungsplanung.  
> Die Hooks, Services und Stores basieren auf einer StreamChat + SQLite Synchronisation.  
> Cursor-gestützte KI darf dieses Dokument als Grundlage für Architekturanalysen, Bugfixes  
> und Erweiterungsideen verwenden.

---

## ✅ Open Tasks

- [ ] SQLite-Transaktionen strukturieren und race conditions vermeiden
- [ ] StreamChat-Events zentral debuggen (bes. message.new, channel.updated)
- [ ] ChatProvider vereinheitlichen und Abhängigkeiten prüfen
- [ ] Offlinefähigkeit im Flugzeugmodus testen
- [ ] Nachrichten-Typen und Abgrenzung zu system/command messages
- [ ] Lesebestätigung finalisieren (`read: boolean` + DB/State sync)
- [ ] Scrollverhalten & Auto-Focus bei neuen Nachrichten prüfen

---
