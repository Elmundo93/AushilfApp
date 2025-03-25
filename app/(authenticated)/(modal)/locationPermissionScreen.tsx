import { View, Text, Alert, ActivityIndicator, SafeAreaView } from 'react-native'
import React from 'react'
import { useLocationStore } from '@/components/stores/locationStore'
import { Image } from 'react-native'
import { createRStyle } from 'react-native-full-responsive'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { LinearGradient } from 'expo-linear-gradient'
import { useLocationRequest } from '@/components/Location/locationRequest'
import { useState, useEffect } from 'react'
const Page = () => {

  const { requestLocation } = useLocationRequest()
  const [loading, setLoading] = useState(false)
  const [currentImage, setCurrentImage] = useState<any>(null)
  const { setLocationPermission } = useLocationStore()
  useEffect(() => {
    const bgImage1 = require('@/assets/images/avatar-thinking-1-svgrepo-com.png')
    const bgImage2 = require('@/assets/images/avatar-thinking-4-svgrepo-com.png')
    const bgImage3 = require('@/assets/images/avatar-thinking-5-svgrepo-com.png')
    const bgImage4 = require('@/assets/images/avatar-thinking-6-svgrepo-com.png')
    const bgImage5 = require('@/assets/images/avatar-thinking-svgrepo-com.png')

    const bgImages = [bgImage1, bgImage2, bgImage3, bgImage4, bgImage5]
    const randomBgImage = bgImages[Math.floor(Math.random() * bgImages.length)]
    setCurrentImage(randomBgImage)
  }, [])

  const requestLocationPermission = async () => {
    setLoading(true)
   
    
    const permissionGranted = await requestLocation()

    if (permissionGranted) {
      
      try {
        setLocationPermission(true)
      } catch (error) {
        console.error('Fehler bei der Anmeldung:', error)
        Alert.alert('Fehler', 'Standortberechtigung nicht aktiviert')
      }
    } else { 
      Alert.alert('Fehler', 'Standortberechtigung nicht aktiviert')
    }
    setLoading(false)
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['orange', 'white']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      />
      
      <Image 
        source={currentImage} 
        resizeMode="center" 
        style={styles.imageBackground}
      />
      
      <View style={styles.contentContainer}>
        <View style={styles.welcomeView}>
          <Text style={styles.welcomeText}>Gleich geht's los!</Text>
        </View>

        <View style={styles.greenView}>
          <Text style={styles.greenText}>
            Um die App optimal nutzen zu können, benötigt die App Zugriff auf deinen Standort.
          </Text>
          <Text style={styles.greenText}>
            Dieser wird genutzt um relevante Posts in deiner Nähe zu finden und dir das beste Erlebnis zu gewährleisten.
          </Text>
          <Text style={styles.greenText}></Text>
        </View>

        <View style={styles.buttonContainer}>
          <View style={styles.probemonat}>
            {loading ? <ActivityIndicator size="large" color="white" /> : <TouchableOpacity onPress={requestLocationPermission}>
              <Text style={styles.buttonText}>
                Standortberechtigung aktivieren 🚀
              </Text>
            </TouchableOpacity>}
            {loading ? <ActivityIndicator size="large" color="white" /> : <TouchableOpacity onPress={requestLocationPermission}>
              <Text style={styles.buttonText}>
                Ohne Standort fortfahren 
              </Text>
            </TouchableOpacity>}
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Page

const styles = createRStyle({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    height: '100%'
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
    zIndex: 1,
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
  loginContainer: {
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
})
