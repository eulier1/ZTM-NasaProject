// A more flexible way to create our server
// This setup is useful when we want to integrate
// Websockets
// Meaning that setup things this way, allow us to responde
// To other types of connections
const http = require("http")

require('dotenv').config()

const app = require("./app")

const { mongoConnect } = require("./services/mongo")

const { loadPlanetsData } = require("./models/planets.model")
const { loadLaunchData } = require("./models/launches.model")

// This will create our server to respond to all of our
// incomming request to our server
const server = http.createServer(app)

async function startServer() {
  await mongoConnect()
  await loadPlanetsData()
  await loadLaunchData()

  const PORT = process.env.PORT || 8000
  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`)
  })
}

startServer()
