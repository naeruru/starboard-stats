const { sequelize } = require('../../database/sequelize')
const { checkJWT } = require('../../helpers/checkAuth')

module.exports = async function (req, res) {

    checkJWT(req, res, async () => {
        const count = await Posts.count()

        const channels = await Posts.findAll({
            group: ["channelId"],
            attributes: [[sequelize.fn("COUNT", "channelId"), "count"]],
            order: [[sequelize.literal("count"), "DESC"]],
            include: {
                model: Channels,
                as: "channel"
            }
        })

        res.status(200).json({ count: count, data: channels })
    })
}