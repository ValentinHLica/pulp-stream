const Bookmark = require("../models/bookmark");

// @desc       GET Bookmarked Movies
// @route      GET /bookmark
// @access     Private
exports.getBookmarks = async (req, res, next) => {
  try {
    let query;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Bookmark.countDocuments({ user: req.user._id });
    const paggination = { limit, count: total };

    if (startIndex > 0) {
      paggination.prevPage = page - 1;
    }

    if (total > endIndex) {
      paggination.nextPage = page + 1;
    }

    query = Bookmark.find({ user: req.user.id });

    query = query.skip(startIndex).limit(limit);

    const data = await query;

    res.status(200).json({
      success: true,
      paggination,
      data,
    });
  } catch (error) {
    next(error);
  }
};

// @desc       POST Bookmarked Movies
// @route      POST /bookmark
// @access     Private
exports.postBookmark = async (req, res, next) => {
  try {
    const user = await Bookmark.findOne({
      user: req.user._id,
      movieCode: req.body.movieCode,
    });

    if (user) {
      return next({
        name: "CostumError",
        message: "Movie is Bookmarked",
        statusCode: 403,
      });
    }

    const data = await Bookmark.create(req.body);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

// @desc       Check if Movie is Bookmarked
// @route      POST /bookmark/check
// @access     Private
exports.bookmarkCheck = async (req, res, next) => {
  try {
    const user = await Bookmark.findOne({
      user: req.user._id,
      movieCode: req.body.movieCode,
    });

    let data = false;

    if (user) {
      data = true;
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

// @desc       DELETE Bookmarked Movie
// @route      DELETE /bookmark/delete
// @access     Private
exports.deleteBookmark = async (req, res, next) => {
  try {
    const data = await Bookmark.findOne({
      user: req.user._id,
      movieCode: req.body.movieCode,
    });

    if (!data) {
      return next({
        name: "CastError",
        statusCode: 404,
        message: "Resource does not exist",
      });
    }

    data.remove();

    res.status(200).json({
      success: true,
      data: "Resource was deleted successfullys",
    });
  } catch (error) {
    next(error);
  }
};
