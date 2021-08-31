const userRoutes = require('./user')
const privateRoutes = require('./private')

const routerConfiguration = (app) => {
    app.use('/private', privateRoutes)
    app.use('/', userRoutes)
    
    app.use('*', (_, res) =>
        res.status(404).render('error', {
            title: 'Page not found',
            errorMessage: 'Page not found!',
        })
    )
}

module.exports = routerConfiguration
