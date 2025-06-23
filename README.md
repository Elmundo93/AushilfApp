# 🤝 AushilfApp – Nachbarschaftshilfe neu gedacht

![Expo](https://img.shields.io/badge/built%20with-Expo-blue.svg)
![React Native](https://img.shields.io/badge/React%20Native-mobile%20UI-brightgreen)
![Supabase](https://img.shields.io/badge/Supabase-Backend%20as%20a%20Service-3ECF8E)
![Status](https://img.shields.io/badge/Status-in%20development-orange)
![License](https://img.shields.io/github/license/Elmundo93/aushilfapp)

> **Wir helfen Ihnen, eine helfende Hand zu finden – oder eine zu werden.**  
> _Eine App zur Vermittlung von lokaler Hilfe, entwickelt von [Wir helfen aus e.V.](https://www.wir-helfen-aus.de)_

---

## 📲 Die Idee

Die **AushilfApp** ist eine mobile App zur Vermittlung von Nachbarschaftshilfe – besonders für ältere Menschen, Studierende und Helfende mit wenig digitaler Erfahrung.  
Im Mittelpunkt stehen **Zugänglichkeit**, **Nützlichkeit im Alltag** und **einfache Vermittlung**.

---

### 🧭 Hauptfunktionen für Nutzer:innen

| 🔹 Funktion                     | 📝 Beschreibung |
|-------------------------------|----------------|
| 📌 **Pinnwand**                | Posts in deiner Umgebung – ortsbasiert & nach Kategorien filterbar |
| 🗂 **Kategorien**              | Garten, Haushalt, Bildung, Gastro, Soziales, Handwerk |
| 🧭 **Location-Filter**         | Zeigt nur relevante Posts in deiner Nähe – Radius einstellbar |
| 💬 **Optimierter Chat**        | Barrierearme 1:1-Kommunikation mit Swipe-Optionen & Read-Ticks |
| 🔎 **Filterbare ChannelList**  | Chats lassen sich nach Kategorie, Status oder Kontext filtern |
| 🧑‍💼 **Userdaten-Verwaltung**  | Eigene Profildaten verwalten, Danksagungen empfangen & anzeigen |
| 🪪 **Minijob-Tunnel Integration** | Onboarding mit Stripe-Verifizierung zur Einbindung in Minijobzentralen |
| 📶 **Offline-Modus**           | Lokale SQLite-Datenbank für stabile Nutzung ohne Internet |

---

## ⚙️ Tech Stack & Nutzen

| Layer        | Technologie                          | Nutzen für App |
|-------------|---------------------------------------|----------------|
| 📱 **Frontend** | React Native + Expo                 | Plattformübergreifende App, schnelle UI-Entwicklung |
| 🔐 **Auth**     | Supabase OAuth + Stripe             | DSGVO-konforme Anmeldung mit Verifizierungsoption |
| 🧠 **State**    | Zustand Store + SQLite              | Lokale Datenhaltung für Offline-First Erlebnis |
| 💬 **Chat**     | getStream.io (v1) → eigene Lösung (v2) | Filterbarer, performanter Chat mit voller Kontrolle |
| 🛰 **Sync**     | Supabase Edge Functions             | Effiziente Synchronisation & Server-Funktionen |
| 📂 **DB**       | Supabase PostgreSQL + SQLite        | Kombiniert Cloud mit lokalem Cache |
| 🔎 **Toxicity** | ONNX + optional Flask API           | Lokaler Schutz vor toxischer Sprache – datenschutzfreundlich |
| 💼 **Verwaltung**| Stripe Identity Light (0,99 €)     | Nahtlose Integration in Minijobzentralen & Behördenprozesse |

---

## 🧪 Lokales Setup

```bash
git clone https://github.com/Elmundo93/aushilfapp.git
cd aushilfapp
yarn install
cp .env.example .env      # Supabase & Stripe Keys eintragen
npx expo start
```

---

## 🚧 Deployment

```bash
eas build --platform android|ios --profile preview
```

Die Konfiguration erfolgt über `eas.json`, `app.config.js` und `.env`.

---

## 👥 Kontakt & Mitwirken

- Verein: **Wir helfen aus e.V.**
- Vorstand: **Lemont-Kim Mrutschock**
- E-Mail: [Lemont-Kim@wir-helfen-aus.de](mailto:Lemont-Kim@wir-helfen-aus.de)
- Webseite: [www.wir-helfen-aus.de](https://www.wir-helfen-aus.de)

---

## 📜 Lizenz

MIT License – frei nutzbar, weiterentwickelbar und gemeinwohlorientiert.

