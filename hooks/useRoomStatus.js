import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../config/firebase';

/**
 * Custom hook to fetch and monitor room status from Firebase
 * @returns {Object} Room status data and loading state
 */
export function useRoomStatus() {
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Create a reference to the "sensor" node in the database
    const sensorRef = ref(database, 'sensor');
    
    // Set up a listener for changes to that data
    const unsubscribe = onValue(sensorRef, (snapshot) => {
      try {
        const data = snapshot.val();
        setRoomData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching room status:', err);
        setError(err);
        setLoading(false);
      }
    }, (err) => {
      console.error('Error setting up database listener:', err);
      setError(err);
      setLoading(false);
    });

    // Clean up listener when component unmounts
    return () => unsubscribe();
  }, []);

  return { roomData, loading, error };
} 