const { ObjectId } = require('mongodb')

const titleErrorCheck = (title) => {
    if (typeof title !== 'string' || title?.trim().length === 0)
        throw 'Title should be of type string and contains valid input'
}

const authorFirstNameErrorCheck = (authorFirstName) => {
    if (!authorFirstName) throw 'AuthorFirstName is required in author field'

    if (
        typeof authorFirstName !== 'string' ||
        authorFirstName?.trim().length === 0
    )
        throw 'AuthorFirstName should be of type string and contains valid input'
}

const authorLastNameErrorCheck = (authorLastName) => {
    if (!authorLastName) throw 'AuthorLastName is required in author field'

    if (
        typeof authorLastName !== 'string' ||
        authorLastName?.trim().length === 0
    )
        throw 'AuthorLastName should be of type string and contains valid input'
}

const authorErrorCheck = (author) => {
    if (typeof author !== 'object' || Array.isArray(author))
        throw 'Author should be of type object with authorFirstName and authorLastName'

    authorFirstNameErrorCheck(author?.authorFirstName)
    authorLastNameErrorCheck(author?.authorLastName)
}

const genreErrorCheck = (genre) => {
    if (!Array.isArray(genre)) throw 'Genre should of array type'
    if (genre.length === 0) throw 'Genre array should have at least one element'
    genre?.map((item) => {
        if (typeof item !== 'string')
            throw 'Genre elements should be of type string'
    })
}

const dateErrorCheck = (datePublished) => {
    const dateRegex = /^(?!0+\b)(0?[1-9]|1[0-2])[\/](?!0+\b)(\d{1,2})[\/](\d{4})$/

    if (typeof datePublished !== 'string' || datePublished?.trim().length === 0)
        throw 'DatePublished should be of type string and contains valid input'

    if (!dateRegex.test(datePublished))
        throw 'DatePublished should be provided in DD/MM/YYYY format with proper range'
}

const summaryErrorCheck = (summary) => {
    if (typeof summary !== 'string' || summary?.trim().length === 0)
        throw 'Summary should be of type string and contains valid input'
}

const validateObjectId = (id) => {
    if (!id) throw 'Id is required'
    if (typeof id !== 'string' || id?.trim()?.length === 0)
        throw 'Please enter a valid id'

    const parsedId = ObjectId.isValid(id)
    if (!parsedId) throw 'Id passed is not a valid object id'
}

const reviewTitleErrorCheck = (title) => {
    if (typeof title !== 'string' || title?.trim().length === 0)
        throw 'Title should be of type string and contains valid input'
}

const reviewerErrorCheck = (reviewer) => {
    if (typeof reviewer !== 'string' || reviewer?.trim().length === 0)
        throw 'Reviewer should be of type string and contains valid input'
}

const ratingErrorCheck = (rating) => {
    const ratingRegex = /^([1-5])$/

    if (typeof rating !== 'number') {
        throw 'Rating should be of type number'
    }

    if (!ratingRegex.test(rating)) {
        throw 'Rating should be in a range from 1 to 5'
    }
}

const dateOfReviewErrorCheck = (dateOfReview) => {
    const dateRegex = /^(?!0+\b)(0?[1-9]|1[0-2])[\/](?!0+\b)(\d{1,2})[\/](\d{4})$/

    if (typeof dateOfReview !== 'string' || dateOfReview?.trim().length === 0)
        throw 'DateOfReview should be of type string and contains valid input'

    if (!dateRegex.test(dateOfReview))
        throw 'DateOfReview should be provided in DD/MM/YYYY format with proper range'
}

const reviewErrorCheck = (review) => {
    if (typeof review !== 'string' || review?.trim().length === 0)
        throw 'Review should be of type string and contains valid input'
}

const exeCreateErrorCheck = ({
    title,
    author,
    genre,
    datePublished,
    summary,
}) => {
    if (!title) throw 'Title is required parameter'
    if (!author) throw 'Author is required parameter'
    if (!genre) throw 'Genre is required parameter'
    if (!datePublished) throw 'DatePublished is required parameter'
    if (!summary) throw 'Summary is required parameter'

    titleErrorCheck(title)
    authorErrorCheck(author)
    genreErrorCheck(genre)
    dateErrorCheck(datePublished)
    summaryErrorCheck(summary)
}

const exeReviewErrorCheck = ({
    title,
    reviewer,
    rating,
    dateOfReview,
    review,
}) => {
    if (!title) throw 'Title is required parameter'
    if (!reviewer) throw 'Reviewer is required parameter'
    if (!rating) throw 'Rating is required parameter'
    if (!dateOfReview) throw 'DateOfReview is required parameter'
    if (!review) throw 'Review is required parameter'

    reviewTitleErrorCheck(title)
    reviewerErrorCheck(reviewer)
    ratingErrorCheck(rating)
    dateOfReviewErrorCheck(dateOfReview)
    reviewErrorCheck(review)
}

module.exports = {
    titleErrorCheck,
    authorErrorCheck,
    genreErrorCheck,
    dateErrorCheck,
    summaryErrorCheck,
    validateObjectId,
    authorFirstNameErrorCheck,
    authorLastNameErrorCheck,
    reviewTitleErrorCheck,
    reviewerErrorCheck,
    ratingErrorCheck,
    dateOfReviewErrorCheck,
    reviewErrorCheck,
    exeCreateErrorCheck,
    exeReviewErrorCheck,
}
