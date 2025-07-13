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

Sie ist bereits testbar und vereint DSGVO-konforme Technologie mit echter sozialer Wirkung.

---

## 🧭 Hauptfunktionen für Nutzer:innen

| 🔹 Funktion                     | 📝 Beschreibung |
|-------------------------------|----------------|
| 📌 **Pinnwand**                | Posts in deiner Umgebung – ortsbasiert & nach Kategorien filterbar |
| 🗂 **Kategorien**              | Garten, Haushalt, Bildung, Gastro, Soziales, Handwerk |
| 🧭 **Location-Filter**         | Zeigt nur relevante Posts in deiner Nähe – Radius einstellbar |
| 💬 **Optimierter Chat**        | Barrierearme 1:1-Kommunikation  |
| 🔎 **Filterbare ChannelList**  | Chats lassen sich nach Kategorie, Status oder Kontext filtern |
| 🧑‍💼 **Userdaten-Verwaltung**  | Eigene Profildaten verwalten, Danksagungen empfangen & anzeigen |
| 🪪 **Minijob-Tunnel Integration** | Onboarding mit Stripe-Verifizierung zur Einbindung in Minijobzentralen |
| 📶 **Offline-Modus**           | Lokale SQLite-Datenbank für stabile Nutzung ohne Internet |
| 👀 **Barrierefreiheit**        | Schriftgrößenmodus, visuelle Avatar-Hilfe, einfache Sprache |

---

## 🎥 Walkthrough: So funktioniert die AushilfApp

### 📝 Barrierearmes Onboarding für ein schnelles Setup!

<div align="center">

<img src="./assets/Screenshots/OnboardingWohnort.png" width="200" alt="Onboarding Wohnort Eingabe"> <img src="./assets/Screenshots/OnboardingCategories.png" width="200" alt="Onboarding Kategorien Auswahl"> <img src="./assets/Screenshots/OnboardingIdentity.png" width="200" alt="Onboarding Identitätsverifizierung">

<img src="./assets/Screenshots/Subscription.png" width="200" alt="Stripe Subscription Auswahl"> <img src="./assets/Screenshots/StripeSubscription.png" width="200" alt="Stripe Subscription Screen"> <img src="./assets/Screenshots/LoadingScreen.png" width="200" alt="Onboarding Loading Screen">

</div>

---

### 🧭 Intuitive Pinnwand mit leicht zugänglichen Posterstellungsprozess ✌️
Wähle deine Interessensbereiche wie Garten, Soziales oder Gastro.

<div align="center">

<img src="./assets/Screenshots/HeroGreen.png" width="200" alt="Pinnwand Hero Screen"> <img src="./assets/Screenshots/CreatePost.png" width="200" alt="Post erstellen Dialog"> <img src="./assets/Screenshots/PinnwanndStandard.png" width="200" alt="Pinnwand Standard Ansicht">

<img src="./assets/Screenshots/FilterAccordionGreenFree.png" width="200" alt="Filter Accordion Freie Auswahl"> <img src="./assets/Screenshots/FilterAccordionGreenChoosen.png" width="200" alt="Filter Accordion Ausgewählte Kategorien">

</div>

---

### 🐝 Trete in Kontakt mit Menschen denen du helfen Kannst!

<div align="center">

<img src="./assets/Screenshots/PostDetails.png" width="200" alt="Post Details Ansicht"> <img src="./assets/Screenshots/Bildschirmfoto 2025-07-13 um 22.25.55.png" width="200" alt="Erste Nachricht senden"> <img src="./assets/Screenshots/ChannelListGreen.png" width="200" alt="Channel Liste Übersicht">

</div>

---

### 📌 Organisiere deine Aushilfen schnell und einfach mit der Kategorieauswahl in den Nachrichten!

<div align="center">

<img src="./assets/Screenshots/ChannelListGreenGarten.png" width="200" alt="Channel Liste Garten Filter"> <img src="./assets/Screenshots/ChannelListGreenGastro.png" width="200" alt="Channel Liste Gastro Filter"> <img src="./assets/Screenshots/KategorienChoose.png" width="200" alt="Kategorien Auswahl Dialog">

</div>

---

### 📔 Melde deine Aushilfmöglichkeit schnell und einfach mit den relevanten Daten bei der Minijobzentrale an

<div align="center">

<img src="./assets/Screenshots/AnmeldungGreen.png" width="200" alt="Minijob Anmeldung Screen">

</div>

---

### 👥 Jeder User hat ein Profil in dem andere User Danksagungen hinterlassen können! Neben den Danksagungen sind dort auch ihre Interessen zu finden!

<div align="center">

<img src="./assets/Screenshots/ForreignProfile.png" width="200" alt="Fremdes Benutzerprofil"> <img src="./assets/Screenshots/OwnProfileGreen.png" width="200" alt="Eigenes Benutzerprofil"> <img src="./assets/Screenshots/ProfileImageWahl.png" width="200">

</div>

---

### ⚙️ Um die Zugänglichkeit der AushilfApp zu erhöhen, haben wir auch einen Lesemodus integriert für Menschen mit schwachen Augen!

<div align="center">

<img src="./assets/Screenshots/EinstellungLeseHilfeOff.png" width="200" alt="Einstellungen Lesemodus aus"> <img src="./assets/Screenshots/EinstellungenLeseHilfeToggled.png" width="200" alt="Einstellungen Lesemodus aktiviert"><img src="./assets/Screenshots/Bildschirmfoto 2025-07-13 um 22.26.20.png" width="200" alt="Einstellungen Lesemodus aktiviert">

</div>

---

## 🚀 Technische Highlights

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

## 🧑‍🤝‍🧑 Gemeinnützigkeit & Wirkung

Die AushilfApp ist ein gemeinnütziges Projekt des Vereins **Wir helfen aus e. V.**.  
Wir glauben an eine Gesellschaft, in der Hilfe auf Gegenseitigkeit basiert – unabhängig von Herkunft, Sprache oder digitaler Kompetenz.

### Was uns auszeichnet:

- 💡 **Zugang für alle**: auch ohne App über WhatsApp Companion möglich
- 🔒 **Privatsphäre & Kontrolle**: keine Weitergabe von Nutzerdaten
- 📚 **Begleitmaterialien**: leicht verständlich, mehrsprachig & barrierefrei
- 🫶 **Community getrieben**: Nutzer:innen können helfen, aber auch Hilfe suchen
- 💬 **KI-Unterstützung** intuitive Hilfe durch maßgeschneiderte Angebote mit den Aushelfern der AushilfApp 

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

---

## 💛 Danke

Danke an alle, die mithelfen. Gemeinsam bauen wir eine digitale Struktur, die echten sozialen Mehrwert bringt – **barrierefrei, inklusiv und lokal verankert**. 🐝