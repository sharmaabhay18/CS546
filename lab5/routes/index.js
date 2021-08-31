const showRoutes = require("./shows")
const aboutRoutes = require("./about")

const routesConfiguration = app => {
  app.use("/shows", showRoutes)
  app.use("/aboutme", aboutRoutes)

  app.use("*", (_, res) => {
    res.status(404).json({ error: "Page Not found" })
  })
}

module.exports = routesConfiguration
