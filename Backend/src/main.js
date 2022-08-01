import serverConfig from "./../config/serverConfig.json"
import elevatorConfig from "./../config/elevatorConfig.json"
import { AppWrapper } from "./applicationServer.js"
import { program } from "commander"

program.option("--no-simulation", "Run server without simulating elevators")
program.parse()
const options = program.opts()

const app = new AppWrapper(serverConfig, elevatorConfig, options.simulation)

function shutdownHandler() {
	console.log("Shutting down active connections")
	app.close(() => {
		console.log("Shutting down the application")
		process.exit(0)
	})
	setTimeout(() => {
		console.log("Connections didn't shut down in time, shutting down forcefully")
		process.exit(1)
	}, 10000)
}
process.on("SIGTERM", shutdownHandler)
process.on("SIGINT", shutdownHandler)

app.listen()