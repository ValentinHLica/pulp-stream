const express = require("express");
const router = express.Router();

// Main Page Controller
const mainPage = require("../controller/mainPage");

router.get("/", mainPage.mainPage);

module.exports = router;
