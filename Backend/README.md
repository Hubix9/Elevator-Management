# Backend documentation

This document contains the documentation reffering to the backend portion of the application.

## Table of contents

* [environment setup](#environment-setup)
* [module information](#module-information)
* [module configuraton](#module-configuration)

# Environment setup
In order to setup the enviroment execute the following command:
```
npm install --include=dev
```
The backend portion of the application should now be ready for project bundling.

**Note**: project was tested with nodejs v16.13.2

# Module information

The backend portion of the application is built usign express framework, babel transpiler and jest testing framework.

The backend consists of the following core modules:
* elevator.js
* elevatorManager.js
* applicationServer.js

and some smaller helper modules located in src/utlity directory.

## Elevator class
The Elevator class contained in elevator.js module is responsible for representing a single elevator, it stores the following information:
* lowestFloor - the lowest floor the elevator can move to
* highestFloor - the highest floor the elevator can move to
* numberOfFloors - currently unused, stores the number of floors the elevator supports
* currentFloor - the floor at which elevator is currently located
* targetFloorQueue - an array containing the floors to which elevator is scheduled to transition

Elevator class supports the following methods:

* schedule(targetFloor) - allows for scheduling a transition to a specified floor
* scheduleWithOffset(targetFloor, offset) - schedules a transition to a specified floor with offset specifying where the scheduled floor should be placed on the target floor queue
* unschedule(targetFloor) - removes the specified floor from target floor queue
* status() - retrieves information about current elevator's state, the information includes: elevator id, current elevator floor, and current target floor, if there is no current target floor it will be of null value
* simulationStep() - performs a step of elevator simulation, the elevator will move one floor per step
* handleElevator() - method used to handle elevator data when the application is used without simulation mode, the method works in conjunction with update method
* update(currentFloor) - method allowing for update of current elevator floor, it's meant to receive data from the elevator device itself reporting it's current position in order to obtain relevant scheduling information
* scheduledFloors() - returns the target floor queue of the elevator

## ElevatorManager class
The ElevatorManager class contained in elevatorManager.js module is responsible for containg multiple elevators and serving as an interface to manage them, it stores the following information:
* elevators - an array containing refernces to Elevator class instances

The methods used in ElevatorManager use the same scheme as the ones in Elevator class, with the excpetion of an additional parameter in each of the methods being the id parameter containing an id of elevator on which we would like to perform an operation. The following section will list methods exclusive to ElevatorManager class

* add(elevator) - allows for adding an instance of Elevator class to the elevators variable of ElevatorManager
* remove(id) - allows for removing an elevator with the specified id from ElevatorManager
* getElevator(id) - an internal method used for obtaining an Elevator class reference from the supplied elevator id
* addFromConfig(config) - method creating Elevator class instances based on the provided config object

## AppWrapper class
The AppWrapper class contained in applicationServer.js module is responsible for creating the express application instance and handling server lifecycle.

It's responsible for creating all objects required for the server to work correctly, handling requests and validating their parameters and executing ElevatorManager's elevator handling methods like simulationStep and handleElevators.

AppWrapper class stores the following information:
* listening - whether the server is listening for connections or not
* app - express application class instance
* elevatorManager - ElevatorManager class instance
* port - the port at which the server should listen for connections

The AppWrapper supports the following Http requests:

**GET requests**

* / - returns the html file containg frontend portion of the application
* /status?id=0 - retrieves the current status of an elevator with the supplied id containg: elevator id, current floor, and current target floor
* /scheduledFloors?id=0 - obtains the target floor queue for the elevator with specified id
* /config - obtains elevator config from the server

**POST requests**

All POST requests require request data in JSON format

* /schedule - schedules a floor transition to supplied targetFloor for elevator with the supplied id, example request data: {id: 0, targetFloor: 5}
* /scheduleWithOffset - schedules a floor transition to supplied targetFloor for elevator with the supplied id respecting the provided offset based on which the floor will be placed in the target floor queue, example request data: {id: 0, targetFloor: 5, offset: 0}
* /unschedule - unschedules transitino to the targetFloor for the elevator with specified id, example request data: {id: 0, targetFloor: 5}
* /update - updates current floor for the elevator with the specified id, example request data: {id: 0, currentFloor: 5}


AppWrapper class supports the following methods:
* listen(callback) - starts server listener on the port specified in class's port member variable, executes callback function if it's defined after starting the server
* close(callback) - closes the server, executes callback function if it's defined after closing the server
* handlingMiddleware(req, res, next) - internal method used as express middleware, it's responsible for executing elevator handling functions of ElevatorManager
* startSimulation() - starts elevator simulation
* stopSimulation() - stops elevator simulation

Floor scheduling is handled using first come, first serve method.


# Module configuration

The configuration files are stored in the config directory.
Two JSON files are used to configure the server:
* elevatorConfig.json
* serverConfig.json

The elevatorConfig.json stores information about the elevators managed by the application.
The configuration is structured in the following way:
```
{
	"elevators" : [
		{
			"id": 0,
			"lowestFloor": -1,
			"highestFloor": 7
		},
		{
			"id": 1,
			"lowestFloor": -3,
			"highestFloor": 6
		},
		{
			"id": 2,
			"lowestFloor": 0,
			"highestFloor": 5
		},
		{
			"id": 3,
			"lowestFloor": 4,
			"highestFloor": 8
		},
		{
			"id": 4,
			"lowestFloor": -3,
			"highestFloor": 8
		}
	]
}
```

**Note**: Elevator id's must be unique, also the lowest floor cannot be higher than the highest floor.

The serverConfig.json stores information related to the general server configuration.

The configuration is structured in the following way:

```
{
	"port" : 3000
}
```

Currently the only server parameter is the port parameter.


The server also supports a single command line parameter which is:
```
--no-simulation 
```
it's used to disable elevator simulation.