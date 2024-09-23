import { Stack } from 'expo-router';

export default function NachrichtenLayout() {
  return (
    <Stack initialRouteName='index'>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          title: 'Nachrichten',
          headerStyle: {
            backgroundColor: 'white',
          },
          headerTintColor: 'black',
        }}
      />
      <Stack.Screen
        name="channel/[cid]"
        options={{
          title: 'Kanal',
          headerShown: true,
          headerBackButtonMenuEnabled: true,
          headerBackVisible: true,
          headerBackTitle: 'Nachrichten',

        }}
      />

    </Stack>
  );
}
