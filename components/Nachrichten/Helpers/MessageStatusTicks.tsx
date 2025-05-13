import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Nutzt Expo Icons

export type TickStatus = 'sent' | 'read';

export const MessageStatusTicks = ({ status }: { status: TickStatus }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 2,
      tension: 30,
    }).start();
  }, [status]);

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
      {status === 'sent' && (
        <Ionicons name="checkmark" size={14} color="gray" />
      )}
      {status === 'read' && (
        <View style={styles.double}>
          <Ionicons name="checkmark" size={14} color="#4A90E2" />
          <Ionicons name="checkmark" size={14} color="#4A90E2" style={{ marginLeft: -5 }} />
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  double: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});