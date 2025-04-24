// components/Anmelden/FortschrittAnzeige.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export const FortschrittAnzeige = ({ filled, total }: { filled: number, total: number }) => {
  const percent = Math.round((filled / total) * 100);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{filled}/{total} Felder ausgefüllt</Text>
      <View style={styles.barBackground}>
        <LinearGradient
          colors={['#FFB347', '#FF8C00']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.barFill, { width: `${percent}%` }]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
    width: '100%',
    alignItems: 'center',
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    color: '#444',
    fontWeight: '500',
  },
  barBackground: {
    height: 12,
    backgroundColor: '#eee',
    borderRadius: 6,
    width: '100%',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 6,
  },
});