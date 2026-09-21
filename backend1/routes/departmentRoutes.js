const express = require("express");
const router = express.Router();
const {
  getDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment,
} = require("../controllers/departmentController");


router.get("/getdepartments", getDepartments);
router.post("/adddepartments", addDepartment);
router.put("/updatedepartments/:id", updateDepartment);
router.delete("/deletedepartments/:id", deleteDepartment);

module.exports = router;
