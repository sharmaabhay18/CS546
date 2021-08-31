const express = require("express")
const router = express.Router()

router.get("", async (_, res) => {
  try {
    const aboutPayload = {
      name: "Abhay Sharma",
      cwid: "10459806",
      biography:
        "I am Abhay Sharma, a Software Engineer 👨‍💻 by profession (\n). I am currently based in Hoboken, New Jersey you will find me mostly playing video games 🎮 during weekends, or get high on caffeine ☕, or trekking 🚶‍♂️ somewhere midst nowhere.",
      favoriteShows: ["The Big Bang Theory", "Two and a half man", "Friends"],
    }
    res.json(aboutPayload)
  } catch (error) {
    res.status(404).json({ message: error })
  }
})

module.exports = router
