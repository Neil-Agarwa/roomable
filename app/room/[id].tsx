import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRoomStatus } from '../../hooks/useRoomStatus';

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

// Room type definition
interface Room {
  id: string;
  number: string;
  name: string;
  floor: string;
  capacity: number;
  status: 'available' | 'occupied';
  features: string[];
  occupiedUntil?: string;
  sensorData?: {
    distance?: number;
    sound?: number;
  };
}

// Define the type for roomData returned by useRoomStatus hook
interface RoomStatusData {
  roomData: {
    status: string;
    distance?: number;
    sound?: number;
  } | null;
  loading: boolean;
  error: Error | null;
}

// Available features for rooms
const ROOM_FEATURES = [
  'Whiteboard',
  'Power Outlets',
  'Wi-Fi',
  'Projector',
  'Computer',
  'Large Table',
  'Dual Monitors',
  'Standing Desk'
];

// Mock room data
const getRoomData = (id: string, sensorData: any): Room => {
  // Extract floor number from room ID (first digit)
  const floorNumber = id.charAt(0);
  
  // Determine status based on real sensor data
  const status = sensorData?.status === "Occupied" ? 'occupied' : 'available';
  
  // Use room number as seed to generate consistent capacity and features
  const roomNum = parseInt(id);
  
  // Determine capacity (4-10) based on room number
  const capacity = 4 + (roomNum % 7); // Will result in 4-10
  
  // Generate consistent features based on room number
  const featureSet = new Set<string>();
  
  // Always include these basic features
  featureSet.add('Power Outlets');
  featureSet.add('Wi-Fi');
  
  // Add whiteboard to odd-numbered rooms
  if (roomNum % 2 === 1) {
    featureSet.add('Whiteboard');
  }
  
  // Add projector to rooms divisible by 3
  if (roomNum % 3 === 0) {
    featureSet.add('Projector');
  }
  
  // Add computer to rooms divisible by 4
  if (roomNum % 4 === 0) {
    featureSet.add('Computer');
  }
  
  // Add large table to rooms divisible by 5
  if (roomNum % 5 === 0) {
    featureSet.add('Large Table');
  }
  
  // Create mock data for this room
  return {
    id,
    number: id,
    name: `Study Room ${id}`,
    floor: floorNumber,
    capacity,
    status,
    features: Array.from(featureSet),
    occupiedUntil: status === 'occupied' ? new Date(Date.now() + 3600000 * 2).toLocaleTimeString() : undefined,
    sensorData: {
      distance: sensorData?.distance,
      sound: sensorData?.sound,
    }
  };
};

export default function RoomDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { roomData, loading, error } = useRoomStatus() as RoomStatusData;
  const [room, setRoom] = useState<Room | null>(null);
  
  useEffect(() => {
    if (id) {
      setRoom(getRoomData(typeof id === 'string' ? id : String(id), roomData));
    }
  }, [id, roomData]);
  
  if (loading || !room) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text.dark} />
          </TouchableOpacity>
          <Text style={styles.title}>Room Details</Text>
          <View style={styles.emptyButton} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading room data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text.dark} />
        </TouchableOpacity>
        <Text style={styles.title}>Room Details</Text>
        <View style={styles.emptyButton} />
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.roomBanner} backgroundColor={room.status === 'occupied' ? COLORS.occupied : COLORS.available}>
          <View style={styles.bannerContent}>
            <Text style={styles.roomNumber}>Room {room.number}</Text>
            <View style={styles.statusContainer}>
              <Ionicons 
                name={room.status === 'occupied' ? 'close-circle' : 'checkmark-circle'} 
                size={20} 
                color="#fff" 
                style={styles.statusIcon}
              />
              <Text style={styles.statusText}>
                {room.status === 'occupied' ? 'Occupied' : 'Available'}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="business" size={20} color={COLORS.primary} />
              <Text style={styles.infoText}>Floor {room.floor}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="people" size={20} color={COLORS.primary} />
              <Text style={styles.infoText}>Capacity: {room.capacity}</Text>
            </View>
          </View>
          
          {room.status === 'occupied' && room.occupiedUntil && (
            <View style={styles.timeContainer}>
              <Ionicons name="time" size={20} color={COLORS.occupied} />
              <Text style={styles.timeText}>
                Occupied until {room.occupiedUntil}
              </Text>
            </View>
          )}
        </View>
        
        {room.sensorData && (
          <View style={styles.sensorCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="hardware-chip-outline" size={20} color={COLORS.primary} />
              <Text style={styles.cardTitle}>Sensor Data</Text>
            </View>
            <View style={styles.sensorDataContainer}>
              <View style={styles.sensorItem}>
                <View style={styles.sensorIconContainer}>
                  <Ionicons name="resize" size={24} color="#fff" />
                </View>
                <View style={styles.sensorInfo}>
                  <Text style={styles.sensorLabel}>Distance</Text>
                  <Text style={styles.sensorValue}>
                    {room.sensorData.distance?.toFixed(2) || 'N/A'} m
                  </Text>
                </View>
              </View>
              <View style={styles.sensorItem}>
                <View style={[styles.sensorIconContainer, {backgroundColor: COLORS.primaryLight}]}>
                  <Ionicons name="volume-medium" size={24} color="#fff" />
                </View>
                <View style={styles.sensorInfo}>
                  <Text style={styles.sensorLabel}>Sound Level</Text>
                  <Text style={styles.sensorValue}>
                    {room.sensorData.sound?.toFixed(2) || 'N/A'} dB
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
        
        <View style={styles.featuresCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="apps-outline" size={20} color={COLORS.primary} />
            <Text style={styles.cardTitle}>Features</Text>
          </View>
          <View style={styles.featuresList}>
            {room.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <View style={styles.featureIconContainer}>
                  <Ionicons name="checkmark" size={16} color="#fff" />
                </View>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  emptyButton: {
    padding: 8,
    width: 40,
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
  content: {
    flex: 1,
  },
  roomBanner: {
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  bannerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roomNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  statusIcon: {
    marginRight: 6,
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  infoCard: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: -20,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 8,
    fontSize: 16,
    color: COLORS.text.dark,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  timeText: {
    marginLeft: 8,
    fontSize: 16,
    color: COLORS.occupied,
    fontWeight: '500',
  },
  sensorCard: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: 10,
  },
  sensorDataContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sensorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
  },
  sensorIconContainer: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sensorInfo: {
    flex: 1,
  },
  sensorLabel: {
    fontSize: 14,
    color: COLORS.text.medium,
    marginBottom: 2,
  },
  sensorValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text.dark,
  },
  featuresCard: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    marginBottom: 32,
  },
  featuresList: {
    marginTop: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIconContainer: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    color: COLORS.text.dark,
  },
}); 