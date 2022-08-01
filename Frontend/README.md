# Frontend documentation

This document contains the documentation reffering to the frontend portion of the application.

## Table of contents

* [environment setup](#environment-setup)
* [interface usage](#interface-usage)
* [interface screenshots](#interface-screenshots)
* [module information](#module-information)


# Environment setup

In order to setup the enviroment execute the following command:
```
npm install --include=dev
```
The frontend portion of the application should now be ready for project bundling.

# Interface usage

The application interface consits of two sections: elevator display and control panel.

The elevator display is responsible for showing current elevator state to the user and allowing selection of an elevator for further control in the control panel.

Elevator display makes use of three colors to display the state of elevators:
* white - floor is not scheduled and elevator is currently not present on this floor
* green - elevator is currently present on this floor
* yellow - elevator is currently in transition to this floor
* orange - the floor is scheduled for transition but currently is not the target floor for elevator's transition

The control panel is responsible for selecting appropriate values and sending requests to the backend server. The control panel allows for: selecting, scheduling, scheduling with offset and unscheduling of floors.
It will also display the id number of currently selected elevator.

In order for the control panel to appear, an elevator **must** be first selected in the elevator display section.

# Interface screenshots

All elevators are stationary:

![An image showing the interface without any elevator in transit](/Frontend/media/screenshot_1.png?raw=true)

Elevator with id:1 is currently moving to floor 6, while floors 0 and -3 are scheduled for later transition:

![An image showing the interface with one elevator in transit with multiple scheduled floors](/Frontend/media/screenshot_2.png?raw=true)

# Module information

The frontend portion of the application is built usign svelte framework and vite build system.

The application uses http requests in order to interact with the backend server.
First the application obtains the configuration of elevators in order to present them approporiately in the interface. Then, every second the application sends /status and /scheduledFloors GET requests in order to obtain current elevator information and present it to the user.

When user performs an operation, for example they schedule a floor for the elevator to transition to, the application sends a post request with the id number of the selected elevator and the target floor to which the elevator should transition.

If request results in an error, the application will present the received error message to the user via web browser alert window.


## Credits
* The elevator icon was obtained from the following website: https://www.svgrepo.com/svg/17007/elevator