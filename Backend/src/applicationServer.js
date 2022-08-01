import express from "express"
import bodyParser from "body-parser"
import cors from "cors"

import { ElevatorError } from "./elevator/elevator.js"
import { ElevatorManager } from "./elevator/elevatorManager.js"
import { integerRegex } from "./utlity/regex.js"
import { HttpCodes } from "./utlity/httpResponseStatusCodes.js"
import { checkIfUndefined, testRegex } from "./utlity/helperFunctions.js"

class AppWrapper {
	constructor(serverConfig, elevatorConfig, simulation) {
		this.listening = false
		this.app = express()
		this.app.use(bodyParser.json())
		this.app.use(bodyParser.urlencoded({ extended: true }))
		this.app.use(express.static("./dist/www"))
		this.app.use(cors())
		this.elevatorManager = new ElevatorManager()
		this.elevatorManager.addFromConfig(elevatorConfig)
		if (simulation) {
			this.startSimulation()
		} else {
			this.app.locals.elevatorManager = this.elevatorManager
			this.app.use(this.handlingMiddleware)
		}
		this.port = serverConfig.port

		this.app.get("/", (req, res) => {
			res.sendFile("index.html")
		})

		this.app.get("/status", (req, res) => {
			let sendEmpty = () => {
				res.status(HttpCodes.badRequest)
				res.send({ id: null, lowestFloor: null, highestFloor: null })
			}
			let id = req.query.id
			if (checkIfUndefined(id)) {
				sendEmpty()
				return
			}
			if (!testRegex(integerRegex, id)) {
				sendEmpty()
				return
			}
			try {
				let data = this.elevatorManager.status(id)
				res.status(HttpCodes.ok)
				res.send(data)

			} catch (error) {
				if (error instanceof ElevatorError) {
					sendEmpty()
				} else {
					throw error
				}
			}
		})

		this.app.post("/schedule", (req, res) => {

			let id = req.body.id
			let targetFloor = req.body.targetFloor

			if (checkIfUndefined(id, targetFloor)) {
				res.status(HttpCodes.badRequest)
				res.send("Request parameters cannot be undefined")
				return
			}

			if (!testRegex(integerRegex, id, targetFloor)) {
				res.status(HttpCodes.badRequest)
				res.send("Request parameters must be valid integers")
				return
			}

			try {
				this.elevatorManager.schedule(id, targetFloor)
				res.status(HttpCodes.ok)
				res.send("Ok")
			} catch (error) {
				if (error instanceof ElevatorError) {
					res.status(HttpCodes.badRequest)
					res.send(error.message)
				}
				else if (error instanceof RangeError) {
					res.status(HttpCodes.badRequest)
					res.send(error.message)
				} else {
					throw error
				}
			}
		})

		this.app.post("/scheduleWithOffset", (req, res) => {

			let id = req.body.id
			let targetFloor = req.body.targetFloor
			let offset = req.body.offset

			if (checkIfUndefined(id, targetFloor, offset)) {
				res.status(HttpCodes.badRequest)
				res.send("Request parameters cannot be undefined")
				return
			}

			if (!testRegex(integerRegex, id, targetFloor, offset)) {
				res.status(HttpCodes.badRequest)
				res.send("Request parameters must be valid integers")
				return
			}

			try {
				this.elevatorManager.scheduleWithOffset(id, targetFloor, offset)
				res.status(HttpCodes.ok)
				res.send("Ok")
			} catch (error) {
				if (error instanceof ElevatorError || error instanceof RangeError) {
					res.status(HttpCodes.badRequest)
					res.send(error.message)
				} else {
					throw error
				}
			}
		})

		this.app.post("/unschedule", (req, res) => {

			let id = req.body.id
			let targetFloor = req.body.targetFloor

			if (checkIfUndefined(id, targetFloor)) {
				res.status(HttpCodes.badRequest)
				res.send("Request parameters cannot be undefined")
				return
			}

			if (!testRegex(integerRegex, id, targetFloor)) {
				res.status(HttpCodes.badRequest)
				res.send("Request parameters must be valid integers")
				return
			}

			try {
				this.elevatorManager.unschedule(id, targetFloor)
				res.status(HttpCodes.ok)
				res.send("Ok")
			} catch (error) {
				if (error instanceof ElevatorError) {
					res.status(HttpCodes.badRequest)
					res.send(error.message)
				} else {
					throw error
				}
			}
		})

		this.app.post("/update", (req, res) => {
			let sendEmpty = () => {
				res.status(HttpCodes.badRequest)
				res.send("Invalid request")
			}

			let id = req.body.id
			let currentFloor = req.body.currentFloor

			if (checkIfUndefined(id, currentFloor)) {
				sendEmpty()
				return
			}

			if (!testRegex(integerRegex, id, currentFloor)) {
				sendEmpty()
				return
			}

			try {
				this.elevatorManager.update(id, currentFloor)
				res.status(HttpCodes.ok)
				res.send("ok")
			} catch (error) {
				if (error instanceof ElevatorError || error instanceof RangeError) {
					sendEmpty()
				} else {
					throw error
				}
			}
		})

		this.app.get("/config", (req, res) => {
			res.send(elevatorConfig)
		})

		this.app.get("/scheduledFloors", (req, res) => {

			let id = req.query.id

			if (checkIfUndefined(id)) {
				res.status(HttpCodes.badRequest)
				res.send("Request parameters cannot be undefined")
				return
			}

			if (!testRegex(integerRegex, id)) {
				res.status(HttpCodes.badRequest)
				res.send("Request parameters must be valid integers")
				return
			}

			try {
				let scheduledFloors = this.elevatorManager.scheduledFloors(id)
				res.status(HttpCodes.ok)
				res.send(scheduledFloors)
			} catch (error) {
				if (error instanceof ElevatorError) {
					res.status(HttpCodes.badRequest)
					res.send(error.message)
				} else {
					throw error
				}
			}
		})
	}
	/**
	 * Start listening
	 * @param {function} callback function that is supposed to be executed after starting the listener
	 */
	listen(callback) {
		this.listener = this.app.listen(this.port, () => {
			console.log(`web server started at port: ${this.port}`)
			this.listening = true
			if (callback != undefined) callback()
		})
	}
	/**
	 * Stop listening
	 * @returns 
	 */
	close(callback) {
		if (this.listener == undefined) {
			return
		}
		this.listener.close()
		this.listening = false
		if (callback != undefined) callback()
	}
	/**
	 * Middleware responsible for handling elevator state
	 * @param {*} req 
	 * @param {*} res 
	 * @param {*} next 
	 */
	handlingMiddleware(req, res, next) {
		function handleElevators() {
			let manager = req.app.locals.elevatorManager
			manager.handleElevators()
		}
		res.on("finish", handleElevators)
		next()
	}
	/**
	 * Start elevator movement simulation
	 */
	startSimulation() {
		this.simulationInterval = setInterval(() => this.elevatorManager.simulationStep(), 2000)
	}
	/**
	 * Stop elevator movement simulation
	 */
	stopSimulation() {
		clearInterval(this.simulationInterval)
	}
}

export { AppWrapper }