class ElevatorError extends Error {
	constructor(message) {
		super(message)
		this.name = "ElevatorError"
	}
}

class Elevator {
	/**
	 * Class constructor
	 * @param {Number} id Passed value must be an integer
	 * @param {Number} lowestFloor Passed value must be an integer
	 * @param {Number} highestFloor Passed value must be an integer
	 */
	constructor(id, lowestFloor, highestFloor) {
		this.id = id
		if (highestFloor <= lowestFloor) {
			throw new ElevatorError(`Highest floor cannot be lower than the lowest floor and floors cannot be the same: ${highestFloor} <= ${lowestFloor}`)
		}
		this.lowestFloor = lowestFloor
		this.highestFloor = highestFloor
		this.numberOfFloors = highestFloor - lowestFloor
		this.currentFloor = lowestFloor > 0 ? lowestFloor : 0
		this.targetFloorQueue = []
	}
	/**
	 * Schedule a transition to specified floor
	 * @param {Number} targetFloor Passed value must be an integer
	 */
	schedule(targetFloor) {
		if (!(targetFloor <= this.highestFloor && targetFloor >= this.lowestFloor)) {
			throw new RangeError(`Value: ${targetFloor} is out of range of possible elevator target floors`)
		}
		if (this.targetFloorQueue.includes(targetFloor)) {
			throw new ElevatorError(`Floor: ${targetFloor} is already scheduled`)
		}
		this.targetFloorQueue.push(targetFloor)
	}
	/**
	 * Schedule a transition to a specified floor with offset specifying where should the floor be placed on the target floor stack 
	 * @param {Number} targetFloor Passed value must be an integer
	 * @param {Number} offset Passed value must be an integer
	 */
	scheduleWithOffset(targetFloor, offset) {
		if (!(targetFloor <= this.highestFloor && targetFloor >= this.lowestFloor)) {
			throw new RangeError(`Value: ${targetFloor} is out of range of possible elevator target floors`)
		}
		if (this.targetFloorQueue.includes(targetFloor)) {
			throw new ElevatorError(`Floor: ${targetFloor} is already scheduled`)
		}
		if (offset >= this.targetFloorQueue.length) {
			this.schedule(targetFloor)
		} else {
			this.targetFloorQueue.splice(offset > 0 ? offset : 0, 0, targetFloor)
		}
	}
	/**
	 * Unschedule a transition to specified floor
	 * @param {Number} targetFloor Passed value must be an integer
	 */
	unschedule(targetFloor) {
		if (!(this.targetFloorQueue.includes(targetFloor))) {
			throw new ElevatorError(`Floor: ${targetFloor} is not currently scheduled thus it cannot be unscheduled`)
		}
		this.targetFloorQueue = this.targetFloorQueue.filter(value => value != targetFloor)
	}
	/**
	 * Obtain current status of elevator containing: elevator's id, current floor and current target floor
	 * @returns {any[]}
	 */
	status() {
		return [this.id, this.currentFloor, this.targetFloorQueue.length == 0 ? null : this.targetFloorQueue[0]]
	}
	/**
	 * Perform a step of elevator's simulation
	 * @returns 
	 */
	simulationStep() {
		let targetFloor = this.targetFloorQueue.length == 0 ? null : this.targetFloorQueue[0]
		if (targetFloor == null) {
			return
		}
		if (targetFloor > this.currentFloor) {
			this.currentFloor += 1
		}
		else if (targetFloor < this.currentFloor) {
			this.currentFloor -= 1

		} else {
			this.handleElevator()
		}
	}
	/**
	 * Handle elevator's behaviour
	 * @returns 
	 */
	handleElevator() {
		let targetFloor = this.targetFloorQueue.length == 0 ? null : this.targetFloorQueue[0]
		if (targetFloor == null) {
			return
		}
		if (this.currentFloor == targetFloor) {
			this.targetFloorQueue.shift()
		}

	}
	/**
	 * Update elevator's current position 
	 * @param {Number} currentFloor Passed value must be an integer
	 */
	update(currentFloor) {
		if (!(currentFloor <= this.highestFloor && currentFloor >= this.lowestFloor)) {
			throw new RangeError(`Value: ${currentFloor} is out of range of possible elevator target floors`)
		}
		this.currentFloor = currentFloor
	}
	/**
	 * Obtain currently scheduled floors
	 * @returns {Number[]}
	 */
	scheduledFloors() {
		return this.targetFloorQueue
	}
}

export { Elevator, ElevatorError }