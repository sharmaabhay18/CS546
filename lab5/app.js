const express = require("express")
app = express()
const routesConfiguration = require("./routes")

routesConfiguration(app)

app.listen(3000, () => {
  console.log("Server started at port 3000")
  console.log("Your routes will be running on http://localhost:3000")
})
