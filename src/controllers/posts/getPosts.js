// for use in creating archives of attachments
const Sequelize = require('sequelize')
const Op = Sequelize.Op

module.exports = async function (req, res) {

    checkJWT(req, res, async () => {

        const year = req.query.year
        const month = (req.query.month.length === 1) ? `0${req.query.month}` : req.query.month

        const post = await Posts.findAll({
            where: {
                date: {
                    [Op.like]: `${year}-${month}-%` // format is YYYY-MM-[...]
                },
                deleted: false
            },
            attributes: [
                'id',
                'msgAttachment',
                'date',
            ]
        })

        res.status(200).json(post)
    })
}