const express = require('express')
const router = express.Router()
const { getShowById } = require('../api')

router.get('/:id', async (req, res) => {
    try {
        const id = req?.params?.id
        const showDetails = await getShowById(id)

        const showPayload = {
            ...showDetails,
            summary: showDetails.summary?.replace(/<(.|\n)*?>/g, ''),
        }

        res.render('show', {
            showDetails: showPayload,
        })
    } catch (error) {
        res.status(404).render('error', {
            title: 'Show Not Found',
            errorMessage: 'No show with given Id found',
        })
    }
})

module.exports = router
