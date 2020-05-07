const User = require("../models/user");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

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

// @desc       Forgot Password
// @route      POST /auth/forgotpassword
// @access     Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return next({
        name: "CostumError",
        message: "User does not exist",
        statusCode: 400,
      });
    }

    const forgotPasswordToken = user.forgotPasswordMethod();
    await user.save({ validateBeforeSave: false });

    await sendEmail({
      email: req.body.email,
      subject: "Reset Password",
      text: `https://bashvtini.github.io/pulp-ui/#/resetpassword/${forgotPasswordToken}`,
    });

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

// @desc       Reset Password
// @route      PUT /auth/resetpassword/:resettoken
// @access     Public
exports.resetPassword = async (req, res, next) => {
  try {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.resettoken)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gte: Date.now() },
    });

    if (!user) {
      return next({
        name: "CostumError",
        message: "Invalide Token",
        statusCode: 400,
      });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendToken(res, 200, user);
  } catch (error) {
    next(error);
  }
};

// @desc       Check Reset Password Token
// @route      PUT /auth/checkresetpassword/:resettoken
// @access     Public
exports.checkResetPasswordToken = async (req, res, next) => {
  try {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.resettoken)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gte: Date.now() },
    });

    if (!user) {
      return next({
        name: "CostumError",
        message: "Invalide Token",
        statusCode: 400,
      });
    }

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

// @desc       Get User Details
// @route      GET /auth/user
// @access     Private
exports.getUserDetail = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc       Edit User Details
// @route      PUT /auth/user/detail
// @access     Private
exports.updateUserDetails = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { username: req.body.username, email: req.body.email },
      { runValidators: true, new: true }
    );

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc       Change Password
// @route      PUT /auth/changepassword
// @access     Private
exports.changePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("+password");

    const matchPassword = await user.matchPassword(req.body.currentPassword);

    if (!matchPassword) {
      return next({
        name: "CostumError",
        message: "Wrong Password",
        statusCode: 401,
      });
    }

    if (req.body.newPassword.length <= 6) {
      return next({
        name: "CostumError",
        message: "Please provide a password longer than 6 characters",
        statusCode: 400,
      });
    }

    user.password = req.body.newPassword;
    user.save();

    sendToken(res, 200, user);
  } catch (error) {
    next(error);
  }
};
