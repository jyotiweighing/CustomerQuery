const express = require("express");
const router = express.Router();
const {
  getStaff,
  addStaff,
  updateStaff,
  deleteStaff,
  getstafftask
} = require("../controllers/staffController");

router.get("/getstaff", getStaff);
router.post("/addstaff", addStaff);
router.put("/update/:id", updateStaff);
router.delete("/delete/:id", deleteStaff);
router.get("/getstafftask", getstafftask);


module.exports = router;
