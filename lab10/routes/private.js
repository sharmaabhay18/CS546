const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
    const { user } = req.session
    return res.render('private', { user })
})

module.exports = router
