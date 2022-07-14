const { checkJWT } = require('../../helpers/checkAuth')

module.exports = async function (req, res) {

    checkJWT(req, res, async () => {
        const id = req.params.id

        const post = await Posts.findOne({
            where: {
                id: id,
                deleted: false
            },
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