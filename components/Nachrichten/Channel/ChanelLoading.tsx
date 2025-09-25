import { LinearGradient } from "expo-linear-gradient";
import { Animated, View } from "react-native";
import { StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import { Text } from "react-native";

export const ChanelLoading = () => {
  return (
    <View style={styles.loadingContainer}>
        <LinearGradient colors={['#FFA500', 'white', 'white']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={StyleSheet.absoluteFill} />
        <Animated.View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
          <View style={styles.loadingCard}>
            <LottieView source={require('@/assets/animations/LoadingWarp.json')} autoPlay loop style={{ width: 120, height: 120 }} />
            <Text style={styles.loadingTitle}>Chat wird geladen</Text>
            <Text style={styles.loadingSubtitle}>Nachrichten werden vorbereitet...</Text>
          </View>
        </Animated.View>
      </View>
                );
}



const styles = StyleSheet.create({loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' },
                loadingCard: { backgroundColor: 'white', borderRadius: 15, padding: 20, alignItems: 'center', width: '80%', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
                loadingTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginTop: 10 },
                loadingSubtitle: { fontSize: 14, color: '#666', marginTop: 5, textAlign: 'center' },});

;