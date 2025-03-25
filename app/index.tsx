import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, SafeAreaView, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRoomStatus } from '../hooks/useRoomStatus';

// UT Austin Colors
const COLORS = {
  primary: '#BF5700', // UT Austin burnt orange
  primaryLight: '#FF8A3D', // Lighter orange
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

// Generate rooms for a floor to calculate room counts
const generateRoomsForFloor = (floorId: string, sensorStatus: string | null) => {
  const totalRooms = 15;
  const roomStatus = sensorStatus === "Occupied" ? 'occupied' : 'available';
  
  // Return the count of available and occupied rooms
  return {
    availableRooms: roomStatus === 'available' ? totalRooms : 0,
    occupiedRooms: roomStatus === 'occupied' ? totalRooms : 0
  };
};

export default function HomeScreen() {
  const router = useRouter();
  const { roomData, loading, error } = useRoomStatus();
  const [floorStatuses, setFloorStatuses] = useState<
    Array<{ id: string; name: string; availableRooms: number; occupiedRooms: number }>
  >(FLOORS.map(floor => ({ ...floor, availableRooms: 0, occupiedRooms: 0 })));

  useEffect(() => {
    if (roomData) {
      const sensorStatus = roomData.status || null;
      
      // Update all floors with accurate room counts based on sensor status
      setFloorStatuses(prevStatuses => {
        return prevStatuses.map(floor => {
          const roomCounts = generateRoomsForFloor(floor.id, sensorStatus);
          return {
            ...floor,
            availableRooms: roomCounts.availableRooms,
            occupiedRooms: roomCounts.occupiedRooms
          };
        });
      });
    }
  }, [roomData]);
  
  const handleFloorSelect = (floorId: string) => {
    router.push(`/floor/${floorId}`);
  };

  const renderFloor = ({ item }: { item: { id: string; name: string; availableRooms: number; occupiedRooms: number } }) => (
    <TouchableOpacity 
      style={styles.floorCard}
      onPress={() => handleFloorSelect(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.floorContent}>
        <View style={styles.floorIconContainer}>
          <Ionicons name="business" size={28} color={COLORS.primary} />
        </View>
        <Text style={styles.floorName}>{item.name}</Text>
      </View>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <View style={styles.statIconContainer}>
            <Ionicons name="checkmark-circle" size={14} color={COLORS.available} />
          </View>
          <Text style={styles.statLabel}>Available</Text>
          <Text style={[styles.statValue, styles.available]}>{item.availableRooms}</Text>
        </View>
        <View style={styles.statItem}>
          <View style={styles.statIconContainer}>
            <Ionicons name="close-circle" size={14} color={COLORS.occupied} />
          </View>
          <Text style={styles.statLabel}>Occupied</Text>
          <Text style={[styles.statValue, styles.occupied]}>{item.occupiedRooms}</Text>
        </View>
      </View>
      <View style={styles.arrowContainer}>
        <Ionicons name="chevron-forward" size={20} color="#fff" />
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading room data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="warning" size={48} color={COLORS.primary} />
        <Text style={styles.errorText}>Error loading room data</Text>
        <Text style={styles.errorDescription}>Please check your connection and try again</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logoText}>Roomable</Text>
      </View>
      
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Study Rooms</Text>
        <Text style={styles.subtitle}>Select a floor to view available rooms</Text>
      </View>
      
      <FlatList
        data={floorStatuses}
        renderItem={renderFloor}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    letterSpacing: 1,
  },
  titleContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text.dark,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.text.medium,
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.text.medium,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text.dark,
  },
  errorDescription: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.text.medium,
    textAlign: 'center',
  },
  listContent: {
    padding: 16,
  },
  floorCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    borderLeftWidth: 5,
    borderLeftColor: COLORS.primary,
  },
  floorContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  floorIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(191, 87, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  floorName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.dark,
  },
  statsContainer: {
    flexDirection: 'row',
    marginRight: 10,
  },
  statItem: {
    marginRight: 16,
    alignItems: 'center',
  },
  statIconContainer: {
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.text.medium,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  available: {
    color: COLORS.available,
  },
  occupied: {
    color: COLORS.occupied,
  },
  arrowContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
