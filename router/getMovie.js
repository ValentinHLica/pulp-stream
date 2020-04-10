const express = require("express");
const router = express.Router();

// Get Movie Controller
const { getMovie } = require("../controller/getMovie");

router.get("/:id", getMovie);

module.exports = router;
