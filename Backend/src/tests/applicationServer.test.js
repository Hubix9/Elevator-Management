import axios from "axios"
import { AppWrapper } from "../applicationServer.js"
import elevatorConfig from "../../config/elevatorConfig.json"
import serverConfig from "../../config/serverConfig.json"
import { HttpCodes } from "../utlity/httpResponseStatusCodes.js"

const app = new AppWrapper(serverConfig, elevatorConfig)

beforeAll(() => {
	app.listen()
})


afterAll(() => {
	app.close()
})

test("check if the server is responding to request", async () => {
	let result = await axios.get("http://localhost:3000/")
		.catch((err) => {
			return err.response.status
		})
	expect(result.status).toBe(HttpCodes.ok)
})

test("make a valid status request to the server", async () => {
	let result = await axios.get("http://localhost:3000/status?id=0")
		.catch((err) => {
			return err.response.status
		})
	expect(result.status).toBe(HttpCodes.ok)
})

test("make an invalid status request to the server with id out of range", async () => {
	let result = await axios.get("http://localhost:3000/status?id=50")
		.catch((err) => {
			return err.response.status
		})
	expect(result).toBe(HttpCodes.badRequest)
})

test("make an invalid status request to the server with non integer id value", async () => {
	let result = await axios.get("http://localhost:3000/status?id=test")
		.catch((err) => {
			return err.response.status
		})
	expect(result).toBe(HttpCodes.badRequest)
})

test("make an invalid status request to the server with lack of value for id", async () => {
	let result = await axios.get("http://localhost:3000/status?id=")
		.catch((err) => {
			return err.response.status
		})
	expect(result).toBe(HttpCodes.badRequest)
})

test("make an invalid status request to the server without id parameter", async () => {
	let result = await axios.get("http://localhost:3000/status")
		.catch((err) => {
			return err.response.status
		})
	expect(result).toBe(HttpCodes.badRequest)
})

test("make a valid schedule request to the server", async () => {
	let result = await axios.post("http://localhost:3000/schedule", {
		id: 0,
		targetFloor: 1
	})
		.catch((err) => {
			return err.response
		})
	expect(result.status).toBe(HttpCodes.ok)
})

test("make an invalid schedule request to the server with incorrect parameter types", async () => {
	let result = await axios.post("http://localhost:3000/schedule", {
		id: "abc",
		targetFloor: 1.5
	})
		.catch((err) => {
			return err.response
		})
	expect(result.status).toBe(HttpCodes.badRequest)
})

test("make an invalid schedule request to the server with partially correct parameter types", async () => {
	let result = await axios.post("http://localhost:3000/schedule", {
		id: 0,
		targetFloor: 1.5
	})
		.catch((err) => {
			return err.response
		})
	expect(result.status).toBe(HttpCodes.badRequest)
})

test("make an invalid schedule request to the server without required parameters", async () => {
	let result = await axios.post("http://localhost:3000/schedule")
		.catch((err) => {
			return err.response
		})
	expect(result.status).toBe(HttpCodes.badRequest)
})

test("make an invalid schedule request to the server with parameters out of range", async () => {
	let result = await axios.post("http://localhost:3000/schedule", {
		id: 50,
		targetFloor: 100
	})
		.catch((err) => {
			return err.response
		})
	expect(result.status).toBe(HttpCodes.badRequest)
})

test("make a valid scheduleWithOffset request to the server", async () => {
	let result = await axios.post("http://localhost:3000/scheduleWithOffset", {
		id: 0,
		targetFloor: 2,
		offset: 0
	})
		.catch((err) => {
			return err.response
		})
	expect(result.status).toBe(HttpCodes.ok)
})

test("make an invalid scheduleWithOffset request to the server with invalid parameter types", async () => {
	let result = await axios.post("http://localhost:3000/scheduleWithOffset", {
		id: "abc",
		targetFloor: 1.5,
		offset: false
	})
		.catch((err) => {
			return err.response
		})
	expect(result.status).toBe(HttpCodes.badRequest)
})

