import React from 'react';
import { Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'react-native';
import { Link } from 'expo-router';
import  ProfileAvatar  from '@/components/Profile/ProfileImage/ProfileAvatar';
import { StyleSheet } from 'react-native';
import { FontSizeContext } from '@/components/provider/FontSizeContext';
import { useContext } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SettingsHeader from '@/components/Header/settingsHeader';
import {LinearGradient} from 'expo-linear-gradient';
import { Text } from 'react-native';
import { useSelectedUserStore } from '@/components/stores/selectedUserStore';

export default function AuthenticatedLayout() {
  const { fontSize } = useContext(FontSizeContext);
  const maxFontSize = 32; // Passen Sie diesen Wert nach Bedarf an
  const defaultFontSize = 22; // Standard-Schriftgröße im Kontext
  const componentBaseFontSize = 22; // Ausgangsschriftgröße für das Label
  const minIconSize = 54;
  const maxIconSize = 68;
  const adjustedFontSize = (fontSize / defaultFontSize) * componentBaseFontSize;
  const finalFontSize = Math.min(adjustedFontSize, maxFontSize);
  const iconSize = Math.min(Math.max(fontSize * 1.5, minIconSize), maxIconSize);
  const headerHeight =  Math.max(iconSize  );
  const { selectedUser } = useSelectedUserStore();

  return (
    <Stack
      
    >
     <Stack.Screen 
  name="(aushilfapp)"
  options={{
    header: () => (
     
      <SafeAreaView style={{ backgroundColor: 'white' }}>
         <LinearGradient
      colors={['orange', '#e5b130', 'white']} 
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      }}
      />
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          paddingHorizontal: 20,
          height: headerHeight,


        }}>
          <ProfileAvatar
            style={{ width: iconSize, height: iconSize, borderRadius: iconSize / 2 }}
          />
          <Image
            source={require('@/assets/images/bienenlogo.png')}
            style={{ width: iconSize, height: iconSize, resizeMode: 'contain' }}
          />
          <SettingsHeader />
        </View>

      </SafeAreaView>
    
    ),
    headerShown: true,
  }}
/>
      <Stack.Screen
        name="(modal)/createPost"
        options={{ 
            headerTitle: 'Beitrag erstellen',
            presentation: 'modal',
            headerTitleStyle: { fontSize: finalFontSize } ,
            headerShown: true, 
            header: () => (
              <View style={{
                backgroundColor: 'orange',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 20,
                height: headerHeight
              }}>
                <View style={{ width: iconSize }} />
                <Text style={{
                  fontSize: finalFontSize,
                  fontWeight: 'bold',
                  color: 'white',
                  flex: 1,
                  textAlign: 'center'
                }}>
                  Beitrag erstellen
                </Text>
                <Link href=".." asChild>
                  <TouchableOpacity>
                    <Ionicons name="close" size={iconSize} color="black" />
                  </TouchableOpacity>
                </Link>
              </View>
            ) }}
      />
      <Stack.Screen
        name="(modal)/einstellungen"
        options={{ 
            headerTitle: 'Einstellungen',
              headerTitleStyle: { fontSize: finalFontSize } ,
            presentation: 'modal',
            headerShown: true, 
            header: () => (
              <View style={{
                backgroundColor: 'orange',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 20,
                height: headerHeight
              }}>
                <View style={{ width: iconSize }} />
                <Text style={{
                  fontSize: finalFontSize,
                  fontWeight: 'bold',
                  color: 'white',
                  flex: 1,
                  textAlign: 'center'
                }}>
                  Einstellungen
                </Text>
                <Link href=".." asChild>
                  <TouchableOpacity>
                    <Ionicons name="close" size={iconSize} color="black" />
                  </TouchableOpacity>
                </Link>
              </View>
            )}}
      />
      <Stack.Screen
        name="(modal)/ownProfile"
        options={{ 
            headerTitle: 'Mein Profil',
            presentation: 'modal',
            headerTitleStyle: { fontSize: finalFontSize } ,
            headerShown: true, 
            header: () => (
              <View style={{
                backgroundColor: 'orange',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 20,
                height: headerHeight
              }}>
                <View style={{ width: iconSize }} />
                <Text style={{
                  fontSize: finalFontSize,
                  fontWeight: 'bold',
                  color: 'white',
                  flex: 1,
                  textAlign: 'center'
                }}>
                  Mein Profil
                </Text>
                <Link href=".." asChild>
                  <TouchableOpacity>
                    <Ionicons name="close" size={iconSize} color="black" />
                  </TouchableOpacity>
                </Link>
              </View>
            )}}
      />
      <Stack.Screen
        name="(modal)/forreignProfile"
        options={{ 
            headerTitle: 'Profil',
            presentation: 'modal',
            headerShown: true, 
            headerTitleStyle: { fontSize: finalFontSize } ,
            header: () => (
              <View style={{
                backgroundColor: 'orange',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 20,
                height: headerHeight
              }}>
                <View style={{ width: iconSize }} />
                <Text style={{
                  fontSize: finalFontSize,
                  fontWeight: 'bold',
                  color: 'white',
                  flex: 1,
                  textAlign: 'center'
                }}>
                  {selectedUser?.vorname}'s Profil
                </Text>
                <Link href=".." asChild>
                  <TouchableOpacity>
                    <Ionicons name="close" size={iconSize} color="black" />
                  </TouchableOpacity>
                </Link>
              </View>
            ),
            }}
      />
          <Stack.Screen
        name="(modal)/postDetail/index"
        options={{ 
            headerTitle: 'Beitrag Details',
            presentation: 'modal',
            headerTitleStyle: { fontSize: finalFontSize  } ,
            headerShown: true, 
            header: () => (
              <View style={{
                backgroundColor: 'orange',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 20,

                height: headerHeight
              }}>
                <View style={{ width: iconSize }} />
                <Text style={{
                  fontSize: finalFontSize,
                  fontWeight: 'bold',
                  color: 'white',
                  flex: 1,
                  textAlign: 'center'
                }}>
                  Beitrag Details
                </Text>
                <Link href=".." asChild>
                  <TouchableOpacity>
                    <Ionicons name="close" size={iconSize} color="black" />
                  </TouchableOpacity>
                </Link>
              </View>
            ),
            }}
      />
   

      <Stack.Screen
        name="(modal)/postMelden"
        options={{ 
            headerTitle: 'Beitrag melden',
            presentation: 'modal',
            headerStyle: { backgroundColor: 'red' },
            headerTitleStyle: { fontSize: finalFontSize, color: 'white' } ,
            headerShown: true, 
            headerRight: () => (
              <Link href=".." asChild>
                <TouchableOpacity >
                  <Ionicons name="close" size={iconSize} color="black" />
                </TouchableOpacity>
              </Link>
            ),
            }}
      />
<Stack.Screen
        name="(modal)/webView"
        options={{ 
            headerTitle: 'Anmeldung',
            presentation: 'modal',
            headerStyle: { backgroundColor: '#ff862e' },
            headerTitleStyle: { fontSize: finalFontSize, color: 'white' } ,
            headerShown: true, 
            headerRight: () => (
              <Link href=".." asChild>
                <TouchableOpacity >
                  <Ionicons name="close" size={iconSize} color="black" />
                </TouchableOpacity>
              </Link>
            ),
            }}
      />
  
   
    </Stack>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 10,
  },
});
