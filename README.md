# Roomable: Study Room Availability App

Roomable is a mobile application that displays real-time availability of study rooms at UT Austin. It uses Firebase Realtime Database to monitor and display room occupancy status.

## Features

- Real-time room availability tracking
- Floor-based navigation to quickly find available rooms
- Room details including capacity and amenities
- Sensor data visualization (distance and sound levels)

## Screenshots

(Screenshots will go here)

## Prerequisites

Before you begin, ensure you have the following installed:

### Node.js and npm
```bash
# Windows (recommended)
# Download and run the installer from https://nodejs.org/
# Choose the LTS version

# Windows (using Chocolatey)
choco install nodejs

# macOS (using Homebrew)
brew install node

# Linux (using apt)
sudo apt update
sudo apt install nodejs npm
```
Verify installation: `node -v` and `npm -v` (version 14 or higher recommended)

### Expo CLI
```bash
npm install -g expo-cli
```
Verify installation: `expo --version`

### Android Development (Windows/macOS/Linux)
- Install Android Studio: https://developer.android.com/studio
- During installation, ensure you select:
  - Android SDK
  - Android SDK Platform
  - Android Virtual Device
- After installation, open Android Studio > More Actions > SDK Manager:
  - In SDK Platforms, select Android 13 (Tiramisu)
  - In SDK Tools, select Android SDK Build-Tools
- Create a virtual device using the AVD Manager in Android Studio:
  - Click "Virtual Device Manager" > "Create Device"
  - Select a device (e.g., Pixel 6) and click "Next"
  - Download and select a system image (Android 13) and click "Next"
  - Click "Finish" to create the virtual device

### iOS Development (macOS only)
- Install Xcode from the Mac App Store
- Install iOS Simulator: `xcode-select --install`

### Expo Go App (for physical device testing)
- Android: Download from the [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
- iOS: Download from the [App Store](https://apps.apple.com/app/expo-go/id982107779)

## Setup Instructions

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/roomable.git
   cd roomable
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npx expo start
   ```

4. Choose a method to run the app:
   - Press `a` to open in Android Emulator
   - Press `i` to open in iOS Simulator (macOS only)
   - Scan the QR code with your phone using the Expo Go app (Android) or camera app (iOS)
   - Press `w` to open in a web browser (some features may be limited)

## Troubleshooting

### Expo Go Connection Issues

If you encounter timeout errors when trying to open the app on your physical device:

1. Ensure your phone and computer are on the same WiFi network
2. Try running with the LAN option:
   ```bash
   npx expo start --lan
   ```
3. If still experiencing issues, try the tunnel option:
   ```bash
   npm install @expo/ngrok
   npx expo start --tunnel
   ```

### Metro Bundler Issues

If you encounter issues with the Metro bundler:

1. Clear the cache:
   ```bash
   npx expo start --clear
   ```
2. Reset the cache completely:
   ```bash
   npx react-native start --reset-cache
   ```

### Firebase Connection Issues

If you're having trouble with the Firebase connection:

1. Verify that the configuration files are in the correct location:
   - `GoogleService-Info.plist` in the root directory (for iOS)
   - `google-services.json` in the root directory (for Android)

2. Check that the database exists and has the correct structure:
   ```bash
   # Install Firebase tools if needed
   npm install -g firebase-tools
   
   # Login to Firebase
   firebase login
   
   # List Firebase projects
   firebase projects:list
   
   # Get database data (requires proper permissions)
   firebase database:get /sensor
   ```

3. Ensure the config/firebase.js file has the correct configuration:
   ```javascript
   // Should match your Firebase project settings
   const firebaseConfig = {
     apiKey: "...",
     authDomain: "...",
     databaseURL: "https://study-room-availability-default-rtdb.firebaseio.com",
     projectId: "study-room-availability",
     storageBucket: "...",
     messagingSenderId: "...",
     appId: "..."
   };
   ```

4. Test a simple database query in a component:
   ```javascript
   import { database } from '../config/firebase';
   import { ref, get } from 'firebase/database';
   
   // In an async function
   try {
     const snapshot = await get(ref(database, 'sensor'));
     console.log('Database data:', snapshot.val());
   } catch (error) {
     console.error('Firebase error:', error);
   }
   ```

## Firebase Integration

The app connects to a Firebase Realtime Database to fetch study room availability status. The connection is configured in `config/firebase.js`.

The repository includes the iOS Firebase configuration file:
- `GoogleService-Info.plist` (for iOS)

For Android, you'll need to:
1. Log in to [Firebase Console](https://console.firebase.google.com/)
2. Select the project "Study Room Availability"
3. Click the gear icon (⚙️) next to "Project Overview" and select "Project settings"
4. In the "Your apps" section, click on the Android app
5. Click "Download google-services.json"
6. Place the downloaded file in the root directory of the project

These files contain the project-specific credentials needed to connect to the Firebase Realtime Database.

### Testing Firebase Connection

To verify that Firebase is correctly configured:

```bash
# Start the app with clear cache
npx expo start --clear
```

If you see data loading with room statuses, the connection is working properly.

### Database Structure
The app listens to the `/sensor` path in the database where:
- `status` field can be either "Occupied" or "Open"
- `distance` and `sound` fields contain sensor data measurements

### Using Your Own Firebase Project

If you want to use your own Firebase project:

1. Create a new project in Firebase Console:
   ```bash
   # Install Firebase CLI if you don't have it
   npm install -g firebase-tools
   
   # Login to Firebase (opens browser for authentication)
   firebase login
   
   # Navigate to your project directory
   cd roomable
   
   # Initialize a new project (follow the prompts)
   firebase init
   ```
   
   Note for Windows users: If you encounter permission issues, run Command Prompt or PowerShell as Administrator.

2. Set up a Realtime Database with the following structure:
   ```
   /sensor
     /room101
       status: "Open"
       distance: 150
       sound: 45
     /room102
       status: "Occupied"
       distance: 30
       sound: 75
     ...
   ```

3. Download your own configuration files:
   - For iOS: Download `GoogleService-Info.plist` and replace the existing file
   - For Android: Download `google-services.json` and place it in the root directory

4. Update the `firebaseConfig` object in `config/firebase.js` with your credentials:
   ```javascript
   // Open config/firebase.js in your code editor (VS Code recommended for Windows)
   // Replace the values in the firebaseConfig object with your project's values
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
     databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_PROJECT_ID.appspot.com",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```

## Project Structure

- `/app`: Main application code (using Expo Router for navigation)
  - `/index.tsx`: Home screen with floor listing
  - `/floor/[id].tsx`: Floor detail screen showing rooms on that floor
  - `/room/[id].tsx`: Room detail screen with amenities and status
- `/hooks`: Custom React hooks including Firebase data hooks
- `/config`: Configuration files including Firebase setup

Note for Windows users: File paths in the project use forward slashes (/) which is standard for React Native development, even on Windows.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## System Requirements

For optimal performance, we recommend:
- Windows 10 or 11 (64-bit)
- 8GB RAM minimum, 16GB recommended
- Intel i5/AMD Ryzen 5 or better
- 10GB free disk space for development tools and dependencies

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Expo](https://expo.dev)
- [React Native](https://reactnative.dev)
- [Firebase](https://firebase.google.com)
