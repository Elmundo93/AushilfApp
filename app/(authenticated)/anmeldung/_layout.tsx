import { Stack } from 'expo-router';

export default function AnmeldungLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          title: 'Anmeldung',
          headerStyle: {
            backgroundColor: 'white',
          },
          headerTintColor: 'black',
        }}
      />
    </Stack>
  );
}
