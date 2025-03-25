import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen 
          name="index" 
          options={{ 
            title: 'UT Study Room Finder',
            headerStyle: {
              backgroundColor: '#BF5700',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }} 
        />
        <Stack.Screen name="floor/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="room/[id]" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
