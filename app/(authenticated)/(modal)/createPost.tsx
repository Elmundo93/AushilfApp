import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import CreatePost from '@/components/Crud/Post/CreatePost';
import { LinearGradient } from 'expo-linear-gradient';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function Modal() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['orange', 'white']}
        start={{ x: 0, y: 0.2 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradient}
      />
      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        extraScrollHeight={Platform.OS === 'ios' ? 125 : 125}
        enableOnAndroid={true}
      >
        <View style={styles.innerContainer}>
          <CreatePost />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
   
  },
  innerContainer: {

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