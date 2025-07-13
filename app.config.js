import 'dotenv/config';

export default {
  expo: {
    name: 'AushilfApp',
    slug: 'aushilfapp',
    version: '1.0.0',
    orientation: 'portrait',
    scheme: 'aushilfapp',
    icon: './assets/images/bienenlogo.png',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/images/bienenlogo.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.elmundo93.aushilfapp',
      usesAppleSignIn: true,
      infoPlist: {
        CFBundleURLTypes: [
          {
            CFBundleURLSchemes: ['aushilfapp'],
          },
        ],
        NSLocationWhenInUseUsageDescription: 'Die App benötigt deinen Standort, um Hilfe in deiner Nähe zu zeigen.',
        NSLocationAlwaysAndWhenInUseUsageDescription: 'Die App benötigt deinen Standort, um Hilfe in deiner Nähe zu zeigen.',
        NSCameraUsageDescription: 'Die App benötigt Zugriff auf die Kamera für Profilbilder.',
        NSPhotoLibraryUsageDescription: 'Die App benötigt Zugriff auf die Fotobibliothek für Profilbilder.',
        NSMicrophoneUsageDescription: 'Die App benötigt Zugriff auf das Mikrofon für Sprachaufnahmen.',
      },
      associatedDomains: ['applinks:your.domain.com'],
      // App Store Metadata
      appStoreUrl: 'https://apps.apple.com/app/aushilfapp',
      privacyPolicyUrl: 'https://www.wir-helfen-aus.de/datenschutz',
      termsOfServiceUrl: 'https://www.wir-helfen-aus.de/agb',
    },
    android: {
      package: 'com.elmundo93.aushilfapp',
      adaptiveIcon: {
        foregroundImage: './assets/images/bienenlogo.png',
        backgroundColor: '#ffffff',
      },
      intentFilters: [
        {
          action: 'VIEW',
          data: [
            {
              scheme: 'aushilfapp',
              host: '*',
            },
          ],
          category: ['BROWSABLE', 'DEFAULT'],
        },
      ],
      permissions: [
        'android.permission.ACCESS_FINE_LOCATION',
        'android.permission.ACCESS_COARSE_LOCATION',
        'android.permission.CAMERA',
        'android.permission.READ_EXTERNAL_STORAGE',
        'android.permission.WRITE_EXTERNAL_STORAGE',
        'android.permission.RECORD_AUDIO',
        'android.permission.INTERNET',
        'android.permission.ACCESS_NETWORK_STATE',
        'android.permission.WAKE_LOCK',
        'android.permission.VIBRATE',
      ],
      // Play Store Metadata
      playStoreUrl: 'https://play.google.com/store/apps/details?id=com.elmundo93.aushilfapp',
      privacyPolicyUrl: 'https://www.wir-helfen-aus.de/datenschutz',
      termsOfServiceUrl: 'https://www.wir-helfen-aus.de/agb',
    },
    plugins: [
      'expo-router',
      'expo-font',
      'expo-secure-store',
      'expo-dev-client',
      [
        'expo-location',
        {
          locationAlwaysAndWhenInUsePermission:
            'Die App benötigt deinen Standort, um Hilfe in deiner Nähe zu zeigen.',
          isAndroidForegroundServiceEnabled: true,
        },
      ],
      [
        'expo-notifications',
        {
          icon: './assets/images/bienenlogo.png',
          color: '#FFA500',
          sounds: ['./assets/sounds/notification.wav'],
        },
      ],
    ],
    extra: {
      router: {
        origin: false,
      },
      eas: {
        projectId: '4c23d573-79b8-43e8-9992-d4c304f8638d',
      },
      supabaseRedirect: 'aushilfapp://auth/callback',
      supabaseFunctionsUrl: process.env.SUPABASE_FUNCTIONS_URL,
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY ?? '',
    },
    experiments: {
      typedRoutes: true,
    },
    // App Store Metadata
    description: 'AushilfApp - Nachbarschaftshilfe neu gedacht. Finde oder biete Hilfe in deiner Nähe an.',
    keywords: ['nachbarschaftshilfe', 'hilfe', 'gemeinschaft', 'sozial', 'unterstützung'],
    primaryColor: '#FFA500',
    privacy: 'public',
    platforms: ['ios', 'android'],
    owner: 'wir-helfen-aus-e-v',
    repository: 'https://github.com/Elmundo93/aushilfapp',
    bugs: 'https://github.com/Elmundo93/aushilfapp/issues',
    homepage: 'https://www.wir-helfen-aus.de',
  },
};