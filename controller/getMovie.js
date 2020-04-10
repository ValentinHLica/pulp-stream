const request = require("request");
const cheerio = require("cheerio");

// @desc       Get Movie
// @route      GET /movie/:id
// @access     Public
exports.getMovie = async (req, res, next) => {
  try {
    let data = {};

    const getYTSMovie = () => {
      return new Promise((resolve) => {
        request.get(
          `https://yts.mx/api/v2/movie_details.json?movie_id=${req.params.id}&with_images=true&with_cast=true`,
          (err, response, html) => {
            if (!err && response.statusCode == 200) {
              const movie = JSON.parse(response.body);
              if (movie.data.movie) {
                data = {
                  stream:
                    "https://api.hdv.fun/embed/" + movie.data.movie.imdb_code,
                  ...movie.data.movie,
                };
              }
            }
            resolve();
          }
        );
      });
    };

    await getYTSMovie();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};
