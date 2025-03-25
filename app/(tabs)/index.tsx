import { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';

// UT Austin Colors
const COLORS = {
  primary: '#BF5700', // UT Austin burnt orange
  secondary: '#333F48', // UT Austin secondary color
  background: '#f9f9f9',
  available: '#4CAF50',
  occupied: '#F44336',
  text: {
    dark: '#333333',
    medium: '#666666',
    light: '#999999',
  }
};

// Create floor data
const FLOORS = [
  { id: '1', name: 'Floor 1' },
  { id: '2', name: 'Floor 2' },
  { id: '3', name: 'Floor 3' },
  { id: '4', name: 'Floor 4' },
  { id: '5', name: 'Floor 5' },
];

export default function HomeScreen() {
  const router = useRouter();
  
  const handleFloorSelect = (floorId) => {
    router.push(`/floor/${floorId}`);
  };

  const renderFloor = ({ item }) => (
    <TouchableOpacity 
      style={styles.floorCard}
      onPress={() => handleFloorSelect(item.id)}
    >
      <View style={styles.floorContent}>
        <Ionicons name="layers" size={32} color={COLORS.primary} />
        <Text style={styles.floorName}>{item.name}</Text>
      </View>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Available</Text>
          <Text style={[styles.statValue, styles.available]}>10</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Occupied</Text>
          <Text style={[styles.statValue, styles.occupied]}>5</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.text.light} style={styles.arrow} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>UT Study Room Finder</Text>
        <Text style={styles.subtitle}>Select a floor to see available rooms</Text>
      </View>
      
      <FlatList
        data={FLOORS}
        renderItem={renderFloor}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.text.medium,
    marginTop: 4,
  },
  listContent: {
    padding: 16,
  },
  floorCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  floorContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  floorName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.dark,
    marginLeft: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    marginRight: 10,
  },
  statItem: {
    marginRight: 14,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.text.medium,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  available: {
    color: COLORS.available,
  },
  occupied: {
    color: COLORS.occupied,
  },
  arrow: {
    marginLeft: 4,
  },
}); 