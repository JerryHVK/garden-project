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
}

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


// SETUP WIFI
void setupWifi() {
  // WiFi.mode(WIFI_STA);
  // delay(1000);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.print("Connecting to wifi");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
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
      delay(5000);
    }
  }
}



///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
// HANDLE PUBLISHING DATA
void loopForData(){
  delay(DELAY_TIME);
  float h = dht.readHumidity();
  float t = dht.readTemperature();

  if (isnan(h) || isnan(t)) {
    return;
  }
  temp = t;
  humid = h;
  sendData();
}

void sendData(){
  JsonDocument doc;
  doc["gardenId"] = GARDEN_ID;
  doc["temperature"] = temp;
  doc["humidity"] = humid;
  char dataString[256];
  serializeJson(doc, dataString);
  client.publish(pub_topic, dataString);
  Serial.println("Published data!");
}


///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
// HANDLE SUBSCRIBED TOPIC
void callback(char* topic, byte* payload, unsigned int length){
  Serial.println("Received message!");
  String message = "";
  for (int i=0;i<length;i++) {
    message += (char)payload[i];
  }

  JsonDocument doc;
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
