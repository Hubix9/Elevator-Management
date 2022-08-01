import {Elevator, ElevatorError} from "../elevator/elevator.js"
import {ElevatorManager} from "../elevator/elevatorManager.js"

import elevatorConfig from "../../config/elevatorConfig.json"

test("Adding a single elevator to the manager", () => {
	let manager = new ElevatorManager()
	let elevator = new Elevator(0, 0, 5)
	manager.add(elevator)
	expect(manager.elevators).toStrictEqual([elevator])
})

test("Add single elevator multiple times", () => {
	let manager = new ElevatorManager()
	let elevator = new Elevator(0, 0, 5)
	manager.add(elevator)
	expect(() => manager.add(elevator)).toThrow(ElevatorError)
})

test("Remove a non existant elevator from manager", () => {
	let manager = new ElevatorManager()
	expect(() => manager.remove(0)).toThrow(ElevatorError)
})

test("Remove an existing elevator from manager", () => {
	let manager = new ElevatorManager()
	let elevator = new Elevator(0, 0, 5)
	manager.add(elevator)
	manager.remove(0)	
	expect(manager.elevators).toStrictEqual([])
})

test("Adding a mulitple elevators to the manager", () => {
	let manager = new ElevatorManager()
	let tempArr = []
	for (let i = 0; i < 5; i++) {
		let elevator = new Elevator(i, 0, 5)
		manager.add(elevator)
		tempArr.push(elevator)
	}	
	expect(manager.elevators).toStrictEqual(tempArr)
})

test("Schedule a transition for single elevator", () => {
	let manager =  new ElevatorManager()
	let elevator = new Elevator(0, 0, 5)
	manager.add(elevator)
	manager.schedule(0, 5)
	expect(manager.elevators[0].targetFloorQueue[0]).toBe(5)
})

test("Schedule a transition for non existant elevator",() => {
	let manager =  new ElevatorManager()
	expect(() => manager.schedule(0, 5)).toThrow(ElevatorError)
})

test("Unschedule a transition for non existant elevator",() => {
	let manager =  new ElevatorManager()
	expect(() => manager.unschedule(0, 5)).toThrow(ElevatorError)
})

test("unschedule a transition for an existing elevator",() => {
	let manager =  new ElevatorManager()
	let elevator = new Elevator(0, 0, 5)
	manager.add(elevator)
	manager.schedule(0, 5)
	manager.unschedule(0, 5)
	expect(manager.elevators[0].targetFloorQueue).toStrictEqual([])	
})

test("Simulate single elevator", () => {
	let manager =  new ElevatorManager()
	let elevator = new Elevator(0, 0, 5)
	manager.add(elevator)
	manager.schedule(0, 5)	
	for (let i = 0; i < 5; i++) manager.simulationStep()
	expect(manager.elevators[0].currentFloor).toBe(5)	
})

test("Simulate multiple elevators", () => {
	let manager =  new ElevatorManager()
	for (let i = 0; i < 5; i++) {
		let elevator = new Elevator(i, 0, 5)
		manager.add(elevator)
		manager.schedule(i, 5)
	}	
	for (let i = 0; i < 5; i++) manager.simulationStep()
	for (let i = 0; i < 5; i++) expect(manager.elevators[i].currentFloor).toBe(5)		
})

test("Simulate multiple elevators with randomized parameters", () => {
	let manager =  new ElevatorManager()
	for (let i = 0; i < 5; i++) {
		let lowestFloor = Math.floor(Math.random() * 3)
		let highestFloor = Math.floor(Math.random() * 10 + 4)
		let elevator = new Elevator(i, lowestFloor, highestFloor)
		manager.add(elevator)
		manager.schedule(i, highestFloor)
	}	
	for (let i = 0; i < 20; i++) manager.simulationStep()
	for (let elevator of manager.elevators)	{
		expect(elevator.currentFloor).toBe(elevator.highestFloor)
	}
})

test("Update position of an existing elevator", () => {
	let manager =  new ElevatorManager()
	let elevator = new Elevator(0, 0, 5)
	manager.add(elevator)
	manager.update(0, 3)
	expect(manager.elevators[0].currentFloor).toBe(3)
})

test("Update position of non existant elevator", () => {
	let manager = new ElevatorManager()
	expect(() => manager.update(0, 3)).toThrow(ElevatorError)	
})

test("Add elevator's from configuration file", () => {
	let manager = new ElevatorManager()
	manager.addFromConfig(elevatorConfig)
	for (let i = 0; i < 16; i++) {
		let elevator = manager.elevators[i]
		let elevatorData = elevatorConfig.elevators[i]
		expect(elevator.id).toBe(elevatorData.id)
		expect(elevator.lowestFloor).toBe(elevatorData.lowestFloor)
		expect(elevator.highestFloor).toBe(elevatorData.highestFloor)
	}
})

test("Schedule a transition for single elevator with an offset", () => {
	let manager =  new ElevatorManager()
	let elevator = new Elevator(0, 0, 5)
	manager.add(elevator)
	manager.schedule(0, 2)
	manager.scheduleWithOffset(0, 5, 0)
	expect(manager.elevators[0].targetFloorQueue[0]).toBe(5)
})

test("Schedule a transition for single non existant elevator with an offset", () => {
	let manager =  new ElevatorManager()
	expect(() => manager.scheduleWithOffset(0, 5, 0)).toThrow(ElevatorError)
})

test("obtain currently scheduled floors", () => {
	let manager =  new ElevatorManager()
	let elevator = new Elevator(0,0,5)
	manager.add(elevator)
	elevator.schedule(1)
	elevator.schedule(2)
	expect(manager.scheduledFloors(0)).toStrictEqual([1,2])
})