const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/connectDb");
const ErrorHandler = require("./middleware/ErrorHandler");
const cookieParser = require("cookie-parser");

dotenv.config({ path: "./config/config.env" });
const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cookieParser());
connectDB();

// Cors
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Routes
const getMovie = require("./router/getMovie");
const mainPage = require("./router/mainPage");
const search = require("./router/search");
const auth = require("./router/auth");
const bookmark = require("./router/bookmarkMovie");

app.use("/movie", getMovie);
app.use("/main", mainPage);
app.use("/search", search);
app.use("/bookmark", bookmark);
app.use("/auth", auth);

// ErrorHandler
app.use(ErrorHandler);

app.listen(PORT);
