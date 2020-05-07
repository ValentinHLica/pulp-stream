const axios = require("axios");

// @desc       Get Movie
// @route      GET /movie/:id
// @access     Public
exports.getMovie = async (req, res, next) => {
  try {
    let data = {};

    const movie = await axios.get(
      `${process.env.URL}/movie_details.json?movie_id=${req.params.id}&with_images=true&with_cast=true`
    );

    if (movie.data.data.movie.id !== 0) {
      data = {
        stream: "https://api.hdv.fun/embed/" + movie.data.data.movie.imdb_code,
        ...movie.data.data.movie,
      };
    } else {
      return next({
        name: "CostumError",
        message: "Movie does not exist",
        statusCode: 404,
      });
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};
