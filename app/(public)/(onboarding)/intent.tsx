// app/(public)/onboarding/intent.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { useOnboardingStore } from '@/components/stores/OnboardingContext';
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getIconForCategory } from '@/components/Pinnwand/utils/CategoryAndOptionUtils';
import { getLottieStyle } from './styles';
import { onboardingStyles} from './styles'; 




const CATEGORIES = [
  { label: 'Garten', color: 'lightgreen', key: 'garten' },
  { label: 'Haushalt', color: 'lightblue', key: 'haushalt' },
  { label: 'Soziales', color: 'rgb(255, 102, 102)', key: 'soziales' },
  { label: 'Gastro', color: 'rgb(255, 255, 102)', key: 'gastro' },
  { label: 'Handwerk', color: 'orange', key: 'handwerk' },
  { label: 'Bildung', color: 'lightgrey', key: 'bildung' },
];

export default function IntentScreen() {

  const beeAnimation = require('@/assets/animations/Bee.json');
  const router = useRouter();
  const { setField, categories, bio } = useOnboardingStore();

  const [selectedCategories, setSelectedCategories] = useState<string[]>(categories || []);

  React.useEffect(() => {
    setSelectedCategories(categories || []);
  }, [categories]);

  const toggleCategory = (label: string) => {
    const newCategories = selectedCategories.includes(label)
      ? selectedCategories.filter(cat => cat !== label)
      : [...selectedCategories, label];
    
    setSelectedCategories(newCategories);
    setField('categories', newCategories as any);
  };

  const handleNext = () => {
    router.push('about' as any);
  };

  const pathname = usePathname();

  const steps = ['intro', 'userinfo', 'intent', 'about', 'profileImage', 'password','conclusion','savety'];
    const currentStep = steps.findIndex((step) => pathname.includes(step));


  return (
    <SafeAreaView style={onboardingStyles.container}>
      <LinearGradient
        colors={['#ff9a00', '#ffc300', '#ffffff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <TouchableOpacity style={onboardingStyles.backButton} onPress={() => router.replace('/(public)/(onboarding)/userinfo')}>
        <Ionicons name="arrow-back" size={28} color="black" />
      </TouchableOpacity>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={onboardingStyles.topContainer}>
            <LottieView
              source={beeAnimation}
              autoPlay
              loop
              style={getLottieStyle(currentStep)}
            />
            <View style={onboardingStyles.progressContainer}>
              {steps.map((_, index) => (
                <View
                  key={index}
                  style={[onboardingStyles.dot, index <= currentStep && onboardingStyles.activeDot]}
                />
              ))}
            </View>
            <View style={onboardingStyles.titleCard}>
              <View style={onboardingStyles.titleContainer}>
                <Text style={onboardingStyles.title}>Wobei möchtest du helfen oder Hilfe finden?</Text>
              </View>
            </View>
          </View>

          <View style={onboardingStyles.contentContainer}>
            <View style={onboardingStyles.card}>
            
                

              <Text style={styles.subtitle}>Wähle die Bereiche in denen du Hilfe suchst oder anbieten möchtest. {'\n'} Sie werden später in deinem Profil angezeigt. </Text>
              <View style={onboardingStyles.categoryContainer}>
                {CATEGORIES.map(({ label, color, key }) => (
                  <TouchableOpacity
                    key={label}
                    style={[onboardingStyles.categoryButton, {
                      backgroundColor: selectedCategories.includes(label) ? color : 'white',
                      borderColor: color,
                      borderWidth: 1,
                      borderRadius: 25,
                      paddingVertical: 12,
                      paddingHorizontal: 20,
                      margin: 5,
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: 100,
                      minHeight: 100,
                    }]}
                    onPress={() => toggleCategory(label)}
                  >
                    <Image 
                      source={getIconForCategory(key)}
                      style={{
                        width: 60,
                        height: 60,
                        marginBottom: 10,
                      }}
                    />
                    <Text style={{ 
                      color: selectedCategories.includes(label) ? 'black' : 'grey', 
                      fontWeight: '600',
                      fontSize: 16,
                      textAlign: 'center',
                    }}>{label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity style={onboardingStyles.button} onPress={handleNext}>
                <Text style={onboardingStyles.buttonText}>Weiter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.7)',
    padding: 10,
    borderRadius: 20,
  },
  topContainer: {
    paddingTop: 20,
    marginTop: 30,
  },
  titleCard: {
    padding: 25,
    borderRadius: 25,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#222',
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
    marginTop: -40,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 20,
    gap: 10,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 25,
    borderRadius: 25,
    marginTop: 50,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',

    marginBottom: 10,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  optionButton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#aaa',
  },
  optionText: {
    color: '#333',
    fontSize: 16,
  },
  optionTextActive: {
    color: 'white',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  categoryButton: {
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginBottom: 10,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
    padding: 15,
    textAlignVertical: 'top',
    backgroundColor: '#fff',
    height: 100,
  },
  button: {
    backgroundColor: 'orange',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ccc',
  },
  activeDot: {
    backgroundColor: 'white',
    transform: [{ scale: 1.2 }],
  },
  lottie: {
    position: 'absolute',
    top: -50,
    left: 140,
    right: 0,
    bottom: 0,
    width: 120,
    height: 120,
    alignSelf: 'center',
  },
});