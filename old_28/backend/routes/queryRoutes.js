const router = require("express").Router();
const controller = require("../controllers/queryController");
const auth = require("../middleware/auth.middleware");

router.post("/", auth, controller.createQuery);
router.get("/my", auth, controller.getMyQueries);
router.get("/", auth, controller.getAllQueries);
router.get("/:id", auth, controller.getQueryById);
router.patch("/:id/assign-staff", auth, controller.assignQueryToStaff);
router.patch("/:id/pick", auth, controller.pickQuery);
router.post("/:id/messages", auth, controller.addMessage);
module.exports = router;
