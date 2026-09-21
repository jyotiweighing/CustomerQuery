const router = require("express").Router();
const multer = require("multer");
const userController = require("../controllers/user.controller");
const auth = require("../middleware/auth.middleware");
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.get("/profile", auth, userController.getProfile);
router.put(
  "/profile",
  auth,
  upload.single("image"),
  userController.updateProfile,
);
router.put("/change-password", auth, userController.changePassword);
router.put("/staff-change-password", auth, userController.staffchangePassword);

module.exports = router;
