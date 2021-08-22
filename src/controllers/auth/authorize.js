const axios = require('axios')
const jwt = require('jsonwebtoken')
const settings = require('../../../config/config.js')
const jwtSettings = require('../../../config/jwt.js')

module.exports = async function (req, res) {
    
    const code = req.body.code
    const uri = req.body.uri // https://localhost.website

    if (!settings.discord) {
        return res.status(500).send({
            message: 'Discord authentication is disabled.',
          })
    }

    if (!code || !uri) {
        return res.status(500).send({
            message: 'A code and uri must be specified in the body.',
          })
    }

    // fetch bearer token
    const data = {
        client_id: settings.discord.client_id,
        client_secret: settings.discord.client_secret,
        grant_type: 'authorization_code',
        redirect_uri: uri,
        code: code,
        scope: 'identify', // allows https://discord.com/api/v6/users/@me (without email)
    }
    const authConfig = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }
    let tokenData
    await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams(data), authConfig).then(response => {
        tokenData = response.data
    }).catch(error => {
        res.status(500).json({ 
            type: error.response.data.error,
            message: error.response.data.error_description
         })
    })
    if (!tokenData) return


    // fetch user
    const fetchConfig = {
        headers: {
            authorization: `${tokenData.token_type} ${tokenData.access_token}`
        }
    }
    let user
    await axios.get('https://discordapp.com/api/users/@me', fetchConfig).then(response => {
        user = response.data
    }).catch(error => {
        res.status(500).json({ 
            type: error.response.data.error,
            message: error.response.data.error_description
         })
    })
    if (!user) return

    console.log(`${user.username}#${user.discriminator} requested authentication`)

    // check if in guild
    const guild = client.guilds.cache.get(settings.discord.guild_id)
    const member = guild.members.cache.get(user.id)
    if (member) {

        // create jwt
        const  jwtToken = jwt.sign({
            id: user.id,
            username: user.username,
            discriminator: user.discriminator,
            refresh: tokenData.refresh_token
        }, jwtSettings.jwt_secret, {
            expiresIn: tokenData.expires_in
        })

        res.status(200).json({
            token: jwtToken,
            user: `${user.username}#${user.discriminator}`,
            guild: guild.name,
            icon: `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.gif`
        })
    } else {
        res.status(500).json({ 
            type: 'auth-error',
            message: `${user.username}#${user.discriminator} is not a member of ${guild.name}`
         })
    }
}