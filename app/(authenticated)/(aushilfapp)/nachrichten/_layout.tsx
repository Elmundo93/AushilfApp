import { Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
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
          headerShown: true,
          headerTitle: 'Nachrichten',
          headerLeft: () => (
            
              <Link href="/(aushilfapp)/nachrichten" asChild>
            <TouchableOpacity >
                <Ionicons name="arrow-back" size={24} color="black" />
              </TouchableOpacity>
            </Link>
          ),
          
        }}
      />

    </Stack>
  );
}
