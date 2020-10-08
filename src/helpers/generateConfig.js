const crypto = require('crypto')
const fs = require('fs')

function jwtConfig () {

    let dfInstance = crypto.createDiffieHellman(512)
    dfInstance.generateKeys('base64')
    const key = dfInstance.getPrivateKey('base64')

    const jwtConfig = {
        'jwt_secret': key
    }

    const logger = fs.createWriteStream(`${__dirname}/../config/jwt.js`, {flags: 'w'})
    logger.write('// This file was automatically generated. It is used to generate jwt tokens.\n')
    logger.write(`module.exports = ${JSON.stringify(jwtConfig, null, 2)}`)
    logger.end()

    console.log('./config/jwt.js has been created.')
}

module.exports = { jwtConfig }