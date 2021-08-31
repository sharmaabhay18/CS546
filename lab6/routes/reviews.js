const express = require('express')
const router = express.Router()
const { reviews } = require('../data')
const ErrorValidation = require('../errorValidation')

const validateReviewKeys = (bookInfo) => {
    for (let key in bookInfo) {
        if (
            key != 'title' &&
            key != 'reviewer' &&
            key != 'rating' &&
            key != 'dateOfReview' &&
            key != 'review'
        ) {
            throw `${key} is not a valid argument`
        }
    }
}

router.get('/:id', async (req, res) => {
    const id = req.params?.id
    try {
        ErrorValidation.validateObjectId(id)
    } catch (error) {
        return res.status(400).json({ message: error })
    }
    try {
        const reviewsPayload = await reviews.getReviewsByBooksId(id)
        if (reviewsPayload.length === 0) throw 'No reviews found!!'
        res.status(200).json(reviewsPayload)
    } catch (error) {
        res.status(404).json({ message: error })
    }
})

router.post('/:id', async (req, res) => {
    const id = req.params?.id
    const reviewPayload = req.body

    try {
        validateReviewKeys(reviewPayload)
        ErrorValidation.exeReviewErrorCheck(reviewPayload)
    } catch (error) {
        return res.status(400).json({ message: error })
    }

    try {
        ErrorValidation.validateObjectId(id)
    } catch (error) {
        return res.status(400).json({ message: error })
    }

    try {
        const bookPayload = await reviews.createReview(id, reviewPayload)
        res.status(200).json(bookPayload)
    } catch (error) {
        res.status(404).json({ message: error })
    }
})

router.get('/review/:id', async (req, res) => {
    const id = req.params?.id
    try {
        ErrorValidation.validateObjectId(id)
    } catch (error) {
        return res.status(400).json({ message: error })
    }
    try {
        const reviewById = await reviews.getReviewsById(id)
        res.status(200).json(reviewById)
    } catch (error) {
        res.status(404).json({ message: error })
    }
})

router.delete('/:id', async (req, res) => {
    const id = req.params?.id

    try {
        ErrorValidation.validateObjectId(id)
    } catch (error) {
        return res.status(400).json({ message: error })
    }

    try {
        const deletedReview = await reviews.deleteReview(id)
        res.status(200).json(deletedReview)
    } catch (error) {
        res.status(404).json({ message: error })
    }
})

module.exports = router
