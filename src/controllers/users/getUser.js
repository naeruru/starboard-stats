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

        // const reaction_total = await Posts.sum('reactions', { where: { userId: user.id } })

        res.status(200).json(user)
    })
}