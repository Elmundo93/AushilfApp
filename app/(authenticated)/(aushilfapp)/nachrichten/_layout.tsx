import { Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';

import NachrichtenMenu from '@/components/Nachrichten/NachrichtenMenu';

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
         
        }} />
      <Stack.Screen
        name="channel/[cid]"
        
        options={{
          presentation: 'formSheet',
          headerShown: false,
         

          
        }}
      />

    </Stack>
  );
}
