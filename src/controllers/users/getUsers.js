const Sequelize = require('sequelize')
const Op = Sequelize.Op
const { checkJWT } = require('../../helpers/checkAuth')

module.exports = async function (req, res) {

    checkJWT(req, res, async () => {
        const where = {}

        if (req.query.filter)
            where.name = { [Op.like]: `${req.query.filter }%`}

        const users = await Users.findAll({ where: where })

        res.status(200).json(users)
    })
}