const Sequelize = require('sequelize')
const Op = Sequelize.Op
const { checkJWT } = require('../../helpers/checkAuth')

module.exports = async function (req, res) {

    checkJWT(req, res, async () => {
        const where = {}

        const limit = Math.min(parseInt(req.query.limit ?? 5), 10)
        const page = Math.max(parseInt(req.query.page ?? 1), 1)

        if (req.query.filter)
            where.name = { [Op.like]: `${req.query.filter }%`}
        else
            return res.status(400).json({
                type: 'format-error',
                message: 'a filter or ID must be specified'
            })
        

        const users = await Users.findAndCountAll({
            where: where,
            offset: (page - 1) * limit,
            limit: limit
        })

        res.status(200).json({count: users.count, users: users.rows})
    })
}