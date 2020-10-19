const { sequelize, Posts } = require('../../database/sequelize')
const { checkJWT } = require('../../helpers/checkAuth')

module.exports = async function (req, res) {

    checkJWT(req, res, async () => {
        const count = await Posts.count()

        const reactions = await Posts.sum('reactions')

        const channels = await Posts.findAll({
            group: ["channelId"],
            attributes: [
                [sequelize.fn("COUNT", "channelId"), "count"],
                [sequelize.fn('sum', sequelize.col('reactions')), 'reactions']
            ],
            order: [[sequelize.literal("count"), "DESC"]],
            include: {
                model: Channels,
                as: "channel"
            }
        })

        res.status(200).json({ count: count, reactions: reactions, channels: channels })
    })
}