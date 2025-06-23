# 🔐 Authentifizierungs-Flow (Supabase, OAuth, SecureStore)

## Technologien
- Supabase Auth
- Apple / Google OAuth
- SecureStore für Tokens

## Login-Ablauf
1. Nutzer wählt Login-Methode (Email, Google, Apple)
2. Session wird erzeugt, Tokens gespeichert
3. Token-Refresh im Hintergrund
4. Redirect zu Onboarding oder MainApp

## Tokens
- Supabase Access Token
- Supabase Refresh Token
- Optional: getStream Token (Legacy)

## Placeholder
// Hier kann Cursor die `authService.ts` Logik analysieren und Abläufe beschreiben