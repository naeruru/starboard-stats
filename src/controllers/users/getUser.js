const { checkJWT } = require('../../helpers/checkAuth')

module.exports = async function (req, res) {

    checkJWT(req, res, async () => {
        const id = req.params.id

        const user = await Users.findOne({ 
            where: {
                id: id
            },
            include: {
                model: Posts,
                attributes: ["id", "msgContent", "msgAttachment", "date"],
                where: {
                    deleted: false
                },
                include: {
                    model: Channels,
                    as: "channel"
                }
            }
        })

        res.status(200).json(user)
    })
}