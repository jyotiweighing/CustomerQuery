const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');


router.get('/analytics', reportController.getReportsAnalytics);
router.get('/getDashboardData',reportController.getDashboardStats);
module.exports = router;