import { Elevator, ElevatorError } from "../elevator/elevator.js"

test("Moving elevator from 0 to 4-th story with more simulation steps than floors", () => {
	let elevator = new Elevator(0, 0, 5)
	elevator.schedule(4)
	for (let i = 0; i < 5; i++) elevator.simulationStep()
	expect(elevator.currentFloor).toBe(4)
})

test("Moving elevator from 0 to 4-th story with exactly the same number of simulation steps as floors", () => {
	let elevator = new Elevator(0, 0, 5)
	elevator.schedule(4)
	for (let i = 0; i < 4; i++) elevator.simulationStep()
	expect(elevator.currentFloor).toBe(4)
})

test("Moving elevator from 0 to 4-th story with less simulation steps than floors", () => {
	let elevator = new Elevator(0, 0, 5)
	elevator.schedule(4)
	for (let i = 0; i < 3; i++) elevator.simulationStep()
	expect(elevator.currentFloor).toBe(3)
})

test("Moving elevator in upwards direction", () => {
	let elevator = new Elevator(0, 0, 5)
	elevator.schedule(1)
	elevator.simulationStep()
	expect(elevator.currentFloor).toBe(1)
})

test("Moving elevator in downwards direction", () => {
	let elevator = new Elevator(0, 0, 5)
	elevator.currentFloor = 2
	elevator.schedule(0)
	elevator.simulationStep()
	expect(elevator.currentFloor).toBe(1)
})

test("Moving elevator to a non existant floor over highest floor", () => {
	let elevator = new Elevator(0, 0, 5)
	expect(() => elevator.schedule(6)).toThrow(RangeError)
})

test("Moving elevator to a non existant floor under lowest floor", () => {
	let elevator = new Elevator(0, 0, 5)
	expect(() => elevator.schedule(-1)).toThrow(RangeError)
})

test("Scheduling same floor twice", () => {
	let elevator = new Elevator(0, 0, 5)
	elevator.schedule(5)
	expect(() => elevator.schedule(5)).toThrow(ElevatorError)
})

test("Perform a simulation step when there is no target floor", () => {
	let elevator = new Elevator(0, 0, 5)
	elevator.simulationStep()
	expect(elevator.currentFloor).toBe(0)
})

test("Obtain elevator status while having a target floor", () => {
	let elevator = new Elevator(0, 0, 5)
	elevator.schedule(4)
	elevator.simulationStep()
	expect(elevator.status()).toStrictEqual([0, 1, 4])
})

test("Obtain elevator status while not having a target floor", () => {
	let elevator = new Elevator(0, 0, 5)
	expect(elevator.status()).toStrictEqual([0, 0, null])
})

test("Unschedule a transition to a floor", () => {
	let elevator = new Elevator(0, 0, 5)
	elevator.schedule(2)
	elevator.schedule(3)
	elevator.schedule(4)
	elevator.unschedule(4)
	expect(elevator.targetFloorQueue).toStrictEqual([2, 3])
})

test("Unschedule a floor that is not currently scheduled", () => {
	let elevator = new Elevator(0, 0, 5)
	elevator.schedule(2)
	elevator.schedule(3)
	elevator.schedule(4)
	expect(() => elevator.unschedule(0)).toThrow(ElevatorError)
})

test("Schedule a floor transition with offset of 0", () => {
	let elevator = new Elevator(0, 0, 5)
	elevator.schedule(2)
	elevator.schedule(3)
	elevator.schedule(4)
	elevator.scheduleWithOffset(5, 0)
	expect(elevator.targetFloorQueue).toStrictEqual([5, 2, 3, 4])
})

test("Schedule a floor transition with offset 0 to a floor out of range of possible floors", () => {
	let elevator = new Elevator(0, 0, 5)
	elevator.schedule(2)
	elevator.schedule(3)
	elevator.schedule(4)
	expect(() => elevator.scheduleWithOffset(7, 0)).toThrow(RangeError)
})

