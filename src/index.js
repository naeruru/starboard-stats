const express = require('express')
const cors = require('cors')
const app = express()
const PORT = process.env.PORT = 3001

let router = express.Router()
app.use(cors())
app.use(express.json()) // body parser

let settings
try {
    settings = require('./config/config.json')
  } catch (e) {
    console.log(`a config.json file has not been generated. ${e.stack}`)
    process.exit()
  }

// import databases
const { Rooms, Devices, DeviceTypes, Usage } = require('./database/sequelize')

// import controllers
// const roomsController = require('./controllers/roomsController')
// const roomController = require('./controllers/roomController')
// const deviceController = require('./controllers/deviceController')
// const devicesController = require('./controllers/devicesController')
// const usageController = require('./controllers/usageController')
// const weatherController = require('./controllers/weatherController')

// set parent route
router.get('/', function (req, res) {
  res.json({'message': 'Ping Successful'})
})

// // rooms routes
// router.get('/rooms', roomsController.getRooms)

// // room routes
// router.get('/room/:id', roomController.getRoom)

// // device routes
// router.get('/device/:id', deviceController.getDevice)
// router.get('/device/toggle/:id', deviceController.toggleDevice)

// // devices routes
// router.get('/devices', devicesController.getDevices)
// router.get('/devices/status', devicesController.getDeviceStatuses)

// // usage routes
// router.post('/usage/add', usageController.addUsage)
// router.get('/usage', usageController.getUsageData)
// router.delete('/usage/delete', usageController.deleteUsage)

// // weather routes
// router.get('/weather', weatherController.getWeather)
// router.get('/temperature', weatherController.getInsideTemp)
// router.get('/temperature/:temp', weatherController.setInsideTemp)


// set base url extension
app.use('/', router)

// initialize api
app.listen(PORT, function () {
  console.log(`${settings.name} running on port ${settings.port}!`)
})
