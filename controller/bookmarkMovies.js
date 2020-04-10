const Bookmark = require("../models/bookmark");

// @desc       GET Bookmarked Movies
// @route      GET /bookmark
// @access     Private
exports.getBookmarks = async (req, res, next) => {
  try {
    const data = await Bookmark.find({ user: req.user.id });

    res.status(200).json({
      success: true,
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
    const data = await Bookmark.create(req.body);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

// @desc       DELETE Bookmarked Movie
// @route      DELETE /bookmark/:id
// @access     Private
exports.deleteBookmark = async (req, res, next) => {
  try {
    const data = await Bookmark.findById(req.params.id);

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
