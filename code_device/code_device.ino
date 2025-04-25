#include <Wire.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include "DHT.h"

#define DHTPIN 4 // PIN FOR SENSOR DATA
#define DHTTYPE DHT22 // SENSOR TYPE
#define DELAY_TIME 5000 //delay 5 second before publish data
#define GARDEN_ID 2 // fixed gardenId for the device


// PINS FOR LEDS
#define RED_LED 27
#define YELLOW_LED 26
#define GREEN_LED 25

//  define the wifi and MQTT ip address
const char* ssid = "YOOTEK HOLDINGS";
const char* password = "yootek@123"; 
const char *mqtt_server = "broker.emqx.io";
const int mqtt_port = 1883;

const char *pub_topic;
const char *sub_topic;
String pubTopic = "";
String subTopic = "";

// wifi client
WiFiClient espClient;

//  client for mqtt connection (need wifi connection first)
PubSubClient client(espClient);

DHT dht(DHTPIN, DHTTYPE); // for temp and humid sensor

float temp = 0.0, humid = 0.0; //Declare variables for published data



void setup() {
  Serial.begin(9600);
  delay(2000);
  Serial.println();

  pubTopic += "device/";
  pubTopic += GARDEN_ID;
  pubTopic += "/data";

  subTopic += "device/";
  subTopic += GARDEN_ID;
  subTopic += "/control";

  pub_topic = pubTopic.c_str();
  sub_topic = subTopic.c_str();

  setupWifi();
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
  dht.begin();
  delay(5000);

  pinMode(RED_LED, OUTPUT);
  pinMode(YELLOW_LED, OUTPUT);
  pinMode(GREEN_LED, OUTPUT);

  xTaskCreate(
    handleWifiMqttConnection,    // Function that should be called
    "handle wifi and mqtt connection",   // Name of the task (for debugging)
    4096,            // Stack size (bytes) -> need to be big enough
    NULL,            // Parameter to pass
    1,               // Task priority
    NULL             // Task handle
  );
  
  xTaskCreate(
    handleSensorData,    // Function that should be called
    "handle sensor data",   // Name of the task (for debugging)
    4096,            // Stack size (bytes)
    NULL,            // Parameter to pass
    1,               // Task priority
    NULL             // Task handle
  );

  xTaskCreate(
    handleSubscribedTopic,    // Function that should be called
    "handle subscribed topic",   // Name of the task (for debugging)
    4096,            // Stack size (bytes)
    NULL,            // Parameter to pass
    1,               // Task priority
    NULL             // Task handle
  );

}


///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
// HANDLE WIFI AND MQTT CONNECTION
void handleWifiMqttConnection(void * parameter){
  // you have to put the process in a while loop, so the task will run forever
  while(true){
    if(WiFi.status() != WL_CONNECTED)   setupWifi();

    if (!client.connected())    reconnect();

    // delay the task is important, if not, it makes the cpu run much more than necessary
    vTaskDelay(5000 / portTICK_PERIOD_MS);
  }
}


// SETUP WIFI
void setupWifi() {
  WiFi.mode(WIFI_STA);
  vTaskDelay(1000 / portTICK_PERIOD_MS);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.print("Connecting to wifi");

  while (WiFi.status() != WL_CONNECTED) {
    vTaskDelay(500 / portTICK_PERIOD_MS);
    Serial.print(".");
  }
  Serial.println();
  Serial.println("Connected to wifi successfully!");
}


// RECONNECT MQTT SERVER
void reconnect() {
  while (!client.connected()) {
    // Create a random client ID
    String clientId = "ESP32Client-";
    clientId += GARDEN_ID;

    if (client.connect(clientId.c_str())) {
      Serial.println("Reconnected to MQTT server successfully!");
      client.subscribe(sub_topic);
    } else {
      Serial.println("Trying to reconnect to MQTT server...");
      vTaskDelay(5000 / portTICK_PERIOD_MS);
    }
  }
}



///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
// HANDLE SENSOR DATA
void handleSensorData(void * parameter){
  while(true){
    if(WiFi.status() == WL_CONNECTED && client.connected()){
      vTaskDelay(DELAY_TIME / portTICK_PERIOD_MS);
      float h = dht.readHumidity();
      float t = dht.readTemperature();

      if (isnan(h) || isnan(t)) {
        Serial.println("Cannot read the data from sensor...");
        continue;
      }
      temp = t;
      humid = h;

      // StaticJsonDocument is safer then JsonDocument for small memory like microcontroller
      StaticJsonDocument<256> doc;
      doc["gardenId"] = GARDEN_ID;
      doc["temperature"] = temp;
      doc["humidity"] = humid;
      char dataString[256];
      serializeJson(doc, dataString);
      client.publish(pub_topic, dataString);
      Serial.println("Published data!");
    }
    else{
      vTaskDelay(5000 / portTICK_PERIOD_MS); // delay if the conditions are not satisfied, to make space for cpu
    }
  }
}


///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
// HANDLE SUBSCRIBED TOPIC
void handleSubscribedTopic(void * parameter){
  while(true){
    if(WiFi.status() == WL_CONNECTED && client.connected()){
      client.loop();
    }else{
      vTaskDelay(5000 / portTICK_PERIOD_MS);
    }
  }
}

void callback(char* topic, byte* payload, unsigned int length){
  Serial.println("Received message!");
  String message = "";
  for (int i=0;i<length;i++) {
    message += (char)payload[i];
  }

  // StaticJsonDocument is safer then JsonDocument for small memory like microcontroller
  StaticJsonDocument<256> doc;
  deserializeJson(doc, message);
  String redOn = (String)doc["data"]["redOn"];
  String yellowOn = (String)doc["data"]["yellowOn"];
  String greenOn = (String)doc["data"]["greenOn"];
  changeState(RED_LED, redOn);
  changeState(YELLOW_LED, yellowOn);
  changeState(GREEN_LED, greenOn);
}

void changeState(int pin, String state){
  if(state == "false"){
    digitalWrite(pin, LOW);
  }
  else if(state == "true"){
    digitalWrite(pin, HIGH);
  }
}

void loop() {
  // put your main code here, to run repeatedly:
}
