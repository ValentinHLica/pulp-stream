const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.protect = async (req, res, next) => {
  try {
    let token;

    const auth = req.headers.authorization;

    if (auth && auth.startsWith("Bearer")) {
      token = auth.split(" ")[1];
    }

    if (!token) {
      return next({
        name: "CostumError",
        message: "No Authorization",
        statusCode: 403,
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return next({
          name: "CostumError",
          message: "Invalide Token",
          statusCode: 400,
        });
      } else {
        req.user = await User.findById(decoded.id);
        next();
      }
    });
  } catch (error) {
    next(error);
  }
};
