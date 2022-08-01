# Embedded elevator documentation

This document contains the documentation reffering to the embedded elevator portion of the application.
The goal of this portion of project is to simulate hardware of an elevator in order to test non simulation capabilities of the application backend.


## Requirements

* ESP8266 compatible board (nodemcu v3 for example)
* Arduino_JSON library
* Arduino ESP8266 community core
* 5 led diodes
* 5 tact switches
* 10 4.7k ohm resistors

**Note**: the code was prepared for nodemcu v3 board, different boards might require changes to the code in order to work correctly.

**Note**: you will need to create a credentials.h file:
```
#define WIFI_SSID "MyNetworkSsid"
#define WIFI_PASS "MyNetworkPassword"
```
in order to allow the mcu to connect to your wifi network.

**Note**: you will need to adjust the http endpoints in the code, to allow mcu to reach your server.

# Project operation
The project consists of 5 led diodes representing 5 floors of an elevator and 5 switches which are used to schedule elevator transitions to the according floors

When a switch is pressed, the mcu sends a POST request to the backend server /schedule endpoint with it's own id and targetFloor.

Every second the mcu sends a POST request to the /update endpoint with it's id and currentFloor in order to inform server of it's current position, then it sends a GET request to the server's /status endpoint with it's own id, in order to obtain the target floor that it should transition to.

When target floor value is different than null. The elevator transitions to the target floor. Elevator's simulation interval is 2 seconds, thus it will move one floor every 2 seconds.


# Schematic

The electronic circuit schematic is available in the **schematic.pdf** file

# Device screenshot

![An image showing a small electronic circuit with a microcontroller](/embeddedElevator/media/hardware_screenshot_1.png?raw=true)


# Device demonstration

The demonstration video is available here: https://www.youtube.com/watch?v=Y4vMbhtfFLc