const express = require("express");
const router = express.Router();

// Search Controller
const { searchMoveis } = require("../controller/search");

router.get("/", searchMoveis);

module.exports = router;
