const express = require("express")
const router = express.Router()
const { getAllShows, getShowById } = require("../api")

router.get("", async (_, res) => {
  try {
    const showsPayload = await getAllShows()
    res.json(showsPayload)
  } catch (error) {
    console.error(`${error}`)
    res.status(404).json({ message: error })
  }
})

router.get("/:id", async (req, res) => {
  try {
    const showId = req?.params?.id

    if (!showId) throw "Id must be provided"
    if (showId < 0) {
      return res.status(400).json({ message: "Id can not be negative" })
    }
    if (showId % 1 !== 0) {
      return res.status(400).json({ message: "Id should be a whole number" })
    }

    const showsPayload = await getShowById(showId)
    res.json(showsPayload)
  } catch (error) {
    console.error(`${error}`)
    res.status(404).json({ message: error })
  }
})

module.exports = router
