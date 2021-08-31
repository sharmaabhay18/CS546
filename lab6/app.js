const express = require('express')
const app = express()
const routeConstructor = require('./routes')

app.use(express.json())

routeConstructor(app)

app.listen(3000, () => {
    console.log('Server started at port 3000')
})
