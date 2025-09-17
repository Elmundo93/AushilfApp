import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';

interface EmptyListProps {
  selectedCategory: string | null;
  onResetFilter: () => void;
}

export default function EmptyList({ selectedCategory, onResetFilter }: EmptyListProps) {
  const NavigateToCreatePost = () => {
    router.push('/pinnwand');

    setTimeout(() => {
      router.push('/createPost');
    }, 500);
  };

  return (
    <View style={styles.emptyContainer}>
      <View style={styles.navigationContainer}>
        <Text style={styles.emptyText}>Keine Nachrichten vorhanden</Text>
        <Text style={styles.emptySubText}>Versuch's mal mit einem Post um zu schauen ob es jemanden gibt der dir hilft oder deine Hilfe benötigt!</Text>
        <TouchableOpacity style={styles.navigationButton} onPress={NavigateToCreatePost}>
          <Text style={styles.navigationButtonText}>Erstelle einen Post</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.emptySubText}>
        {selectedCategory 
          ? `Keine Chats in der Kategorie "${selectedCategory}" gefunden. Wählen Sie eine andere Kategorie oder alle Kategorien.`
          : ''
        }
      </Text>
      {selectedCategory && (
        <TouchableOpacity 
          style={styles.resetFilterButton}
          onPress={onResetFilter}
        >
          <View style={styles.resetFilterGradient}>
            <Text style={styles.resetFilterText}>Alle Kategorien anzeigen</Text>
            <Text style={styles.resetFilterSubText}>Filter zurücksetzen</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  navigationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  navigationButton: { 
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    marginTop: 30,
    borderWidth: 1,
    borderColor: 'orange',
  },
  navigationButtonText: {
    color: 'orange',
    fontSize: 22,
    letterSpacing: 0.5,
    textAlign: 'center',
    padding: 10,
    fontWeight: '700',
  },
  emptyText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySubText: {
    fontSize: 22,
    textAlign: 'center',
    color: '#666',
  },
  resetFilterButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'orange',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    minWidth: 200,
    alignSelf: 'center',
  },
  resetFilterGradient: {
    backgroundColor: 'orange',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetFilterText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  resetFilterSubText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    marginTop: 2,
    textAlign: 'center',
  },
});
