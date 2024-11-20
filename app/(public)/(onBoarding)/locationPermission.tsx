
import { View, Text, Alert } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native'
import { Image} from 'react-native';
import {  router } from 'expo-router';
import { createRStyle} from 'react-native-full-responsive';

import { TouchableOpacity } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocationRequest } from '@/components/Location/locationRequest';
import { useAuthStore } from '@/components/stores/AuthStore';

const Page = () => {

    const locationPermission = useAuthStore((state) => state.locationPermission);
    const requestLocationPermission = () => {
        const { requestLocation } = useLocationRequest();
        requestLocation();

        if (locationPermission) {
            router.replace('/(authenticated)/pinnwand');
        }
        else {
            Alert.alert('Fehler', 'Standortberechtigung nicht aktiviert');
        }
    };


            return (
               
                 
                       <SafeAreaView style={styles.container}>
               
                 
<LinearGradient
       colors={['orange', 'white']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    />
    <Image 
      source={require('@/assets/images/peopleWhiteBackground.png')} 
      resizeMode="center" 
      style={styles.imageBackground}
    />
    <View style={styles.contentContainer} >
                    <View style={styles.welcomeView}>
                      <Text style={styles.welcomeText}>Kann gleich los gehen!</Text>
                    </View>
                    <View style={styles.greenView}>
                      <Text style={styles.greenText}>
                Um die App optimal nutzen zu können, benötigt die App Zugriff auf deinen Standort.
                </Text>
                <Text style={styles.greenText}>
                  Dieser wird genutzt um relevante Posts in deiner Nähe zu finden und dir das beste Erlebnis zu gewährleisten.
                </Text>
                <Text style={styles.greenText} >
                
                  </Text>
            
            </View>
            <View style={styles.buttonContainer}>
            <View style={styles.probemonat }>
            <TouchableOpacity onPress={requestLocationPermission}>
  <Text style={styles.buttonText}>Standortberechtigung aktivieren 🚀</Text>
</TouchableOpacity>
                </View>
                </View>
                </View>
                </SafeAreaView>
             
                
                );
       
        
        
        };
        
        export default Page;

        const styles = createRStyle({
            container: {
                flex: 1,
                backgroundColor: 'white',
                alignItems: 'center',
                height:'100%'
            },
            gradient: {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            },
            imageBackground: {
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: '150rs',
              opacity: 0.8,
              zIndex: 1, // Fügen Sie diese Zeile hinzu
            },
            contentContainer: {
              flex: 1,
              width: '100%',
              zIndex: 3,
            },
            
            welcomeView: {
                marginTop: '25rs'
            },
            welcomeText: {
              fontSize: '32rs',
              fontWeight: 'bold',
            color: 'white',  
              letterSpacing: '0.5rs',
              alignSelf: 'center'
          },
          greenView: {
            marginTop: '30rs',
            padding: '15rs',
            borderRadius: '30rs',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            elevation: 3,
            borderWidth: 1,
            borderColor: '#e0e0e0',
            backdropFilter: 'blur(10px)'
        },
        greenText: {
          fontSize: '24rs',
          color: 'black',
          padding: '5rs',
          fontWeight: 'bold'
      },
      buttonContainer: {
            
 
        alignItems: 'center',
        
      },
      probemonat: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'green', 
        padding: '15rs',
        borderRadius: '30rs',
        color: 'white',
        marginTop: '100rs',
        height: '70rs',
        width: '350rs',
        marginBottom: '25rs',




        elevation: 4,
        borderWidth: 2,
        borderColor: '#45a049',
        transform: [{ scale: 1.02 }],
      },
     buttonText: {
        color: 'white',
        fontSize: '20rs'
    },

 

    loginContainer : {
     backgroundColor: 'orange',
     alignItems: 'center',
     justifyContent: 'center',
     borderRadius: 25,
     height: '60rs',
     width: '350rs',
   
     elevation: 4,
     
    
   },       
    input: {
              height: 40,
              margin: 12,
              borderWidth: 1,
            }
          });