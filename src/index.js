const express = require('express')
const cors = require('cors')
const app = express()
const PORT = process.env.PORT = 3001

let router = express.Router()
app.use(cors())
app.use(express.json()) // body parser

const Discord = require('discord.js')
const client = new Discord.Client()
global.client = client

let settings
const pjson = require('../package.json')

function login () {
  if (settings.discord.client_token) {
    console.log('Logging in with token...')
    client.login(settings.discord.client_token)
  } else {
    console.log('Error logging in: There may be an issue with you settings.json file')
  }
}

async function setup() {
  // check config file
  try {
      settings = require('../config/config.json')
    } catch (e) {
      console.log(`a config.json file has not been generated. ${e.stack}`)
      process.exit()
  }
  // check jwt file
  try {
    require('../config/jwt.js')
  } catch (e) {
    console.log('jwt.js does not exist. Generating one...')
    const { jwtConfig } = require('./helpers/generateConfig')
    await jwtConfig()
  }
  // log into discord
  if (settings.discord)
    login()


  // import databases
  const { Posts, Users, Channels, sequelize } = require('./database/sequelize')
  global.sequelizeInstance = sequelize
  global.Posts = Posts
  global.Users = Users
  global.Channels = Channels

  // import controllers
  const authController = require('./controllers/authController')
  const channelsController = require('./controllers/channelsController')
  const usersController = require('./controllers/usersController')

  // set parent route
  router.get('/', function (req, res) {
    res.json({'message': `Running ${settings.name} v${pjson.version}`})
  })

  // auth routes
  router.post('/auth/authorize', authController.authorize)

  // channels routes
  router.get('/channels', channelsController.getChannels)
  router.get('/channels/top', channelsController.getTop)
  router.get('/channels/timeline', channelsController.getTimeline)

  // users routes
  router.get('/users', usersController.getUsers)
  router.get('/users/top', usersController.getTop)
  router.get('/users/:id', usersController.getUser)


  // set base url extension
  app.use('/', router)

  // initialize api
  app.listen(PORT, function () {
    console.log(`${settings.name} running on port ${settings.port}!`)
  })
}

client.on('ready', () => {
  console.log(`Logged into Discord as ${client.user.username}!`)
})


// init setup
setup()
