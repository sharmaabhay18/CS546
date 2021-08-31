const express = require('express')
const router = express.Router()
const { books } = require('../data')
const ErrorValidation = require('../errorValidation')

const validateKeys = (bookInfo) => {
    for (let key in bookInfo) {
        if (
            key != 'title' &&
            key != 'author' &&
            key != 'genre' &&
            key != 'datePublished' &&
            key != 'summary'
        ) {
            throw `${key} is not a valid argument`
        }
    }

    for (let k in bookInfo?.author) {
        if (k != 'authorFirstName' && k != 'authorLastName') {
            throw `${k} is not a valid argument`
        }
    }
}

router.get('/', async (_, res) => {
    try {
        const booksPayload = await books.allBooks()
        res.status(200).json(booksPayload)
    } catch (error) {
        res.status(500).json({ message: `Something went wrong ${error}` })
    }
})

router.post('/', async (req, res) => {
    const bookInfo = req.body
    try {
        ErrorValidation.exeCreateErrorCheck(bookInfo)
    } catch (error) {
        return res.status(400).json({ message: error })
    }

    try {
        validateKeys(bookInfo)

        const unquieGenrePayload = [
            ...new Set(bookInfo?.genre.map((item) => item)),
        ]
        const finalBooks = { ...bookInfo, genre: unquieGenrePayload }
        const booksPayload = await books.create(finalBooks)
        res.status(200).json(booksPayload)
    } catch (error) {
        res.status(400).json({ message: error })
    }
})

router.get('/:id', async (req, res) => {
    const id = req.params?.id
    try {
        ErrorValidation.validateObjectId(id)
    } catch (error) {
        return res.status(400).json({ message: error })
    }

    try {
        const booksPayload = await books.getBookById(id)
        res.status(200).json(booksPayload)
    } catch (error) {
        res.status(404).json({ message: error })
    }
})

router.put('/:id', async (req, res) => {
    const id = req.params?.id
    const bookInfo = req.body

    try {
        validateKeys(bookInfo)
        ErrorValidation.validateObjectId(id)
        ErrorValidation.exeCreateErrorCheck(bookInfo)
    } catch (error) {
        return res.status(400).json({ message: error })
    }

    let retrievedBook
    try {
        retrievedBook = await books.getBookById(id)
    } catch (error) {
        return res.status(404).json({ message: error })
    }

    try {
        const unquieGenrePayload = [
            ...new Set(bookInfo?.genre.map((item) => item)),
        ]
        const dateElement = bookInfo?.datePublished.split('/')

        const newDatePublished = new Date(
            dateElement[2],
            dateElement[0] - 1,
            dateElement[1]
        )

        const updatedBook = {
            title: bookInfo?.title,
            author: bookInfo?.author,
            genre: unquieGenrePayload,
            datePublished: newDatePublished,
            summary: bookInfo?.summary,
            reviews: retrievedBook?.reviews,
        }

        const booksPayload = await books.update(id, updatedBook)
        res.status(200).json(booksPayload)
    } catch (error) {
        res.status(500).json({ message: `Something went wrong ${error}` })
    }
})

router.patch('/:id', async (req, res) => {
    const id = req.params?.id
    const bookInfo = req.body
    let updatedBookPayload = {}

    let existBook

    try {
        ErrorValidation.validateObjectId(id)
    } catch (error) {
        return res.status(400).json({ message: error })
    }

    try {
        existBook = await books.getBookById(id)
    } catch (error) {
        return res.status(404).json({ message: error })
    }

    try {
        validateKeys(bookInfo)
        if (bookInfo?.title) {
            ErrorValidation.titleErrorCheck(bookInfo?.title)
            updatedBookPayload.title = bookInfo?.title
        }

        if (bookInfo?.author?.authorFirstName) {
            ErrorValidation.authorFirstNameErrorCheck(
                bookInfo?.author?.authorFirstName
            )
            updatedBookPayload.author = {
                authorLastName:
                    bookInfo?.author?.authorLastName === undefined &&
                    existBook?.author?.authorLastName,
                authorFirstName: bookInfo?.author?.authorFirstName,
            }
        }

        if (bookInfo?.author?.authorLastName) {
            ErrorValidation.authorLastNameErrorCheck(
                bookInfo?.author?.authorLastName
            )
            updatedBookPayload.author = {
                authorFirstName:
                    bookInfo?.author?.authorFirstName === undefined
                        ? existBook?.author?.authorFirstName
                        : bookInfo?.author?.authorFirstName,
                authorLastName: bookInfo?.author?.authorLastName,
            }
        }

        if (bookInfo?.genre) {
            ErrorValidation.genreErrorCheck(bookInfo?.genre)
            const existGenre = existBook.genre
            const newGenre = bookInfo.genre
            const genrePayload = [...existGenre, ...newGenre]

            const unquieGenrePayload = [
                ...new Set(genrePayload?.map((item) => item)),
            ]
            updatedBookPayload.genre = unquieGenrePayload
        }

        if (bookInfo?.datePublished) {
            ErrorValidation.dateErrorCheck(bookInfo?.datePublished)
            const dateElement = bookInfo?.datePublished.split('/')

            const newDatePublished = new Date(
                dateElement[2],
                dateElement[0] - 1,
                dateElement[1]
            )

            updatedBookPayload.datePublished = newDatePublished
        }

        if (bookInfo?.summary) {
            ErrorValidation.summaryErrorCheck(bookInfo?.summary)
            updatedBookPayload.summary = bookInfo?.summary
        }
    } catch (error) {
        return res.status(400).json({ message: error })
    }

    if (Object.keys(updatedBookPayload).length !== 0) {
        try {
            const booksPayload = await books.update(id, updatedBookPayload)
            res.status(200).json(booksPayload)
        } catch (error) {
            res.status(500).json({ message: `Something went wrong ${error}` })
        }
    } else {
        res.status(400).json({
            error:
                'Value of books has not been changed as no input was provided.',
        })
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
        await books.getBookById(id)
    } catch (error) {
        return res.status(404).json({ message: error })
    }

    try {
        const removedBook = await books.removeBook(id)
        res.status(200).json(removedBook)
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

module.exports = router
