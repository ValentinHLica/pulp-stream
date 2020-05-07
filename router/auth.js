const express = require("express");
const router = express.Router();

// Auth Controller
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  getUserDetail,
  updateUserDetails,
  changePassword,
  checkResetPasswordToken,
} = require("../controller/auth");

// Route Protection
const { protect } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resettoken", resetPassword);
router.get("/checkresetpassword/:resettoken", checkResetPasswordToken);
router.get("/user", protect, getUserDetail);
router.put("/user/detail", protect, updateUserDetails);
router.put("/changepassword", protect, changePassword);

module.exports = router;
