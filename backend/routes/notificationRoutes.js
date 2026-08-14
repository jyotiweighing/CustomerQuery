const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  generateDueDateAlerts,
} = require('../controllers/notificationController');

router.get('/:staffId', getNotifications);
router.patch('/read/:id', markNotificationRead);
router.patch('/read-all/:staffId', markAllNotificationsRead);
router.post('/check-due-alerts', generateDueDateAlerts);

module.exports = router;