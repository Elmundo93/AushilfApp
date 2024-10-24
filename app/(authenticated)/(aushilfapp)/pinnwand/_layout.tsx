import { Stack } from 'expo-router';

export default function PinnwandLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          title: 'Pinnwand',
          headerStyle: {
            backgroundColor: 'white',
          },
          headerTintColor: 'black',
        }}
      />
    </Stack>
  );
}
