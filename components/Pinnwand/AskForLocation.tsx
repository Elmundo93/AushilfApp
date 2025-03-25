import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

const AskForLocation = () => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Ionicons name="location" size={50} color="orange" style={styles.icon} />
        
        <Text style={styles.title}>Standort erforderlich</Text>
        
        <Text style={styles.description}>
          Bitte aktivieren Sie die Standortfunktion, um Beiträge aus Ihrer Nähe zu sehen und das beste Erlebnis zu gewährleisten.
        </Text>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => {
            router.push("/(authenticated)/(modal)/locationPermissionScreen" as any);
          }}
        >
          <Ionicons name="navigate" size={20} color="white" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Standort aktivieren</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 24,
    lineHeight: 24,
  },
  button: {
    backgroundColor: 'orange',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    width: '100%',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AskForLocation;