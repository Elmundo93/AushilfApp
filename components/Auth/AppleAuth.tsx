import * as AppleAuthentication from 'expo-apple-authentication';

export async function handleAppleSignIn() {
  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    // Hier die Benutzerdaten verarbeiten (z.B. an Supabase senden)
    console.log(credential);

    return credential; // Du kannst die Anmeldeinformationen zurückgeben, wenn sie weiterverwendet werden sollen
  } catch (error: unknown) {
    if (error instanceof Error && 'code' in error && error.code === 'ERR_CANCELED') {
      // Der Benutzer hat den Anmeldevorgang abgebrochen
      console.log('Apple Anmeldung abgebrochen.');
    } else {
      // Ein Fehler ist aufgetreten
      console.error('Apple Login Fehler:', error);
    }
  }
}