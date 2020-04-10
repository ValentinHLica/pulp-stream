const User = require("../models/user");

// @desc       Register User
// @route      POST /auth/register
// @access     Public
exports.register = async (req, res, next) => {
  try {
    const user = await User.create(req.body);

    sendToken(res, 201, user);
  } catch (error) {
    next(error);
  }
};

// @desc       Login User
// @route      POST /auth/login
// @access     Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email && !password) {
      return next({
        name: "CostumError",
        message: "Please provide and correct email and password",
        statusCode: 403,
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next({
        name: "CostumError",
        message: "Invalide Credentials",
        statusCode: 403,
      });
    }

    const matchPassword = await user.matchPassword(password);

    if (!matchPassword) {
      return next({
        name: "CostumError",
        message: "Invalide Credentials",
        statusCode: 403,
      });
    }

    sendToken(res, 201, user);
  } catch (error) {
    next(error);
  }
};

const sendToken = (res, statusCode, user) => {
  const token = user.getSignedToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};
