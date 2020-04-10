const request = require("request");

// @desc       Main Page Movies
// @route      GET /main
// @access     Public
exports.mainPage = async (req, res, next) => {
  try {
    const data = {
      popular: [],
      latest: [],
    };

    // Get Latest
    const getLatestMovies = () => {
      return new Promise((resolve) => {
        request.get(
          process.env.URL + "/list_movies.json",
          (err, response, hmtl) => {
            if (!err && response.statusCode == 200) {
              const movies = JSON.parse(response.body).data.movies;

              movies.forEach((e, index) => {
                const movie = {
                  id: e.id,
                  title: e.title_english,
                  year: e.year,
                  rating: e.rating,
                  genres: e.genres,
                  language: e.language,
                  medium_cover_image: e.medium_cover_image,
                };

                data.latest = [...data.latest, movie];
              });
            }

            resolve();
          }
        );
      });
    };

    await getLatestMovies();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};
