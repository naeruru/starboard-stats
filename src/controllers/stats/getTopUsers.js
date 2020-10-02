const { sequelize } = require('../../database/sequelize')

module.exports = async function (req, res) {

    const count = await Posts.count()

    const users = await Posts.findAll({
        group: ["userId"],
        attributes: [[sequelize.fn("COUNT", "userId"), "count"]],
        order: [[sequelize.literal("count"), "DESC"]],
        include: {
            model: Users,
            as: "user"
        }
    })

    res.status(200).json({ count: count, data: users })
}