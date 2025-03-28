#include <SoftwareSerial.h>

// Define the SoftwareSerial pins for ESP8266
SoftwareSerial espSerial(2, 3); // (RX, TX) -> Connect ESP8266 TX to Pin 2, RX to Pin 3

// Define sensor pins
const int trigPin = 9;          // Trigger pin for ultrasonic sensor
const int echoPin = 10;         // Echo pin for ultrasonic sensor
const int soundSensorPin = A0;  // Analog pin for sound sensor

// Variables
float soundThreshold = 30;      // Threshold for detecting sound (in dB)

void setup() {
  Serial.begin(115200);         // Debugging on Serial Monitor
  espSerial.begin(115200);      // Communication with ESP8266

  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
}

void loop() {
  float distance = readDistance();
  int soundLevel = analogRead(soundSensorPin);

  // Convert the raw analog value to voltage
  float voltage = soundLevel * (5.0 / 1023.0);  // Convert analog value to voltage

  // Calculate dB level
  float dBLevel = 20 * log10(voltage / 0.005);  // Calculate dB level (0.005V is the reference voltage for 0 dB)

  // Determine room status based on distance and sound level
  String roomStatus = (distance < 50 || dBLevel > soundThreshold) ? "Occupied" : "Open";

  // Print to Serial Monitor
  Serial.print("Distance: "); Serial.print(distance); Serial.print(" cm, ");
  Serial.print("Sound Level: "); Serial.print(dBLevel); Serial.print(" dB, ");
  Serial.print("Room Status: "); Serial.println(roomStatus);

  // Send data to ESP8266 in CSV format
  espSerial.print(distance); 
  espSerial.print(","); 
  espSerial.print(dBLevel); 
  espSerial.print(","); 
  espSerial.println(roomStatus);

  delay(1000); // Send data every 5 seconds
}

// Function to measure distance using the ultrasonic sensor
float readDistance() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  long duration = pulseIn(echoPin, HIGH);
  float distance = duration * 0.034 / 2; // Convert to cm

  return distance;
}