test("Schedule a floor transition with offset higher than highestFloor", () => {
	let elevator = new Elevator(0, 0, 5)
	elevator.schedule(2)
	elevator.schedule(3)
	elevator.schedule(4)
	elevator.scheduleWithOffset(5, 8)
	expect(elevator.targetFloorQueue).toStrictEqual([2, 3, 4, 5])
})

test("Schedule a floor transition with offset lower than lowerFloor", () => {
	let elevator = new Elevator(0, 0, 5)
	elevator.schedule(2)
	elevator.schedule(3)
	elevator.schedule(4)
	elevator.scheduleWithOffset(5, -5)
	expect(elevator.targetFloorQueue).toStrictEqual([5, 2, 3, 4])
})

test("Schedule a floor transition with offset 0 when the floor is already scheduled", () => {
	let elevator = new Elevator(0, 0, 5)
	elevator.schedule(2)
	elevator.schedule(3)
	elevator.schedule(4)
	expect(() => elevator.scheduleWithOffset(2, 0)).toThrow(ElevatorError)
})

test("Schedule a floor transition with offset lower than lowest floor when the floor is already scheduled", () => {
	let elevator = new Elevator(0, 0, 5)
	elevator.schedule(2)
	elevator.schedule(3)
	elevator.schedule(4)
	expect(() => elevator.scheduleWithOffset(2, -5)).toThrow(ElevatorError)
})

test("Schedule a floor transition with offset, for elevator with lowest floor higher than 0", () => {
	let elevator = new Elevator(0, 4, 8)
	elevator.schedule(8)
	elevator.scheduleWithOffset(7, 0)
	expect(elevator.targetFloorQueue).toStrictEqual([7,8])	
})

test("Schedule a floor transition with offset higher than 0", () => {
	let elevator = new Elevator(0, 0, 8)
	elevator.schedule(8)
	elevator.scheduleWithOffset(7, 5)
	expect(elevator.targetFloorQueue).toStrictEqual([8,7])	
})

test("Schedule a floor transition with offset, for elevator with many scheduled floors", () => {
	let elevator = new Elevator(0, 0, 8)
	elevator.schedule(5)
	elevator.schedule(6)
	elevator.schedule(7)
	elevator.schedule(8)
	elevator.scheduleWithOffset(2, 2)
	expect(elevator.targetFloorQueue).toStrictEqual([5,6,2,7,8])	
})

test("Create an elevator with highest floor lower than the lowest floor", () => {
	expect(() => new Elevator(0, 0, -5)).toThrow(ElevatorError)
})

test("Create an elevator with lowest floor higher than the highest floor", () => {
	expect(() => new Elevator(0, 5, 0)).toThrow(ElevatorError)
})

test("Create an elevator with the same value of lowest and highest floors", () => {
	expect(() => new Elevator(0, 0, 0)).toThrow(ElevatorError)
})

test("Update elevator's position with a value from correct input range", () => {
	let elevator = new Elevator(0, 0, 5)
	elevator.update(3)
	expect(elevator.currentFloor).toBe(3)
})

test("Update elevator's position with a value from incorrect input range", () => {
	let elevator = new Elevator(0, 0, 5)
	expect(() => elevator.update(10)).toThrow(RangeError)	
})

test("Run handleElevator function when no floor is scheduled", () => {
	let elevator = new Elevator(0, 0, 5)
	elevator.handleElevator()
	expect(elevator.currentFloor).toBe(0)
})

test("handleElevator when currentFloor is the same as targetFloor", () => {
	let elevator = new Elevator(0, 0, 5)
	elevator.currentFloor = 3
	elevator.schedule(3)
	elevator.handleElevator()
	expect(elevator.targetFloorQueue).toStrictEqual([])
})

test("handleElevator when currentFloor is different than targetFloor", () => {
	let elevator = new Elevator(0, 0, 5)
	elevator.currentFloor = 2
	elevator.schedule(3)
	elevator.handleElevator()
	expect(elevator.targetFloorQueue).toStrictEqual([3])
})


test("obtain currently scheduled floors", () => {
	let elevator = new Elevator(0,0,5)
	elevator.schedule(1)
	elevator.schedule(2)
	expect(elevator.scheduledFloors()).toStrictEqual([1,2])
})