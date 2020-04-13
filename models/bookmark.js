const mongoose = require("mongoose");

const BookmarkSchema = new mongoose.Schema({
  movieCode: {
    type: Number,
    required: [true, "Bookmarked Movie needs to have id"],
    unique: true,
  },
  title: {
    type: String,
    required: [true, "Please add a movie title"],
  },
  year: {
    type: Number,
    required: [true, "Please add a movie year"],
  },
  rating: {
    type: Number,
    required: [true, "Please add movie rating"],
  },
  genres: {
    type: Array,
    required: [true, "Please add movie genres"],
  },
  language: {
    type: String,
    required: [true, "Please add a movie language"],
  },
  cover: {
    type: String,
    required: [true, "Please add a movie cover"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Please add user id"],
  },
});

module.exports = mongoose.model("Bookmark", BookmarkSchema);
