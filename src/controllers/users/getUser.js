module.exports = async function (req, res) {

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

    if (user)
        res.status(200).json(user)
    else
        res.status(500).json({ message: "User not found." })
}