# 🧭 Projektübersicht – AushilfApp

## Ziel der App
Eine mobile App zur Vermittlung von Nachbarschaftshilfe (Hilfe anbieten & Hilfe suchen) mit Chat, Onboarding, Verifizierung und Offlinefähigkeit.

## Tech Stack
- **Frontend:** React Native mit Expo
- **State:** Zustand
- **Routing:** Expo Router
- **Storage (lokal):** SQLite via expo-sqlite
- **Backend:** Supabase (Auth, DB, Storage, Edge Functions)
- **Verifizierung:** Stripe
- **Chat:** Aktuell getStream, geplant: eigene Supabase-Architektur

## Module
- [ ] Auth & Session Mgmt
- [ ] Onboarding
- [ ] Pinnwand & Posts
- [ ] Chat / Messaging
- [ ] SQLite Sync Layer
- [ ] Stripe Verifizierung
- [ ] Toxicity Filter (lokal/Flask-API)
- [ ] Barrierefreies UI

> [KI] Ergänze die Übersicht um ein Diagramm der Architektur + Zustandsflüsse.
