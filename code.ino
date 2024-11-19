#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include <ESP32Servo.h>  
#include <addons/TokenHelper.h>
#include <ArduinoJson.h>
#include <time.h>

#define WIFI_SSID "AB"     
#define WIFI_PASSWORD "akashbera" 
#define FIREBASE_PROJECT_ID "dwp-5th-sem-project"
#define FIREBASE_DATABASE_ID "(default)"
#define API_KEY "AIzaSyDtB7SHnpIWOU0NSt_jiRe_OS9g6gp_LzE"
#define USER_EMAIL "abnew@gmail.com"
#define USER_PASSWORD "123456"

#define FLOW_SENSOR_PIN 15
#define SERVO_PIN 18 

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

volatile int pulseCount = 0;
float flowRate = 0.0;
float totalUsage = 0.0; 
unsigned long oldTime = 0;
Servo myServo; 

const char* ntpServer = "pool.ntp.org";
const long gmtOffset_sec = 0;
const int daylightOffset_sec = 0;

void IRAM_ATTR pulseCounter() {
  pulseCount++;
}


void reconnectWiFi() {
  Serial.print("Attempting to connect to WiFi...");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    WiFi.disconnect();
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    delay(5000);  
  }
  Serial.println("Connected to WiFi");
}

String getCurrentMonthName() {
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    Serial.println("Failed to obtain time");
    return "currentMonth";  
  }
  return "currentMonth";
}

void setup() {
  Serial.begin(115200);
  delay(1000); 

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("\nConnecting to Wi-Fi");
  reconnectWiFi(); 

  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    Serial.println("Failed to obtain time");
  }

  config.api_key = API_KEY;
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD; 
  config.token_status_callback = tokenStatusCallback;

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  pinMode(FLOW_SENSOR_PIN, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(FLOW_SENSOR_PIN), pulseCounter, FALLING);

  myServo.attach(SERVO_PIN);
  
  String currentMonth = getCurrentMonthName(); 
  String documentPathWaterflow = "users/" + String(USER_EMAIL) + "/" + currentMonth + "/waterflowSensor";

  if (Firebase.Firestore.getDocument(&fbdo, FIREBASE_PROJECT_ID, FIREBASE_DATABASE_ID, documentPathWaterflow)) {
    Serial.println("Fetched initial totalUsage from Firestore successfully.");
    StaticJsonDocument<1024> doc;
    DeserializationError error = deserializeJson(doc, fbdo.payload().c_str());

    if (!error) {
      JsonObject fields = doc["fields"];
      if (fields.containsKey("totalusages")) {
        totalUsage = fields["totalusages"]["doubleValue"].as<float>(); 
        Serial.print("Initial Total Usage: ");
        Serial.println(totalUsage);
      } else {
        Serial.println("Error: totalusages field not found.");
      }
    } else {
      Serial.print("Error: JSON deserialization failed: ");
      Serial.println(error.c_str());
    }
  } else {
    Serial.println("Error fetching Firestore document for totalUsage.");
    Serial.println(fbdo.errorReason());
  }

  String documentPathServo = "users/" + String(USER_EMAIL) + "/" + currentMonth + "/servoControl";

  if (Firebase.Firestore.getDocument(&fbdo, FIREBASE_PROJECT_ID, FIREBASE_DATABASE_ID, documentPathServo)) {
    Serial.println("Fetched initial servoState from Firestore successfully.");
    StaticJsonDocument<1024> doc;
    DeserializationError error = deserializeJson(doc, fbdo.payload().c_str());

    if (!error) {
      JsonObject fields = doc["fields"];
      if (fields.containsKey("servoState")) {
        bool servoState = fields["servoState"]["booleanValue"].as<bool>(); 
        Serial.print("Initial Servo State: ");
        Serial.println(servoState);
        myServo.write(servoState ? 0 : 90);  
      } else {
        Serial.println("Error: servoState field not found.");
      }
    } else {
      Serial.print("Error: JSON deserialization failed: ");
      Serial.println(error.c_str());
    }
  } else {
    Serial.println("Error fetching Firestore document for servoState.");
    Serial.println(fbdo.errorReason());
  }

  Serial.println("Setup complete");
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    reconnectWiFi();  
  }

  if ((millis() - oldTime) > 1000) {
    detachInterrupt(digitalPinToInterrupt(FLOW_SENSOR_PIN));

    flowRate = ((1000.0 / (millis() - oldTime)) * pulseCount) / 7.5;
    oldTime = millis();
    pulseCount = 0;

    totalUsage += flowRate;

    String currentMonth = getCurrentMonthName(); 

    String documentPathWaterflow = "users/" + String(USER_EMAIL) + "/" + currentMonth + "/waterflowSensor";
    String documentPathServo = "users/" + String(USER_EMAIL) + "/" + currentMonth + "/servoControl";

    FirebaseJson contentWaterflow;
    contentWaterflow.set("fields/totalusages/doubleValue", totalUsage);

    if (Firebase.Firestore.patchDocument(&fbdo, FIREBASE_PROJECT_ID, FIREBASE_DATABASE_ID, documentPathWaterflow, contentWaterflow.raw(), "", "", "")) {
      Serial.println("Water flow data sent to Firestore successfully");
      Serial.print("Flow Rate: ");
      Serial.println(flowRate);
      Serial.print("Total Usage: ");
      Serial.println(totalUsage);
    } else {
      Serial.println("Failed to send water flow data to Firestore");
      Serial.println(fbdo.errorReason());
    }

    if (Firebase.Firestore.getDocument(&fbdo, FIREBASE_PROJECT_ID, FIREBASE_DATABASE_ID, documentPathServo)) {
      Serial.println("Fetched Firestore document successfully.");
      StaticJsonDocument<1024> doc;
      DeserializationError error = deserializeJson(doc, fbdo.payload().c_str());

      if (!error) {
        JsonObject fields = doc["fields"];
        if (fields.containsKey("servoState")) {
          bool servoState = fields["servoState"]["booleanValue"].as<bool>();
          Serial.print("Servo State: ");
          Serial.println(servoState);

          myServo.write(servoState ? 0 : 90); 
          Serial.println(servoState ? "Servo moved to 90 degrees." : "Servo moved to 0 degrees.");
        } else {
          Serial.println("Error: servoState field not found.");
        }
      } else {
        Serial.print("Error: JSON deserialization failed: ");
        Serial.println(error.c_str());
      }
    } else {
      Serial.println("Error fetching Firestore document.");
      Serial.println(fbdo.errorReason());
    }

    attachInterrupt(digitalPinToInterrupt(FLOW_SENSOR_PIN), pulseCounter, FALLING);
  }

  delay(1000);
}
