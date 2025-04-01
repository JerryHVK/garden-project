#include <Wire.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <esp_wifi.h>
#include "DHT.h"

#define DHTPIN 4
#define DHTTYPE DHT22
#define DELAY_TIME 5000 //delay 5 second before publish data
#define GARDEN_ID 2 // fixed gardenId for the device

//  define the wifi and MQTT ip address
const char* ssid = "YOOTEK HOLDINGS";
const char* password = "yootek@123"; 
const char *mqtt_server = "broker.emqx.io";
const int mqtt_port = 1883;
const char *pub_topic = "device/data";
const char *sub_topic = "device/control";







char mac_address[100];

//  client for wifi connection
WiFiClient espClient;

//  client for mqtt connection
PubSubClient client(espClient);

DHT dht(DHTPIN, DHTTYPE);

float temp = 0.0, humid = 0.0;


// setup
void setup() {
  Serial.begin(9600);
  setupWifi();
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
  dht.begin();
}

// loop
void loop() {
  if(WiFi.status() != WL_CONNECTED) {
    setupWifi();
  }

  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  loopForData();

}

void loopForData(){
  delay(DELAY_TIME);

  float h = dht.readHumidity();
  float t = dht.readTemperature();

  if (isnan(h) || isnan(t)) {
    Serial.println(F("Failed to read from DHT sensor!"));
    return;
  }

  Serial.print(F("Humidity: "));
  Serial.print(h);
  Serial.print(F("%  Temperature: "));
  Serial.print(t);
  Serial.println(F("°C "));

  temp = t;
  humid = h;
  sendData();
}

void setupWifi() {
  WiFi.mode(WIFI_STA);
  delay(1000);
  //This line hides the viewing of ESP as wifi hotspot
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.println("Connecting to WiFi");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected successfully");
  Serial.print("connected to : "); Serial.println(ssid);
  Serial.print("IP address: "); Serial.println(WiFi.localIP());
}


void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");

    // Create a random client ID
    String clientId = "ESP32Client-";
    clientId += GARDEN_ID;

    if (client.connect(clientId.c_str())) {
      client.subscribe(sub_topic);
      Serial.print("connected, sub_topic: ");
      Serial.println(sub_topic);
    } else {
      Serial.println("failed, try again in 5 seconds");
      delay(5000);
    }
  }
}

void callback(char* topic, byte* payload, unsigned int length){
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i=0;i<length;i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();
}

void sendData(){
  JsonDocument doc;
  doc["gardenId"] = GARDEN_ID;
  doc["temperature"] = temp;
  doc["humidity"] = humid;
  char dataString[256];
  serializeJson(doc, dataString);
  client.publish(pub_topic, dataString);
  Serial.print("Published [");
  Serial.print(pub_topic);
  Serial.print("]: ");
  Serial.println(dataString);
}