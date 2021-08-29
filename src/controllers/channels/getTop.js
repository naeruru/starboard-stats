const { sequelize, Posts } = require('../../database/sequelize')
const { checkJWT } = require('../../helpers/checkAuth')

module.exports = async function (req, res) {

    checkJWT(req, res, async () => {
        const posts = await Posts.count()

        const reactions = await Posts.sum('reactions')

        const channels = await Posts.findAll({
            group: ["channelId"],
            attributes: [
                [sequelize.fn("COUNT", "channelId"), "posts"],
                [sequelize.fn('sum', sequelize.col('reactions')), 'reactions']
            ],
            order: [[sequelize.literal("posts"), "DESC"]],
            include: {
                model: Channels,
                as: "channel"
            }
        })

        res.status(200).json({ posts: posts, reactions: reactions, channels: channels })
    })
}