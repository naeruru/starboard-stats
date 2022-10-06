// for use in creating archives of attachments
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const { sequelize } = require('../../database/sequelize')
const { checkJWT } = require('../../helpers/checkAuth')

module.exports = async function (req, res) {

    checkJWT(req, res, async () => {

        const limit = Math.min(parseInt(req.query.limit ?? 1), 5)
        const page = Math.max(parseInt(req.query.page ?? 1), 1)

        const before = (req.query.before) ? new Date(req.query.before): null
        const after = (req.query.after) ? new Date(req.query.after): null

        const channel = req.query.channel
        const user = req.query.user

        const filter = req.query.filter

        const sort = req.query.sort ?? 'date'
        const sort_options = [
            'date',
            'reactions',
            'msgContent',
            'random'
        ]
        if (!sort_options.includes(sort))
            return res.status(400).json({
                type: 'format-error',
                message: 'sort must be a valid option (date, reactions, msgContent, random)'
            })

        const where = { deleted: false }
        if (before || after) {
            where.date = {}
            if (before && !after) where.date[Op.lt] = before
            if (!before && after) where.date[Op.gt] = after
            if (before && after) where.date[Op.between] = [after, before]
        }

        if (channel) where.channelId = channel
        if (user) where.userId = user
        if (filter) where.msgContent = { [Op.like]: `%${filter}%` }

        const posts = await Posts.findAndCountAll({
            where: where,
            offset: (page - 1) * limit,
            limit: limit,
            order: [ [(sort === 'random') ? sequelize.random() : sort, 'DESC'] ],
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

        res.status(200).json({ count: posts.count, posts: posts.rows })
    })
}
