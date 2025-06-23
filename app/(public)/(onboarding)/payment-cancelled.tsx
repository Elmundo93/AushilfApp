// app/(public)/(onboarding)/payment-cancelled.tsx
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function PaymentCancelled() {
  const router = useRouter();

  const handleRetry = () => {
    router.replace('/(public)/(onboarding)/savety');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🛑</Text>
      <Text style={styles.title}>Zahlung abgebrochen</Text>
      <Text style={styles.message}>
        Du hast den Verifizierungsprozess abgebrochen. Du kannst ihn jederzeit neu starten.
      </Text>
      <Pressable style={styles.button} onPress={handleRetry}>
        <Text style={styles.buttonText}>Zurück zur Sicherheitsabfrage</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  emoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#555',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});