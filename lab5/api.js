const axios = require("axios")

const getAllShows = async () => {
  try {
    const { data, status } = await axios.get("http://api.tvmaze.com/shows")
    if (status === 200) {
      return data
    } else {
      throw "TV Maze Api returned status other than 200"
    }
  } catch (error) {
    throw `Something went wrong while fetching shows. ${error}`
  }
}

const getShowById = async id => {
  try {
    const { data, status } = await axios.get(
      `http://api.tvmaze.com/shows/${id}`
    )
    if (status === 200) {
      if (data && Object.keys(data).length === 0) {
        throw "No show data is returned"
      }
      return data
    } else {
      throw "TV Maze Api returned status other than 200"
    }
  } catch (error) {
    throw `${error}`
  }
}

module.exports = {
  getAllShows,
  getShowById,
}
