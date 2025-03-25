import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
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
  status: 'available' | 'occupied';
  capacity: number;
}

// Generate 15 rooms for demo
const generateRooms = (floorId: string, sensorStatus: string | null): Room[] => {
  const rooms: Room[] = [];
  const totalRooms = 15;
  
  // Default to "available" if no sensor data
  const roomStatus = sensorStatus === "Occupied" ? 'occupied' : 'available';
  
  for (let i = 1; i <= totalRooms; i++) {
    const roomNumber = `${floorId}${i.toString().padStart(2, '0')}`;
    const roomNum = parseInt(roomNumber);
    
    // Determine capacity (4-10) based on room number - same formula as in room/[id].tsx
    const capacity = 4 + (roomNum % 7);
    
    rooms.push({
      id: roomNumber,
      number: roomNumber,
      name: `Study Room ${roomNumber}`,
      // Use the real status from Firebase for all rooms in this demo
      status: roomStatus,
      capacity: capacity,
    });
  }
  
  return rooms;
};

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

export default function FloorDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { roomData, loading, error } = useRoomStatus() as RoomStatusData;
  const [rooms, setRooms] = useState<Room[]>([]);
  
  useEffect(() => {
    if (id) {
      const sensorStatus = roomData?.status || null;
      setRooms(generateRooms(typeof id === 'string' ? id : String(id), sensorStatus));
    }
  }, [id, roomData]);
  
  const handleRoomPress = (roomId: string) => {
    router.push(`/room/${roomId}`);
  };
  
  const renderRoom = ({ item }: { item: Room }) => (
    <TouchableOpacity 
      style={[
        styles.roomCard, 
        item.status === 'occupied' ? styles.occupiedRoom : styles.availableRoom
      ]}
      onPress={() => handleRoomPress(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.roomHeader}>
        <View style={styles.roomNumberContainer}>
          <Text style={styles.roomNumber}>{item.number}</Text>
        </View>
        <View style={[
          styles.statusBadge,
          item.status === 'occupied' ? styles.occupiedBadge : styles.availableBadge
        ]}>
          <Text style={[
            styles.statusText,
            item.status === 'occupied' ? styles.occupiedText : styles.availableText
          ]}>
            {item.status === 'occupied' ? 'Occupied' : 'Available'}
          </Text>
        </View>
      </View>
      
      <View style={styles.roomInfo}>
        <Text style={styles.roomName}>{item.name}</Text>
      </View>
      
      <View style={styles.roomFooter}>
        <View style={styles.capacityContainer}>
          <Ionicons name="people" size={16} color={COLORS.text.medium} />
          <Text style={styles.capacityText}>Capacity: {item.capacity}</Text>
        </View>
        <Ionicons 
          name="chevron-forward" 
          size={18} 
          color={item.status === 'occupied' ? COLORS.occupied : COLORS.available} 
        />
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text.dark} />
          </TouchableOpacity>
          <Text style={styles.title}>Floor {id}</Text>
          <View style={styles.emptyButton} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading room data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const availableRooms = rooms.filter(room => room.status === 'available').length;
  const occupiedRooms = rooms.filter(room => room.status === 'occupied').length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text.dark} />
        </TouchableOpacity>
        <Text style={styles.title}>Floor {id}</Text>
        <View style={styles.emptyButton} />
      </View>
      
      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <View style={styles.summaryIconContainer}>
            <Ionicons name="checkmark-circle" size={20} color={COLORS.available} />
          </View>
          <View>
            <Text style={styles.summaryValue}>{availableRooms}</Text>
            <Text style={styles.summaryLabel}>Available</Text>
          </View>
        </View>
        
        <View style={styles.summaryDivider} />
        
        <View style={styles.summaryItem}>
          <View style={styles.summaryIconContainer}>
            <Ionicons name="close-circle" size={20} color={COLORS.occupied} />
          </View>
          <View>
            <Text style={styles.summaryValue}>{occupiedRooms}</Text>
            <Text style={styles.summaryLabel}>Occupied</Text>
          </View>
        </View>
      </View>
      
      <FlatList
        data={rooms}
        renderItem={renderRoom}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.roomsGrid}
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
  emptyButton: {
    padding: 8,
    width: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
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
  summaryContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryIconContainer: {
    marginRight: 10,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text.dark,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.text.medium,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: '#eee',
    marginHorizontal: 20,
  },
  roomsGrid: {
    padding: 8,
  },
  roomCard: {
    flex: 1,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    overflow: 'hidden',
  },
  availableRoom: {
    borderTopWidth: 4,
    borderTopColor: COLORS.available,
  },
  occupiedRoom: {
    borderTopWidth: 4,
    borderTopColor: COLORS.occupied,
  },
  roomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  roomNumberContainer: {
    backgroundColor: COLORS.secondary,
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  roomNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
  },
  availableBadge: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  occupiedBadge: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  availableText: {
    color: COLORS.available,
  },
  occupiedText: {
    color: COLORS.occupied,
  },
  roomInfo: {
    padding: 12,
  },
  roomName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.dark,
  },
  roomFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  capacityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  capacityText: {
    marginLeft: 4,
    fontSize: 14,
    color: COLORS.text.medium,
  },
}); 