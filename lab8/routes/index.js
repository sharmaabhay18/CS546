const searchRoutes = require('./search')
const showsRoutes = require('./shows')
const homeRoutes = require('./home')

const routerConfiguration = (app) => {
    app.use('/', homeRoutes)
    app.use('/search', searchRoutes)
    app.use('/shows', showsRoutes)

    app.use('*', (_, res) =>
        res
            .status(404)
            .render('error', {
                title: 'Page not found',
                errorMessage: 'Page not found!',
            })
    )
}

module.exports = routerConfiguration
