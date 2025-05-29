// components/Nachrichten/MutedNotice.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const MutedNotice = () => (
  <View style={styles.container}>
    <Text style={styles.text}>
      Du hast diesen Nutzer stummgeschaltet. Du erhältst keine Benachrichtigungen.
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff4e6',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ffd6a0',
  },
  text: {
    color: '#b26b00',
    fontWeight: '500',
  },
});