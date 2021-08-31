const bookRoutes = require('./books')
const reviewRoutes = require('./reviews')

const routeConstructor = (app) => {
    app.use('/books', bookRoutes)
    app.use('/reviews', reviewRoutes)

    app.use('*', (_, res) => res.status(404).json('Page not found!'))
}

module.exports = routeConstructor
