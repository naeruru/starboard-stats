const Sequelize = require('sequelize')
const Op = Sequelize.Op

module.exports = async function (req, res) {

    const where = {}

    if (req.query.filter)
        where.name = { [Op.like]: `${req.query.filter }%`}



    const users = await Users.findAll({ where: where })

    res.status(200).json(users)
}