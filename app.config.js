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
      },
      associatedDomains: ['applinks:your.domain.com'],
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
  },
};