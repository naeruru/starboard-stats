const Sequelize = require('sequelize')
const Op = Sequelize.Op
const { checkJWT } = require('../../helpers/checkAuth')

module.exports = async function (req, res) {
    checkJWT(req, res, async () => {
        const where = {}

        if (req.query.filter)
            where.name = { [Op.like]: `${req.query.filter }%`}

        const channels = await Channels.findAll({
            where: where
        })
        res.status(200).json(channels)
    })
}