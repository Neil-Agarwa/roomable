import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCdjYdZD1JrYuzEclmmmA6_oRhejQ9wOaQ",
  authDomain: "study-room-availability.firebaseapp.com",
  databaseURL: "https://study-room-availability-default-rtdb.firebaseio.com",
  projectId: "study-room-availability",
  storageBucket: "study-room-availability.appspot.com",
  messagingSenderId: "435040431355",
  appId: "1:435040431355:ios:1febb6f59463be21cdd45e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

export { app, database }; 