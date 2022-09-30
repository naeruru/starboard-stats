const express = require('express')
const cors = require('cors')
const app = express()
const PORT = process.env.PORT = 3001

let router = express.Router()
app.use(cors())
app.use(express.json()) // body parser

const rateLimit = require('express-rate-limit') // rate limiter
const limiterWindowMs = 1
const limiterMax = 20
const limiter = rateLimit({
	windowMs: limiterWindowMs * 60 * 1000, // refresh time (ms)
	max: limiterMax, // Limit each IP to n requests
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: `Too many requests. Max allowed is ${limiterMax} per ${limiterWindowMs} minute(s). meow`
})
app.use(limiter)

// api docs
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('../docs/apidocs.json')
const swaggerOptions = {
  customCss: '.swagger-ui .topbar { display: none }'
}

// discord.js
const { Client, GatewayIntentBits, Partials } = require('discord.js')
const client = new Client({
  partials: [Partials.GuildMember],
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
})
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
      settings = require('../config/config.js')
    } catch (e) {
      console.log(`a config.js file has not been created. ${e.stack}`)
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
  const postsController = require('./controllers/postsController')
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

  // posts routes
  router.get('/posts/random', postsController.getRandom)
  router.get('/posts/:id', postsController.getPost)

  // users routes
  router.get('/users', usersController.getUsers)
  router.get('/users/top', usersController.getTop)
  router.get('/users/:id', usersController.getUser)


  // set base url extension
  app.use('/', router)

  // set api docs route
  swaggerDocument.info.title = settings.name
  swaggerDocument.info.version = pjson.version
  router.use('/api-docs', swaggerUi.serve)
  router.get('/api-docs', swaggerUi.setup(swaggerDocument, swaggerOptions))

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
