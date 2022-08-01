# Elevator management project

This project is a basic implementation of an elevator management system. The project allows for real time monitoring and control of multiple elevators.

The project consits of two main components:
* Backend
* Frontend

The project also features a basic hardware solution located in the "embeddedElevator" directory, serving as a demonstration of elevator interfacing with the backend server.

Each of the components have appropriate README files situated in their respective directories, containing the documentation of each component.

## Features

* elevator simulation
* floor scheduling
* floor unscheduling
* floor scheduling with custom priority (offset in the queue)
* obtaining elevator status
* connecting embedded solutions with the backend server


# Installation

In order to prepare the development environment you will need to follow the instructions available in Frontend/README.md and Backend/README.md files.

After installing both Frontend and Backend components you will need to execute either the bundle.bat or bundle.sh shell scripts which will produce Bundle directory.

Head to the Bundle directory and execute the following command:

For Windows
```
node dist\main.js
```

For Unix based systems
```
node dist/main.js
```


## Docker images

The application features also two docker images:
* regular
* rootless

The rootless container executes the server process as a user with uid 2500 and gid 2500. in order to minimise the server attack vector.

**Note**: rootless container requires specific permissions letting uid 2500 access the config directory in the mounted volume.

The regular dockerfile and it's docker-compose file can be found in the docker directory.

to run the regular container without docker-compose execute the following command:
```
sudo docker run --name mycontainer --publish 3000:3000/tcp --volume $(pwd)/Backend/config:/elevatorserver/config elevator-management
```

The rootless dockerfile and it's docker-compose file can be found in the dockerRootless directory.

to run the rootless container without docker-compose execute the following command:
```
sudo docker run --name mycontainer --publish 3000:3000/tcp --volume $(pwd)/Backend/config:/home/elevatorserver/config elevator-management-rootless
```

### Dockerhub
Both docker images are available at dockerhub:
* regular - https://hub.docker.com/repository/docker/hubix9/elevator-management
* rootless - https://hub.docker.com/repository/docker/hubix9/elevator-management-rootless

# Disclaimer
This project is not meant for the production purposes.