test("make an invalid scheduleWithOffset request to the server without required parameters", async () => {
	let result = await axios.post("http://localhost:3000/scheduleWithOffset")
		.catch((err) => {
			return err.response
		})
	expect(result.status).toBe(HttpCodes.badRequest)
})

test("make an invalid scheduleWithOffset request to the server with parameters out of valid range", async () => {
	let result = await axios.post("http://localhost:3000/scheduleWithOffset", {
		id: 50,
		targetFloor: 50,
		offset: 0
	})
		.catch((err) => {
			return err.response
		})
	expect(result.status).toBe(HttpCodes.badRequest)
})

test("make a valid unschedule request to the server #1", async () => {
	let result = await axios.post("http://localhost:3000/unschedule", {
		id: 0,
		targetFloor: 1
	})
		.catch((err) => {
			return err.response
		})
	expect(result.status).toBe(HttpCodes.ok)
})

test("make a valid unschedule request to the server #2", async () => {
	let result = await axios.post("http://localhost:3000/unschedule", {
		id: 0,
		targetFloor: 2
	})
		.catch((err) => {
			return err.response
		})
	expect(result.status).toBe(HttpCodes.ok)
})

test("make an invalid unschedule request to the server with invalid parameter types", async () => {
	let result = await axios.post("http://localhost:3000/unschedule", {
		id: "abc",
		targetFloor: 2.5
	})
		.catch((err) => {
			return err.response
		})
	expect(result.status).toBe(HttpCodes.badRequest)
})

test("make an invalid unschedule request to the server without required parameters", async () => {
	let result = await axios.post("http://localhost:3000/unschedule")
		.catch((err) => {
			return err.response
		})
	expect(result.status).toBe(HttpCodes.badRequest)
})

test("make an invalid unschedule request to the server with parameters out of valid range", async () => {
	let result = await axios.post("http://localhost:3000/unschedule", {
		id: 50,
		targetFloor: 50
	})
		.catch((err) => {
			return err.response
		})
	expect(result.status).toBe(HttpCodes.badRequest)
})

test("make a valid update request to the server", async () => {
	let result = await axios.post("http://localhost:3000/update", {
		id: 0,
		currentFloor: 0
	})
		.catch((err) => {
			return err.response
		})
	expect(result.status).toBe(HttpCodes.ok)
})

test("make an invalid update request to the server with incorrect parameter types", async () => {
	let result = await axios.post("http://localhost:3000/update", {
		id: "abc",
		currentFloor: 2.5
	})
		.catch((err) => {
			return err.response
		})
	expect(result.status).toBe(HttpCodes.badRequest)
})

test("make an invalid update request to the server without required parameters", async () => {
	let result = await axios.post("http://localhost:3000/update")
		.catch((err) => {
			return err.response
		})
	expect(result.status).toBe(HttpCodes.badRequest)
})

test("make an invalid update request to the server with parameters outside of valid range", async () => {
	let result = await axios.post("http://localhost:3000/update", {
		id: 50,
		currentFloor: 50
	})
		.catch((err) => {
			return err.response
		})
	expect(result.status).toBe(HttpCodes.badRequest)
})

test("make a valid scheduledFloors request to the server", async () => {
	let result = await axios.get("http://localhost:3000/scheduledFloors?id=0")
		.catch((err) => {
			return err.response
		})
	expect(result.status).toBe(HttpCodes.ok)
	expect(result.data).toStrictEqual([])
})

test("make an invalid scheduledFloors request to the server with incorrect parameter types", async () => {
	let result = await axios.get("http://localhost:3000/scheduledFloors?id=abc")
		.catch((err) => {
			return err.response
		})
	expect(result.status).toBe(HttpCodes.badRequest)
})

test("make an invalid scheduledFloors request to the server without required parameters", async () => {
	let result = await axios.get("http://localhost:3000/scheduledFloors")
		.catch((err) => {
			return err.response
		})
	expect(result.status).toBe(HttpCodes.badRequest)
})

test("make an invalid scheduledFloors request to the server with parameters outside of valid range", async () => {
	let result = await axios.get("http://localhost:3000/scheduledFloors?id=99")
		.catch((err) => {
			return err.response
		})
	expect(result.status).toBe(HttpCodes.badRequest)
})