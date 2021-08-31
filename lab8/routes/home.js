const express = require('express')
const router = express.Router()

router.get('/', async (_, res) => {
    res.render('home')
})

module.exports = router
