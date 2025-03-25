import { Stack } from "expo-router";





export default function PublicLayout() {



  return <Stack screenOptions={{ headerShown: false }}  >
    <Stack.Screen name="index" options={{ headerShown: false }}  />

    <Stack.Screen name="registration" options={{ headerShown: false}} />
    <Stack.Screen name="aufklaerung" options={{ headerShown: false}} />
    <Stack.Screen name="manuellRegistration" options={{ headerShown: false}} />
    <Stack.Screen name="login" options={{ headerShown: false}} />



    </Stack>
}
