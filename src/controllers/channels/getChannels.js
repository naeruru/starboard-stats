const { checkJWT } = require('../../helpers/checkAuth')

module.exports = async function (req, res) {
    checkJWT(req, res, async () => {
        const channels = await Channels.findAll()
        res.status(200).json(channels)
    })
}