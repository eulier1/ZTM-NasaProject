const parser = require("csv-parse")
const fs = require("fs")
const path = require("path")

const planets = require('./planets.mongo')


const csvPathFile = path.join(__dirname, "..", "..", "data", "kepler.csv")

function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  )
}

async function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(csvPathFile)
      .pipe(
        parser({
          comment: "#",
          columns: true,
        })
      )
      .on("data", async (data) => {
        if (isHabitablePlanet(data)) {
          savePlanet(data)
        }
      })
      .on("error", (err) => {
        console.log(err)
        reject(err)
      })
      .on("end", async () => {
        const countPlanetsFound = (await getAllPlanets()).length 
        console.log(`${countPlanetsFound} habitable planets`)
        resolve()
      })
  })
}

async function getAllPlanets() {
  return await planets.find({}, "-_id -__v")
}

async function savePlanet(planet) {
  try {
    await planets.updateOne({
      keplerName: planet.kepler_name
    }, {
      keplerName: planet.kepler_name
    }, {
      upsert: true
    })
  } catch(err) {
    console.error(` Could not save planet ${err}`)
  }
}

module.exports = {
  getAllPlanets,
  loadPlanetsData,
}
