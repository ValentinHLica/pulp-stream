const express = require("express");
const connectDB = require("./config/connectDb");
const ErrorHandler = require("./middleware/ErrorHandler");
const Cors = require("./middleware/cors");
const cookieParser = require("cookie-parser");

// Dev Only
// const dotenv = require("dotenv");
// dotenv.config({ path: "./config/config.env" });
//

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cookieParser());
connectDB();

// Cors
app.use(Cors);

// Routes
const getMovie = require("./router/getMovie");
const search = require("./router/search");
const auth = require("./router/auth");
const bookmark = require("./router/bookmarkMovie");

app.use("/movie", getMovie);
app.use("/search", search);
app.use("/bookmark", bookmark);
app.use("/auth", auth);

// ErrorHandler
app.use(ErrorHandler);

app.listen(PORT);
