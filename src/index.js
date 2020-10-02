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
const { Posts, Users, Channels, sequelize } = require('./database/sequelize')
global.sequelizeInstance = sequelize
global.Posts = Posts
global.Users = Users
global.Channels = Channels

// import controllers
const channelsController = require('./controllers/channelsController')
const usersController = require('./controllers/usersController')
const statsController = require('./controllers/statsController')

// set parent route
router.get('/', function (req, res) {
  res.json({'message': 'Ping Successful'})
})

// channels routes
router.get('/channels', channelsController.getChannels)

// users routes
router.get('/users', usersController.getUsers)
router.get('/users/:id', usersController.getUser)

// stats routes
router.get('/stats/channels/top', statsController.getTopChannels)
router.get('/stats/users/top', statsController.getTopUsers)


// set base url extension
app.use('/', router)

// initialize api
app.listen(PORT, function () {
  console.log(`${settings.name} running on port ${settings.port}!`)
})
