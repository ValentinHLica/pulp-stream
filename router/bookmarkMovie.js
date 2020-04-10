const express = require("express");
const router = express.Router();

// Portect Route
const { protect } = require("../middleware/auth");

// Bookmark Controller
const {
  getBookmarks,
  postBookmark,
  deleteBookmark,
} = require("../controller/bookmarkMovies");

router.get("/", protect, getBookmarks);
router.post("/", protect, postBookmark);
router.delete("/:id", protect, deleteBookmark);

module.exports = router;
