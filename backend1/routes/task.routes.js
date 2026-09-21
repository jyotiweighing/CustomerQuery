// const router=require("express").Router();
// const taskController=require("../controllers/task.controller");
// const multer = require("multer");
// const storage = multer.memoryStorage();
// const upload = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, 
// });

// router.post("/create",taskController.createTask);
// router.get("/getstafftask/:staffId", taskController.getTasksByStaff);
// router.get("/:taskId", taskController.fetchTaskById);
// router.patch("/:taskId/status", taskController.updateTaskStatus);
// router.patch("/:taskId/progress", taskController.updateTaskProgress);
// router.post("/:taskId/remark", taskController.addTaskRemark);
// router.post("/:taskId/file", upload.single('file'), taskController.uploadTaskFile);

// router.post("/:taskId/files", upload.single('file'), taskController.uploadTaskFile);

// router.get('/monthly/:staffId', taskController.getMonthlyPerformance);
// router.get('/weekly/:staffId', taskController.getWeeklyActivity);
// router.get('/reports/:staffId', taskController.getReports);

// module.exports=router;

const router = require("express").Router();
const taskController = require("../controllers/task.controller");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post("/create", taskController.createTask);

// GET /task  — bulk fetch ALL tasks (used by the Installations page
// to map installationId -> task without one request per row).
// Supports optional ?status=&priority=&staffId= query filters.
router.get("/", taskController.getAllTasks);

// GET /task/by-installation/:installationId — fetch the task linked
// to a specific installation (used by the Installation detail modal).
router.get("/by-installation/:installationId", taskController.getTaskByInstallation);

router.get("/getstafftask/:staffId", taskController.getTasksByStaff);
router.get("/:taskId", taskController.fetchTaskById);
router.patch("/:taskId/status", taskController.updateTaskStatus);
router.patch("/:taskId/progress", taskController.updateTaskProgress);
router.post("/:taskId/remark", taskController.addTaskRemark);
router.post("/:taskId/file", upload.single("file"), taskController.uploadTaskFile);

router.post("/:taskId/files", upload.single("file"), taskController.uploadTaskFile);

router.get("/monthly/:staffId", taskController.getMonthlyPerformance);
router.get("/weekly/:staffId", taskController.getWeeklyActivity);
router.get("/reports/:staffId", taskController.getReports);

module.exports = router;