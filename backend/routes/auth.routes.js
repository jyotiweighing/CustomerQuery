const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/loginstaff",authController.loginstaff)
router.post("/forgot-password", authController.forgotPassword);
router.post("/verify-otp",authController.verify)
router.post("/resend-otp", authController.resendOtp);
router.post("/reset-password", authController.resetPassword);
//staff
router.post("/staff-forgot-password", authController.staffforgotPassword);
router.post("/staff-verify-otp",authController.staffverify)
router.post("/staff-resend-otp", authController.staffresendOtp);
router.post("/staff-reset-password", authController.staffresetPassword);
module.exports = router;