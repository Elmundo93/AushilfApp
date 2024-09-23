import React from 'react';
import { View, KeyboardAvoidingView, Platform, TouchableOpacity, Text } from 'react-native';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import CreatePost from '../../components/Crud/Post/CreatePost';
import { createRStyle } from 'react-native-full-responsive';
import { ScrollView } from 'react-native-gesture-handler';

export default function Modal() {


  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
     <ScrollView
     contentContainerStyle={styles.scrollViewContent}>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16rs',
    borderBottomWidth: '1rs',
    borderBottomColor: '#e0e0e0',
  },
  closeButton: {
    padding: '8rs',
  },
  closeButtonText: {
    color: 'blue',
    fontSize: '16rs',
  },
  headerTitle: {
    fontSize: '18rs',
    fontWeight: 'bold',
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: '16rs',
  },
});