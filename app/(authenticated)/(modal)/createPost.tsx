import React from 'react';
import {  KeyboardAvoidingView, Platform, TouchableOpacity, Text } from 'react-native';

import { StatusBar } from 'expo-status-bar';
import CreatePost from '@/components/Crud/Post/CreatePost';
import { createRStyle } from 'react-native-full-responsive';
import { ScrollView } from 'react-native-gesture-handler';
import {LinearGradient} from 'expo-linear-gradient';
export default function Modal() {


  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      
     <ScrollView
     contentContainerStyle={styles.scrollViewContent}>
      <LinearGradient
            colors={['orange', 'white']}
            start={{ x: 0, y: 0.2 }}
            end={{ x: 0, y: 1 }}
            style={styles.gradient}
          />
      <CreatePost />
     </ScrollView>
     
      <StatusBar style="light" />
    </KeyboardAvoidingView>
  );
}

const styles = createRStyle({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: '-26rs',
  },
  gradient: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 170,
  },
  closeButton: {
    padding: '8rs',
  },
  closeButtonText: {
    color: 'blue',

  },
  headerTitle: {

    fontWeight: 'bold',
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: '16rs',
  },
});