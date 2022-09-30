const { checkJWT } = require('../../helpers/checkAuth')

module.exports = async function (req, res) {

    checkJWT(req, res, async () => {
        const id = req.params.id

        const user = await Users.findOne({ 
            where: {
                id: id
            },
            attributes: [
                'id',
                'name'
            ],
            order: [
                [Posts, 'date', 'desc']
            ],
            include: [
                {
                    model: Posts,
                    attributes: [
                        'id',
                        'msgContent',
                        'msgAttachment',
                        'date',
                        'reactions'
                    ],
                    where: {
                        deleted: false
                    },
                    include: {
                        model: Channels,
                        as: 'channel'
                    }
                }
            ]
        })

        const reactions = await Posts.sum('reactions', { where: { userId: user.id } })
        const deleted = await Posts.count({ where: { userId: user.id, deleted: true } })
        user.setDataValue('reactions', reactions)
        user.setDataValue('deleted', deleted)

        res.status(200).json(user)
    })
}
