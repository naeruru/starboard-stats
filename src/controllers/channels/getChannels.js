module.exports = async function (req, res) {
    const channels = await Channels.findAll()

    res.status(200).json(channels)
}