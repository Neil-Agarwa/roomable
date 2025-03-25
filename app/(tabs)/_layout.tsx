import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#BF5700',
        headerShown: true,
        tabBarStyle: {
          paddingBottom: 5,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Study Rooms',
          headerTitle: 'Study Rooms',
          tabBarIcon: ({ color }) => <Ionicons size={24} name="book" color={color} />,
        }}
      />
    </Tabs>
  );
} 