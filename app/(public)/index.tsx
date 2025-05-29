import { View, Text, Animated, SafeAreaView, Image, StyleSheet } from 'react-native'
import React, {useRef, useEffect} from 'react'
import {  router } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';

const Page = () => {

  const underlineWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Verzögerung von 500ms
    setTimeout(() => {
      Animated.spring(underlineWidth, {
        toValue: 1,
        useNativeDriver: true,

        tension: 20,  
        friction: 7   
      }).start();
    }, 500);
  }, []);



    const login = () => {
      router.push('/(public)/loginScreen' as any);
    };

            return (
<SafeAreaView style={styles.container}>
<LinearGradient
        colors={['#ff9a00', '#ffc300', '#ffffff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.backgroundImage, { zIndex: 2 }]} >
    <Image 
      source={require('@/assets/images/peopleWhiteBackground.png')} 
      resizeMode="contain" 
      style={styles.imageBackground}
    />
    </View>
    <View style={styles.contentContainer} >
                    <View style={styles.welcomeView}>
                      <Text style={styles.welcomeText}>Herzlich Willkommen!</Text>
                    </View>
                    <View style={styles.greenView}>
                      <Text style={styles.greenText}>
                Wir helfen ihnen eine helfende Hand zu finden!
                </Text>
                <Text style={styles.greenText}>
                  - oder eine zu werden!
                </Text>
               
            
            </View>
            <Text style={styles.schnellText} >
                Schnell und einfach mit der AushilfApp!
                  </Text>
                  <Animated.View style={{
  width: '100%',
  height: 20,
  transform: [{
    scaleX: underlineWidth
  }, {
    scaleY: -1
  }],
  opacity: underlineWidth,
  transformOrigin: 'left', 
}}>
  <Svg width="100%" height="20" viewBox="0 0 100 20">
    <Path
      d="M0,10 Q50,20 100,10"
      stroke="white"
      strokeWidth="3"
      fill="none"
    />
  </Svg>
</Animated.View>
        <View style={styles.buttonContainer}>
           
                  
                  <View style={styles.loginContainer}>
                    <TouchableOpacity onPress={login}>
                      <Text style={styles.buttonText}>Los geht's! 🟢
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                </View>
                </SafeAreaView>
             
                
                );
       
        
        
        };
        
        export default Page;

        const styles = StyleSheet.create({
            container: {
                flex: 1,
                backgroundColor: 'white',
                alignItems: 'center',
                height:'100%'
            },
            backgroundImage: {
                width: '100%',
                height: '100%',
                position: 'absolute',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 2,
            },
            gradient: {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1,
            },
            imageBackground: {
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: 120,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.9,
              zIndex: 2,
              resizeMode: 'contain',
            },
            contentContainer: {
              flex: 1,
              width: '100%',
              zIndex: 3,
              justifyContent: 'flex-start',
            },
            
            welcomeView: {
                marginTop: 25,
            },
            welcomeText: {
              fontSize: 32,
              fontWeight: 'bold',
              color: 'white',  
              letterSpacing: 0.5,
              alignSelf: 'center'
            },
            greenView: {
              marginTop: 30,
              padding: 15,
              borderRadius: 30,
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              elevation: 3,
              borderWidth: 1,
              borderColor: '#e0e0e0',
            },
            greenText: {
              fontSize: 26,
              color: 'black',
              padding: 5,
              fontWeight: 'bold'
          },
          schnellText: {
            fontSize: 28,
            color: 'black',
            padding: 5,
            fontWeight: 'bold',
            marginTop: 20,
            alignSelf: 'center',
            textAlign: 'center'
          },
          buttonContainer: {
            position: 'absolute',
            bottom: '20%',
            left: 0,
            right: 0,
            alignItems: 'center',
          },
          probemonat: {
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'green', 
            padding: 15,
            borderRadius: 30,
            color: 'white',
            marginTop: 100,
            height: 70,
            width: 350,
            marginBottom: 25,




            elevation: 4,
            borderWidth: 2,
            borderColor: '#45a049',
            transform: [{ scale: 1.02 }],
          },
         buttonText: {
            color: 'white',
            fontSize: 20
        },

 

    loginContainer : {
     backgroundColor: 'orange',
     alignItems: 'center',
     justifyContent: 'center',
     borderRadius: 25,
     height: 60,
     width: 350,
   
     elevation: 4,
     
    
   },       
    input: {
              height: 40,
              margin: 12,
              borderWidth: 1,
            }
          });
