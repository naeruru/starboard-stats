const { sequelize } = require('../../database/sequelize')
const { checkJWT } = require('../../helpers/checkAuth')

module.exports = async function (req, res) {

    checkJWT(req, res, async () => {
        const posts = await Posts.count()
        const usercount = await Users.count()
        const reactions = await Posts.sum('reactions')

        const limit = Math.min(parseInt(req.query.limit ?? 10), 30)
        const page = Math.max(parseInt(req.query.page ?? 1), 1)

        const users = await Posts.findAll({
            offset: (page - 1) * limit,
            limit: limit,
            group: ["userId"],
            attributes: [
                [sequelize.fn("COUNT", "userId"), "posts"],
                [sequelize.fn('sum', sequelize.col('reactions')), 'reactions'],
            ],
            order: [[sequelize.literal("posts"), "DESC"]],
            include:{
                model: Users,
                as: "user"
            },
        })

        res.status(200).json({ posts: posts, reactions: reactions, count: usercount, users: users })
    })
}