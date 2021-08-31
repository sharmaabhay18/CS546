const { ObjectId } = require('mongodb')
const mongoCollections = require('../config/mongoCollections')
const books = mongoCollections.books
const ErrorValidation = require('../errorValidation')

const getBookByObjectId = async (id) => {
    if (!id) throw 'Id is required'

    const booksCollection = await books()
    const book = await booksCollection.findOne({ _id: id })
    if (book === null) throw 'No book is present with that id'

    return book
}

const allBooks = async () => {
    try {
        const booksCollection = await books()
        const booksList = await booksCollection.find({}).toArray()

        const finalBooksPayload = booksList.map((book) => {
            return { _id: book?._id?.toString(), title: book?.title }
        })
        return finalBooksPayload
    } catch (error) {
        throw `Error while fetching data from db ${error}`
    }
}

const formattedDate = (date) => {
    let month = String(date.getMonth() + 1)
    let day = String(date.getDate())
    const year = String(date.getFullYear())

    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day

    return `${month}/${day}/${year}`
}

const create = async (bookInfo) => {
    try {
        ErrorValidation.exeCreateErrorCheck(bookInfo)
        const { title, author, genre, datePublished, summary } = bookInfo
        const dateElement = datePublished.split('/')

        const newDatePublished = new Date(
            dateElement[2],
            dateElement[0] - 1,
            dateElement[1]
        )

        const newBook = {
            title,
            author,
            genre,
            datePublished: newDatePublished,
            summary,
            reviews: [],
        }
        const booksCollection = await books()
        const bookCreated = await booksCollection.insertOne(newBook)

        if (bookCreated.insertedCount === 0) throw 'Could not add book'

        const newId = bookCreated.insertedId

        const book = await getBookByObjectId(newId)

        return {
            ...book,
            _id: book?._id?.toString(),
            datePublished: formattedDate(book?.datePublished),
        }
    } catch (error) {
        throw `Error while creating book ${error}`
    }
}

const getBookById = async (id) => {
    try {
        ErrorValidation.validateObjectId(id)
        const booksCollection = await books()

        const bookById = await booksCollection.findOne({
            _id: ObjectId(id),
        })

        if (bookById === null) throw 'No book found with given id'

        return {
            ...bookById,
            _id: bookById?._id?.toString(),
            datePublished: formattedDate(bookById?.datePublished),
        }
    } catch (error) {
        throw error
    }
}

const update = async (id, payload) => {
    try {
        ErrorValidation.validateObjectId(id)
        const booksCollection = await books()
        const updateBookPayload = await booksCollection.updateOne(
            { _id: ObjectId(id) },
            { $set: payload }
        )

        if (!updateBookPayload.matchedCount && !updateBookPayload.modifiedCount)
            throw 'Could not update book'

        return await getBookById(id)
    } catch (error) {
        throw error
    }
}

const removeBook = async (id) => {
    try {
        ErrorValidation.validateObjectId(id)
        const booksCollection = await books()
        const deletionInfo = await booksCollection.deleteOne({
            _id: ObjectId(id),
        })

        if (deletionInfo.deletedCount === 0) {
            throw `Could not delete book with id of ${id}`
        }
        return { bookId: id, deleted: true }
    } catch (error) {
        throw error
    }
}

module.exports = {
    create,
    update,
    allBooks,
    getBookById,
    removeBook,
}
