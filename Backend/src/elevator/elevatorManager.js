import { Elevator, ElevatorError } from "./elevator.js"

class ElevatorManager {
	/**
	 * Class constructor
	 */
	constructor() {
		this.elevators = []
	}
	/**
	 * Add an elevator to the manager
	 * Make sure that elevator ids are unique
	 * @param {Elevator} elevator instance of Elevator
	 */
	add(elevator) {
		if (this.elevators.some(obj => obj.id == elevator.id)) {
			throw new ElevatorError(`An elevator with id: ${elevator.id} is already being managed`)
		}
		this.elevators.push(elevator)
	}
	/**
	 * Remove an elevator with specified id from the manager
	 * @param {Number} id Passed value must be an integer
	 */
	remove(id) {
		let targetIndex = this.elevators.findIndex(obj => {
			return obj.id == id
		})
		if (targetIndex == -1) {
			throw new ElevatorError(`Elevator with id: ${id} does not exist`)
		}
		this.elevators.splice(targetIndex, 1)
	}
	/**
	 * Internal function used for obtaining a reference to an elevator with specified id
	 * @param {Number} id Passed value must be an integer
	 * @returns {Elevator}
	 */
	getElevator(id) {
		let elevator = this.elevators.find(obj => obj.id == id)
		if (elevator == undefined) {
			throw new ElevatorError(`Elevator with id: ${id} does not exist`)
		}
		return elevator
	}
	/**
	 * Perform a step of elevator's simulation
	 */
	simulationStep() {
		for (let elevator of this.elevators) {
			elevator.simulationStep()
		}
	}
	/**
	 * Schedule a floor transition for an elevator with provided id
	 * @param {Number} id Passed value must be an integer
	 * @param {Number} targetFloor Passed value must be an integer
	 */
	schedule(id, targetFloor) {
		let elevator = this.getElevator(id)
		elevator.schedule(targetFloor)
	}
	/**
	 * Schedule a floor transition for an elevator with provided id with offset specifying where should the floor be placed in targetFloorStack
	 * @param {Number} id Passed value must be an integer
	 * @param {Number} targetFloor Passed value must be an integer
	 * @param {Number} offset Passed value must be an integer
	 */
	scheduleWithOffset(id, targetFloor, offset) {
		let elevator = this.getElevator(id)
		elevator.scheduleWithOffset(targetFloor, offset)
	}
	/**
	 * Unschedule a floor transition for an elevator with provided id
	 * @param {Number} id Passed value must be an integer
	 * @param {Number} targetFloor Passed value must be an integer
	 */
	unschedule(id, targetFloor) {
		let elevator = this.getElevator(id)
		elevator.unschedule(targetFloor)
	}
	/**
	 * Update elevator's current position
	 * @param {Number} id Passed value must be an integer
	 * @param {Number} currentFloor Passed value must be an integer
	 */
	update(id, currentFloor) {
		let elevator = this.getElevator(id)
		elevator.update(currentFloor)
	}
	/**
	 * Obtain current status of elevator with specified id containing: elevator's id, current floor and current target floor
	 * @param {Number} id Passed value must be an integer
	 * @returns {object} Object storing status information about the elevator
	 */
	status(id) {
		let elevator = this.getElevator(id)
		let data = elevator.status()
		return { id: data[0], currentFloor: data[1], targetFloor: data[2] }
	}
	/**
	 * Add elevators from a config file
	 * @param {object} config object storing elevator configuration
	 */
	addFromConfig(config) {
		for (let elevatorData of config.elevators) {
			let elevator = new Elevator(elevatorData.id, elevatorData.lowestFloor, elevatorData.highestFloor)
			this.add(elevator)
		}
	}
	/**
	 * Obtain currently scheduled floors for the elevator with specified id
	 * @param {Number} id Passed value must be an integer
	 * @returns 
	 */
	scheduledFloors(id) {
		let elevator = this.getElevator(id)
		return elevator.scheduledFloors()
	}
	/**
	 * Handle behavior of multiple elevators
	 */
	handleElevators() {
		for (let elevator of this.elevators) {
			elevator.handleElevator()
		}
	}
}

export { ElevatorManager }