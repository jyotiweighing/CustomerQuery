const express = require("express");
const router = express.Router();
const installationController = require("../controllers/installationController");

router.put("/:id", installationController.updateInstallation);
router.post("/create", installationController.createInstallation);
router.get("/getinstall", installationController.getInstallations);
module.exports = router;