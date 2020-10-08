const jwt = require('jsonwebtoken')
const settings = require('../config/config.json')
const jwtConfig = require('../config/jwt')

function checkJWT (req, res, next) {
    // no token is present in headers
    if (!req.hasOwnProperty('headers') || !req.headers.hasOwnProperty('authorization')) {
        return res.status(401).json({
            type: 'auth-error',
            message: 'No token was supplied'
        })
    }

    const token = req.headers['authorization'].split(' ')[1]
    jwt.verify(token, jwtConfig.jwt_secret, (err, user) => {
        if (err) {
            return res.status(401).json({
                type: 'auth-error',
                message: 'Failed to authenticate token',
                error: err
            })
        }

        // check if in guild
        const guild = client.guilds.cache.get(settings.discord.guild_id)
        const member = guild.members.cache.get(user.id)
        if (member) {
            next()
        } else {
            return res.status(401).json({
                type: 'auth-error',
                message: `${user.username}#${user.discriminator} is not a member of ${guild.name}`
            })
        }
    })
}

module.exports = { checkJWT }