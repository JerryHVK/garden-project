#include <Wire.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <esp_wifi.h>
#include "DHT.h"

#define DHTPIN 4
#define DHTTYPE DHT22
#define DELAY_TIME 5000 //5 seconds

//  define the wifi and MQTT ip address
const char* ssid = "YOOTEK HOLDINGS";
const char* password = "yootek@123"; 
const char *mqtt_server = "broker.emqx.io";
const int mqtt_port = 1883;
const char *pub_topic = "device/data/sub";







char mac_address[100];

//  client for wifi connection
WiFiClient espClient;

//  client for mqtt connection
PubSubClient client(espClient);

DHT dht(DHTPIN, DHTTYPE);

float temp = 0.0, humid = 0.0;


// setup
void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  
  //  setup wifi
  setupWifi();
 
  //  mqtt client connect to mqtt broker
  client.setServer(mqtt_server, mqtt_port);

  dht.begin();
}

// loop
void loop() {
  // put your main code here, to run repeatedly:

  //  check wifi connection at each loop
  if(WiFi.status() != WL_CONNECTED) {
    setupWifi();
  }

  //  check the mqtt connection at each loop
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  loopForData();

}

void loopForData(){
  // Wait a few seconds between measurements.
  delay(DELAY_TIME);

  // Reading temperature or humidity takes about 250 milliseconds!
  // Sensor readings may also be up to 2 seconds 'old' (its a very slow sensor)
  float h = dht.readHumidity();
  // Read temperature as Celsius (the default)
  float t = dht.readTemperature();

  // Check if any reads failed and exit early (to try again).
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

//  this "setup_wifi()" function is the code example from "Wifi.h" library
void setupWifi() {
  WiFi.mode(WIFI_STA);
  delay(1000);
  //This line hides the viewing of ESP as wifi hotspot
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.println("Connecting to WiFi");
  readMacAddress();
  Serial.println(mac_address);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected successfully");
  Serial.print("connected to : "); Serial.println(ssid);
  Serial.print("IP address: "); Serial.println(WiFi.localIP());
}


//  this "reconnect()" functions is from the example of "PubSubClient" library
void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");

    // Create a random client ID
    String clientId = "ESP32Client-";
    clientId += String(random(0xffff), HEX);
    // Attempt to connect
    if (client.connect(clientId.c_str())) {
      Serial.println("connected");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}


void sendData(){
  JsonDocument doc;
  doc["deviceNumber"] = mac_address;
  doc["temperature"] = temp;
  doc["humidity"] = humid;
  char dataString[256];
  serializeJson(doc, dataString);
  client.publish(pub_topic, dataString);
}

void readMacAddress(){
  uint8_t baseMac[6];
  esp_err_t ret = esp_wifi_get_mac(WIFI_IF_STA, baseMac);
  if (ret == ESP_OK) {
    sprintf(mac_address,"%02x:%02x:%02x:%02x:%02x:%02x",
                  baseMac[0], baseMac[1], baseMac[2],
                  baseMac[3], baseMac[4], baseMac[5]);
  } else {
    Serial.println("Failed to read MAC address");
  }
}