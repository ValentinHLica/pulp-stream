const express = require("express");
const router = express.Router();

// Portect Route
const { protect } = require("../middleware/auth");

// Bookmark Controller
const {
  bookmarkCheck,
  getBookmarks,
  postBookmark,
  deleteBookmark,
} = require("../controller/bookmarkMovies");

router.get("/", protect, getBookmarks);
router.post("/", protect, postBookmark);
router.post("/check", protect, bookmarkCheck);
router.post("/delete", protect, deleteBookmark);

module.exports = router;
