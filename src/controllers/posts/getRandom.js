const { sequelize } = require('../../database/sequelize')
const { checkJWT } = require('../../helpers/checkAuth')

module.exports = async function (req, res) {

    checkJWT(req, res, async () => {
        const id = req.params.id
        const limit = parseInt(req.query.limit ?? 1)
        const channel = req.query.channel


        // check limit is valid number
        if (isNaN(limit) || limit < 1)
            return res.status(400).json({
                type: 'format-error',
                message: 'limit must be a valid positive number'
            })

        // filter by channel
        const where = {}
        if (channel)
            where.channelId = channel


        const post = await Posts.findAll({
            where: where,
            order: sequelize.random(),
            limit: Math.min(limit, 5), // limit is max 5
            attributes: [
                'id',
                'msgContent',
                'msgAttachment',
                'date',
                'reactions'
            ],
            include: [
                {
                    model: Users,
                    as: 'user'
                },
                {
                    model: Channels,
                    as: 'channel'
                }
            ]
        })

        res.status(200).json(post)
    })
}