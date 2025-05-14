import React from 'react';
import { View, ScrollView, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import CreatePost from '@/components/Crud/Post/CreatePost';
import { LinearGradient } from 'expo-linear-gradient';

export default function Modal() {
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <LinearGradient
        colors={['orange', 'white']}
        start={{ x: 0, y: 0.2 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradient}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.innerContainer}>
          <CreatePost />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContent: {
    flexGrow: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 170,
    zIndex: -1,
  },
});