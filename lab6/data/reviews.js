const { ObjectId } = require('mongodb')
const mongoCollections = require('../config/mongoCollections')
const books = mongoCollections.books
const { getBookById } = require('./books')
const ErrorValidation = require('../errorValidation')

const getReviewsByBooksId = async (id) => {
    try {
        ErrorValidation.validateObjectId(id)
        const booksCollection = await books()

        const bookById = await booksCollection.findOne({
            _id: ObjectId(id),
        })

        if (bookById === null) throw 'No book found with given id'

        return bookById.reviews
    } catch (error) {
        throw error
    }
}

const createReview = async (id, payload) => {
    try {
        ErrorValidation.validateObjectId(id)
        ErrorValidation.exeReviewErrorCheck(payload)
        const foundBook = await getBookById(id)
        foundBook.reviews.push({ ...payload, _id: ObjectId() })

        const booksCollection = await books()
        const updateBookPayload = await booksCollection.updateOne(
            { _id: ObjectId(id) },
            { $set: { reviews: foundBook.reviews } }
        )

        if (!updateBookPayload.matchedCount && !updateBookPayload.modifiedCount)
            throw 'Could not update reviews in book'

        return foundBook
    } catch (error) {
        throw error
    }
}

const getReviewsById = async (id) => {
    try {
        ErrorValidation.validateObjectId(id)
        const booksCollection = await books()
        const [reviewById] = await booksCollection
            .aggregate([
                { $unwind: '$reviews' },
                { $match: { 'reviews._id': { $eq: ObjectId(id) } } },
                {
                    $project: {
                        _id: '$reviews._id',
                        title: '$reviews.title',
                        reviewer: '$reviews.reviewer',
                        rating: '$reviews.rating',
                        dateOfReview: '$reviews.dateOfReview',
                        review: '$reviews.review',
                    },
                },
            ])
            .toArray()

        if (reviewById === undefined) throw 'No Reviews found with given id'

        return reviewById
    } catch (error) {
        throw error
    }
}

const deleteReview = async (id) => {
    try {
        ErrorValidation.validateObjectId(id)
        const booksCollection = await books()
        const deletedReview = await booksCollection.updateOne(
            {},
            { $pull: { reviews: { _id: ObjectId(id) } } }
        )

        if (!deletedReview.modifiedCount)
            throw 'Could not find review with provided id'

        return { reviewId: id, deleted: true }
    } catch (error) {
        throw error
    }
}

module.exports = {
    getReviewsByBooksId,
    createReview,
    getReviewsById,
    deleteReview,
}
