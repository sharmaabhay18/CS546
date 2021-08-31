const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const users = require('../users')

router.get('/', async (req, res) => {
    if (!req.session.user) {
        return res.render('home')
    }
    return res.status(403).redirect('/private')
})

router.post('/login', async (req, res) => {
    if (req.session.user) {
        return res.redirect('/private')
    }
    const { username, password } = req.body
    const [presentUser] = users.filter(
        (u) => u?.username?.toLowerCase() === username?.toLowerCase()
    )

    if (!presentUser) {
        return res.status(401).render('home', {
            error: 'Username or password incorrect. Please try again!',
        })
    }

    let match = await bcrypt.compare(password, presentUser.hashedPassword)

    if (!match) {
        return res.status(401).render('home', {
            error: 'Username or password incorrect. Please try again!',
        })
    }

    req.session.user = presentUser
    res.redirect('/private')
})

router.get('/logout', async (req, res) => {
    req.session.destroy((err) => {
        if (!err) {
            return res.render('logout')
        }
    })
})

module.exports = router
