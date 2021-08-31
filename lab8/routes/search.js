const express = require('express')
const router = express.Router()
const { findShows } = require('../api')

router.post('/', async (req, res) => {
    const searchValue = req?.body?.searchTerm
    if (searchValue?.trim().length === 0) {
        return res.status(400).render('error', {
            title: "Invalid search text",
            errorMessage: 'Please enter a valid search text',
        })
    }

    const showList = await findShows(searchValue)
    const finalShowsPayload =
        showList &&
        showList.filter((show, index) => {
            if (index < 20) {
                return show
            }
        })

    res.render('search', {
        showList: finalShowsPayload,
        searchTerm: searchValue,
    })
})

module.exports = router
