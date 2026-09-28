const router = require("express").Router();
const controller = require("../controllers/customerController");
const auth = require("../middleware/auth.middleware");

router.post("/register", controller.registerCustomer);
router.post("/login", controller.loginCustomer);
router.post("/forgot-password", controller.forgotPassword);
router.post("/verify-otp", controller.verifyOtp);
router.post("/resend-otp", controller.resendOtp);
router.post("/reset-password", controller.resetPassword);
router.get("/me", auth, controller.getMe);
router.get("/", auth, controller.getCustomers);
module.exports = router;
