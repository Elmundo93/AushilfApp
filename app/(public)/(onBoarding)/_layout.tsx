import { Stack } from "expo-router";
import { StyleSheet } from "react-native";
import useKeyboard from "@/components/Keyboard/useKeyboard";




export default function OnBoardingLayout() {



  return <Stack screenOptions={{ headerShown: false }}  >
    <Stack.Screen name="locationPermission" options={{ headerShown: false }}  />
    <Stack.Screen name="permissionDeniedScreen" options={{ headerShown: false, presentation: "modal"}}  />
    </Stack>
}
