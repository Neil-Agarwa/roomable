#include <ESP8266WiFi.h>
#include <FirebaseESP8266.h>

// Wi-Fi Credentials
#define WIFI_SSID "utexas-iot"
#define WIFI_PASSWORD "38623707542403806899"  // Use PSK (no spaces)

// Firebase Credentials
#define FIREBASE_HOST "study-room-availability-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "KLiwsDuo9gV2kuy54g5GmfUpOlmw9mXviR1m9JMc"

FirebaseData firebaseData;
FirebaseConfig config;
FirebaseAuth auth;

void setup() {
  Serial.begin(115200);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected to UT Austin IoT Wi-Fi!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());

  // Firebase setup
  config.host = FIREBASE_HOST;
  config.signer.tokens.legacy_token = FIREBASE_AUTH;
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  if (Firebase.ready()) {
    Serial.println("Firebase connected!");
  } else {
    Serial.println("Failed to connect to Firebase.");
  }
}

void loop() {
  if (Serial.available()) {
    String dataStr = Serial.readStringUntil('\n');
    int firstComma = dataStr.indexOf(',');
    int secondComma = dataStr.indexOf(',', firstComma + 1);

    if (firstComma != -1 && secondComma != -1) {
      float distance = dataStr.substring(0, firstComma).toFloat();
      float dB = dataStr.substring(firstComma + 1, secondComma).toFloat();
      String occupancy = dataStr.substring(secondComma + 1);
      occupancy.trim(); // Remove any extra spaces or newlines

      Serial.print("Received -> Distance: "); Serial.print(distance); Serial.print(" cm, ");
      Serial.print("Sound Level: "); Serial.print(dB); Serial.print(" dB, ");
      Serial.print("Status: "); Serial.println(occupancy);

      // Send data to Firebase
      Firebase.setFloat(firebaseData, "sensor/distance", distance);
      Firebase.setFloat(firebaseData, "sensor/sound", dB);
      Firebase.setString(firebaseData, "sensor/status", occupancy);  // Now sends "Occupied" or "Open"!
      
      Serial.println("Data sent to Firebase!");
    }
  }
  delay(100);
}
