# 🚀 Onboarding-Flow – AushilfApp

## Schritte
1. userInfo.tsx → Name, E-Mail
2. password.tsx → Passwort
3. intent.tsx → Hilfe anbieten/suchen
4. kategorien.tsx → Auswahlhilfe
5. bio.tsx → Freitext
6. summary.tsx → Vorschau & Abschluss

## Zustand
- `useOnboardingStore`
  - persistiert via Zustand-Middleware
  - Validierungslogik je Screen

## To-dos
- [ ] Validierung zentralisieren
- [ ] Schritt-Tracking robuster machen
- [ ] SQLite-Zwischenspeicherung

> [KI] Ergänze: Wie können wir bei App-Absturz oder Schließen den Onboarding-Zwischenstand recovern?
