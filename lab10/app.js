const express = require('express')
const app = express()
const session = require('express-session')
const exphbs = require('express-handlebars')
const helper = require('./utils/helperFunction')

const static = express.static(__dirname + '/public')

const routeConstructor = require('./routes')

app.use('/public', static)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use(
    session({
        name: 'AuthCookie',
        secret: 'Phineas and ferb are dead',
        saveUninitialized: true,
        resave: false,
    })
)

app.use(function (req, _, next) {
    let isUserAuthenticated = req.session?.user
    let userStr = '(Non-Authenticated User)'
    if (isUserAuthenticated) {
        userStr = '(Authenticated User)'
    }
    console.log(
        '%s %s %s %s',
        `[ ${new Date().toUTCString()} ] :`,
        req.method,
        req.originalUrl,
        userStr
    )
    next()
})

app.use('/private', (req, res, next) => {
    if (!req.session.user) {
        return res.status(403).render('nonAuthenticated')
    } else {
        next()
    }
})

app.engine(
    'handlebars',
    exphbs({
        defaultLayout: 'main',
        helpers: helper,
    })
)
app.set('view engine', 'handlebars')

routeConstructor(app)

app.listen(3000, () => console.log('Server started at 3000'))
