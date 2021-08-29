const { sequelize } = require('../../database/sequelize')
const { checkJWT } = require('../../helpers/checkAuth')

module.exports = async function (req, res) {

    checkJWT(req, res, async () => {
        const posts = await Posts.count()

        const reactions = await Posts.sum('reactions')

        const users = await Posts.findAll({
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

        res.status(200).json({ posts: posts, reactions: reactions, users: users })
    })
}