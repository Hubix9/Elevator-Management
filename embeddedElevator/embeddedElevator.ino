#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <Arduino_JSON.h>
#include "credentials.h"

#define NULLFLOOR -255 // serves as lack of target floor

const char *wifi_ssid = WIFI_SSID;
const char *wifi_password = WIFI_PASS;

String updateEndpoint = "http://serveraddress:serverport/update";
String statusEndpoint = "http://serveraddress:serverport/status";
String scheduleEndpoint = "http://serveraddress:serverport/schedule";

const int elevatorId = 7;

int sensorPin = A0;
int analogValue = 0;

long lastUpdateTime = 0;
long updateDelay = 1000; // time in milliseconds after which another update should be sent
long lastSimulationTime = 0;
long simulationDelay = 2000; // time in milliseconds after which another simulation step

int floorPins[] = {5, 4, 0, 12, 14};
int currentFloor = 0;
int targetFloor = NULLFLOOR;

int highestFloor = 4;
int lowestFloor = 0;

void sendPost(String endpoint, JSONVar payload)
{
  WiFiClient wifiClient;
  HTTPClient httpClient;
  httpClient.begin(wifiClient, endpoint);
  httpClient.addHeader("Content-Type", "application/json");
  String payloadString = JSON.stringify(payload);
  const char *payloadChar = payloadString.c_str();
  int responseCode = httpClient.POST(payloadChar);
  httpClient.end();
}

String sendGet(String endpoint, String query)
{
  String joinedEndpoint = endpoint + query;
  WiFiClient wifiClient;
  HTTPClient httpClient;
  httpClient.begin(wifiClient, joinedEndpoint);
  int responseCode = httpClient.GET();
  String response = httpClient.getString();
  httpClient.end();
  return response;
}

void performUpdate()
{
  JSONVar payload;
  payload["id"] = elevatorId;
  payload["currentFloor"] = currentFloor;
  sendPost(updateEndpoint, payload);
  String query = "?id=" + String(elevatorId);
  String response = sendGet(statusEndpoint, query);
  JSONVar responseJson = JSON.parse(response);
  if (JSON.typeof(responseJson) == "undefined")
  {
    return;
  }

  const char *targetFloorString = (const char *)responseJson["targetFloor"];
  if (responseJson["targetFloor"] == null)
  {
    targetFloor = NULLFLOOR;
    return;
  }
  targetFloor = (int)responseJson["targetFloor"];
}

void scheduleFloor(int floor)
{
  JSONVar payload;
  payload["id"] = elevatorId;
  payload["targetFloor"] = floor;
  sendPost(scheduleEndpoint, payload);
}

void performSimulation()
{
  if (targetFloor == NULLFLOOR)
  {
    return;
  }
  if (currentFloor > targetFloor)
  {
    currentFloor -= 1;
  }
  else if (currentFloor < targetFloor)
  {
    currentFloor += 1;
  }
  else
  {
    targetFloor = NULLFLOOR;
  }
}

void setup()
{
  digitalWrite(2, LOW); // Disable on-board led
  for (int i = 0; i < 5; i++)
  {
    pinMode(floorPins[i], OUTPUT);
  }
  WiFi.begin(wifi_ssid, wifi_password);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
  }
}

void loop()
{
  analogValue = analogRead(sensorPin);

  if (analogValue > 1020)
  {
    scheduleFloor(4);
  }
  else if (analogValue > 540)
  {
    scheduleFloor(3);
  }
  else if (analogValue > 340)
  {
    scheduleFloor(2);
  }
  else if (analogValue > 250)
  {
    scheduleFloor(1);
  }
  else if (analogValue > 150)
  {
    scheduleFloor(0);
  }

  if (millis() > (lastSimulationTime + simulationDelay))
  {
    performSimulation();
    lastSimulationTime = millis();
  }

  if (millis() > (lastUpdateTime + updateDelay))
  {
    performUpdate();
    lastUpdateTime = millis();
  }

  for (int i = 0; i < 5; i++)
  {
    digitalWrite(floorPins[i], LOW);
  }
  digitalWrite(floorPins[currentFloor], HIGH);
}
