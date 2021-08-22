const { sequelize, Channels } = require('../../database/sequelize')
const { checkJWT } = require('../../helpers/checkAuth')

module.exports = async function (req, res) {

//    checkJWT(req, res, async () => {

        // // get channels
        // const channels = await Channels.findAll()

        // // map each channel to a timeline of dates grouped by date
        // const timelines = await Promise.all(channels.map(async (channel) => {
        //     const timeline = await Posts.findAll({
        //         where: {
        //             channelId: channel.id
        //         },
        //         attributes: [
        //             [sequelize.fn('DATE_FORMAT', sequelize.col('date'), '%Y-%m-%d 00:00:00'), 'day'],
        //             [sequelize.fn('COUNT', 'date'), 'posts'], 
        //             [sequelize.fn('sum', sequelize.col('reactions')), 'reactions']
        //         ],
        //         group: ['day', 'channelId']
        //     })
        //     return {id: channel.id, name: channel.name, timeline }
        // }))

        const whereClause = {}
        if (req.query.channel)
            whereClause.channelId = req.query.channel

        let dateInterval
        if (req.query.interval === 'monthly')
            dateInterval = '%Y-%m-01 00:00:00'
        else
            dateInterval = '%Y-%m-%d 00:00:00'

        const timeline = await Posts.findAll({
            where: whereClause,
            attributes: [
                [sequelize.fn('DATE_FORMAT', sequelize.col('date'), dateInterval), 'time'],
                [sequelize.fn('COUNT', 'date'), 'posts'],
                [sequelize.fn('sum', sequelize.col('reactions')), 'reactions']
            ],
            group: ['time']
        })

        res.status(200).json(timeline)
//    })
    
}