const { checkJWT } = require('../../helpers/checkAuth')

module.exports = async function (req, res) {

    checkJWT(req, res, async () => {
        const id = req.params.id

        // TODO

        // ideas:
        // return total post count, total reaction count, top 5-10 posts
    })
}