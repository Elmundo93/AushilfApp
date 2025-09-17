import React from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import { useUiStore } from '@/components/stores/useUIStore';

export function LoadingOverlay() {
  const busy = useUiStore(s => s.isBusy());
  if (!busy) return null;
  return (
    <View accessibilityLabel="Ladevorgang" accessible
      style={{ position:'absolute', backgroundColor:'rgba(0,0,0,0.25)', justifyContent:'center', alignItems:'center' }}>
      <ActivityIndicator size="large" />
      <Text style={{ marginTop:8, fontSize:16 }}>Bitte einen Moment…</Text>
    </View>
  );
}