const { sequelize } = require('../../database/sequelize')
const { checkJWT } = require('../../helpers/checkAuth')

module.exports = async function (req, res) {

    checkJWT(req, res, async () => {
        const count = await Posts.count()

        const reactions = await Posts.sum('reactions')

        const users = await Posts.findAll({
            group: ["userId"],
            attributes: [
                [sequelize.fn("COUNT", "userId"), "count"],
                [sequelize.fn('sum', sequelize.col('reactions')), 'reactions'],
            ],
            order: [[sequelize.literal("count"), "DESC"]],
            include:{
                model: Users,
                as: "user"
            },
        })

        res.status(200).json({ count: count, reactions: reactions, users: users })
    })
}