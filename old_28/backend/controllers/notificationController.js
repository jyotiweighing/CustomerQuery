const Notification = require('../models/Notification');
const Task = require('../models/Task');

exports.getNotifications = async (req, res) => {
  try {
    const { staffId } = req.params;

    const filter = staffId ? { staffId: staffId.toString() } : {};
    const notifications = await Notification.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    console.error("Error in getNotifications:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;

    await Notification.findByIdAndUpdate(id, { read: true });
    const updatedNotification = await Notification.findById(id);
    const notifications = await Notification.find({ staffId: updatedNotification.staffId.toString() }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    console.error("Error in markNotificationRead:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.markAllNotificationsRead = async (req, res) => {
  try {
    const { staffId } = req.params;

    await Notification.updateMany({ staffId: staffId.toString(), read: false }, { read: true });
    const notifications = await Notification.find({ staffId: staffId.toString() }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    console.error("Error in markAllNotificationsRead:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.generateDueDateAlerts = async (req, res) => {
  try {
    const now = new Date();

    // Today Range
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);

    // Tomorrow Range
    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);
    const tomorrowEnd = new Date(todayEnd);
    tomorrowEnd.setDate(tomorrowEnd.getDate() + 1);

    let createdCount = 0;

    // -------------------------------------------------------------
    // 1. DUE TOMORROW ALERTS
    // -------------------------------------------------------------
    const dueTomorrowTasks = await Task.find({
      dueDate: { $gte: tomorrowStart, $lte: tomorrowEnd },
      status: { $nin: ['Completed', 'Resolved'] },
    });

    for (const task of dueTomorrowTasks) {
      const assignedStaffId = task.assignedStaff?.staffId || task.assignedStaff;
      if (!assignedStaffId) continue;

      const staffStr = assignedStaffId.toString();
      const taskStr = task._id.toString();

      const existingAlert = await Notification.findOne({
        staffId: staffStr,
        taskId: taskStr,
        type: 'due',
      });

      if (!existingAlert) {
        await Notification.create({
          staffId: staffStr,
          taskId: taskStr,
          title: 'Task Due Tomorrow',
          message: `Reminder: Task "${task.title || 'Assigned Task'}" is due tomorrow!`,
          type: 'due',
          read: false,
        });
        createdCount++;
      }
    }

    // -------------------------------------------------------------
    // 2. DUE TODAY ALERTS
    // -------------------------------------------------------------
    const dueTodayTasks = await Task.find({
      dueDate: { $gte: todayStart, $lte: todayEnd },
      status: { $nin: ['Completed', 'Resolved'] },
    });

    for (const task of dueTodayTasks) {
      const assignedStaffId = task.assignedStaff?.staffId || task.assignedStaff;
      if (!assignedStaffId) continue;

      const staffStr = assignedStaffId.toString();
      const taskStr = task._id.toString();

      // Check if alert already sent today
      const existingAlert = await Notification.findOne({
        staffId: staffStr,
        taskId: taskStr,
        type: 'due',
        createdAt: { $gte: todayStart, $lte: todayEnd }
      });

      if (!existingAlert) {
        await Notification.create({
          staffId: staffStr,
          taskId: taskStr,
          title: 'Task Due Today',
          message: `Urgent: Task "${task.title || 'Assigned Task'}" is due today!`,
          type: 'due',
          read: false,
        });
        createdCount++;
      }
    }

    // -------------------------------------------------------------
    // 3. OVERDUE ALERTS (Daily notification for past due tasks)
    // -------------------------------------------------------------
    const overdueTasks = await Task.find({
      dueDate: { $lt: todayStart },
      status: { $nin: ['Completed', 'Resolved'] },
    });

    for (const task of overdueTasks) {
      const assignedStaffId = task.assignedStaff?.staffId || task.assignedStaff;
      if (!assignedStaffId) continue;

      const staffStr = assignedStaffId.toString();
      const taskStr = task._id.toString();

      // Ensure 1 overdue alert per day only
      const existingAlertToday = await Notification.findOne({
        staffId: staffStr,
        taskId: taskStr,
        type: 'overdue',
        createdAt: { $gte: todayStart, $lte: todayEnd },
      });

      if (!existingAlertToday) {
        const daysOverdue = Math.floor((todayStart - new Date(task.dueDate)) / (1000 * 60 * 60 * 24));
        
        await Notification.create({
          staffId: staffStr,
          taskId: taskStr,
          title: 'Task Overdue!',
          message: `Warning: Task "${task.title || 'Assigned Task'}" is overdue by ${daysOverdue} day(s). Please complete it as soon as possible.`,
          type: 'overdue',
          read: false,
        });
        createdCount++;
      }
    }

    return res.status(200).json({
      success: true,
      message: `Generated ${createdCount} notification alert(s).`,
    });
  } catch (error) {
    console.error("Error in generateDueDateAlerts:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
// exports.generateDueDateAlerts = async (req, res) => {
//   try {
//     const tomorrowStart = new Date();
//     tomorrowStart.setDate(tomorrowStart.getDate() + 1);
//     tomorrowStart.setHours(0, 0, 0, 0);

//     const tomorrowEnd = new Date(tomorrowStart);
//     tomorrowEnd.setHours(23, 59, 59, 999);

//     const upcomingTasks = await Task.find({
//       dueDate: { $gte: tomorrowStart, $lte: tomorrowEnd },
//       status: { $nin: ['Completed', 'Resolved'] },
//     });

//     let createdCount = 0;

//     for (const task of upcomingTasks) {
//       const assignedStaffId = task.assignedStaff?.staffId || task.assignedStaff;

//       if (assignedStaffId) {
//         const staffStr = assignedStaffId.toString();
//         const taskStr = task._id.toString();

//         const existingAlert = await Notification.findOne({
//           staffId: staffStr,
//           taskId: taskStr,
//           type: 'due',
//         });

//         if (!existingAlert) {
//           await Notification.create({
//             staffId: staffStr,
//             taskId: taskStr,
//             title: 'Task Due Tomorrow',
//             message: `Reminder: Task "${task.title || 'Assigned Task'}" is due tomorrow!`,
//             type: 'due',
//             read: false,
//           });
//           createdCount++;
//         }
//       }
//     }

//     return res.status(200).json({
//       success: true,
//       message: `Generated ${createdCount} due date alert(s).`,
//     });
//   } catch (error) {
//     console.error("Error in generateDueDateAlerts:", error);
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };