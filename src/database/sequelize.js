const Sequelize = require('sequelize')

const UsersModel = require('./models/users')
const ChannelsModel = require('./models/channels')
const PostsModel = require('./models/posts')

// sql config info
let sqlconfig
try {
  sqlconfig = require('../config/config.json').sql
} catch (e) {
  console.log(`ERROR: A sql entry in config.json needs to be created in the configs folder.\nFollow the format of config.json.example.`)
}

// sequelize object
const sequelize = new Sequelize(sqlconfig.db, sqlconfig.username, sqlconfig.password, {
    host: sqlconfig.hostname,
    dialect: sqlconfig.dialect,
    logging: process.env.NODE_ENV === 'development',
    dialectOptions: {
      timezone: 'Etc/UTC',
    }
  })

// set up model instance
const Users = UsersModel(sequelize, Sequelize)
const Channels = ChannelsModel(sequelize, Sequelize)
const Posts = PostsModel(sequelize, Sequelize)

Users.hasMany(Posts)
Channels.hasMany(Posts)
Posts.belongsTo(Channels)
Posts.belongsTo(Users)


// sync schemas and initialize database if schemas do not exist yet
sequelize.sync({ alter: true }).then(() => {
  console.log('Database successfully initialized')
}).catch(e => {
  console.log(e)
  console.log('Failed to connect to the database.')
})

module.exports = { Posts, Users, Channels, sequelize }
