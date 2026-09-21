// const Staff = require("../models/StaffModel");
// const Task = require("../models/Task");
// const cloudinary = require("../config/cloudinary");
// const streamifier = require("streamifier");

// exports.createTask = async (req, res) => {
//   try {
//     const { title, description, priority, dueDate, assignedStaff } = req.body;

//     const staff = await Staff.findById(assignedStaff);

//     if (!staff) {
//       return res.status(404).json({     
//         success: false,
//         message: "Staff not found",
//       });
//     }

//     const task = await Task.create({
//       title,
//       description,
//       priority,
//       dueDate,

//       assignedStaff: {
//         staffId: staff._id,
//         name: staff.name,
//         email: staff.email,
//         phone: staff.phone,
//         designation: staff.designation,
//         department: staff.department,
//       },
//     });

//     staff.assignedQueries += 1;
//     await staff.save();

//     res.status(201).json({
//       success: true,
//       data: task,
//     });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

// exports.getTasksByStaff = async (req, res) => {
//     console.log("staff",req.body)
//   try {
//     const { staffId } = req.params;
//     const { status } = req.query;

//     let filter = {
//       "assignedStaff.staffId": staffId
//     };

//     if (status) {
//       if (status === "Resolved") {
//         filter.status = "Resolved";
//       } else {
//         filter.status = status; 
//       }
//     }

//     const tasks = await Task.find(filter).sort({ createdAt: -1 });

//     return res.status(200).json({
//       success: true,
//       count: tasks.length,
//       data: tasks
//     });
    
//   } catch (error) {
//     console.error("Error fetching filtered tasks:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error while querying tasks schema",
//       error: error.message
//     });
//   }
// };

// exports.fetchTaskById = async (req, res) => {
//   try {
//     const { taskId } = req.params;
    
//     const task = await Task.findOne({
//       $or: [{ _id: taskId }, { taskId: taskId }]
//     });

//     if (!task) {
//       return res.status(404).json({
//         success: false,
//         message: "Task not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       data: task,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Error fetching task",
//       error: error.message,
//     });
//   }
// };

// // exports.updateTaskStatus = async (req, res) => {
// //   console.log("updateTaskStatus", req.body)
// //   try {
// //     const { taskId } = req.params;
// //     const { status } = req.body; 

// //     const task = await Task.findByIdAndUpdate(
// //       taskId,
// //       { status },
// //       { new: true, runValidators: true }
// //     );

// //     if (!task) {
// //       return res.status(404).json({ success: false, message: "Task not found" });
// //     }

// //     return res.status(200).json({
// //       success: true,
// //       message: "Status updated successfully",
// //       data: task,
// //     });
// //   } catch (error) {
// //     return res.status(500).json({ success: false, message: error.message });
// //   }
// // };

// exports.updateTaskStatus = async (req, res) => {
//   console.log("updateTaskStatus received body:", req.body);
//   try {
//     const { taskId } = req.params;
//     const { status } = req.body; 

//     // 1. Frontend se aane wali progress nikalen
//     let progress = req.body.progress;

//     // 2. Safety Check / Fallback: Agar frontend se progress na bhi aaye, toh backend khud set kar lega
//     if (progress === undefined || progress === null) {
//       if (status === 'In Progress') {
//         progress = 10;
//       } else if (status === 'Completed' || status === 'Resolved') {
//         progress = 100;
//       } else if (status === 'Pending') {
//         progress = 0;
//       }
//     }

//     // 3. Database mein status aur progress dono update karein
//     const task = await Task.findByIdAndUpdate(
//       taskId,
//       { 
//         status, 
//         progress // DB mein progress column update ho jayega
//       },
//       { new: true, runValidators: true }
//     );

//     if (!task) {
//       return res.status(404).json({ success: false, message: "Task not found" });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Status and progress updated successfully",
//       data: task,
//     });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

// exports.updateTaskProgress = async (req, res) => {
//   try {
//     const { taskId } = req.params;
//     const { progress } = req.body; // e.g., 50 (percentage)

//     const task = await Task.findByIdAndUpdate(
//       taskId,
//       { progress },
//       { new: true }
//     );

//     if (!task) {
//       return res.status(404).json({ success: false, message: "Task not found" });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Progress updated successfully",
//       data: task,
//     });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

// exports.getMonthlyPerformance = async (req, res) => {
//   try {
//     const { staffId } = req.params;
//     const matchStage = staffId ? { "assignedStaff.staffId": staffId } : {};

//     const monthlyData = await Task.aggregate([
//       { $match: matchStage },
//       {
//         $group: {
//           _id: { $month: "$createdAt" },
//           assigned: { $sum: 1 },
//           completed: {
//             $sum: {
//               $cond: [
//                 { $in: ["$status", ["Completed", "Resolved"]] },
//                 1,
//                 0
//               ]
//             }
//           }
//         }
//       },
//       { $sort: { "_id": 1 } }
//     ]);

//     const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

//     const formattedData = monthlyData.map(item => ({
//       month: monthNames[item._id - 1],
//       assigned: item.assigned,
//       completed: item.completed
//     }));

//     return res.status(200).json({
//       success: true,
//       data: formattedData
//     });
//   } catch (error) {
//     console.error("Error in getMonthlyPerformance:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Server Error fetching monthly performance",
//       error: error.message
//     });
//   }
// };

// exports.getWeeklyActivity = async (req, res) => {
//   try {
//     const { staffId } = req.params;

//     // Calculate start of current week (Monday)
//     const now = new Date();
//     const dayOfWeek = now.getDay();
//     const distanceToMonday = (dayOfWeek + 6) % 7;
//     const startOfWeek = new Date(now);
//     startOfWeek.setDate(now.getDate() - distanceToMonday);
//     startOfWeek.setHours(0, 0, 0, 0);

//     const filter = {
//       createdAt: { $gte: startOfWeek }
//     };

//     if (staffId) {
//       filter["assignedStaff.staffId"] = staffId;
//     }

//     const weeklyTasks = await Task.find(filter);

//     const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
//     const dayCounts = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };

//     weeklyTasks.forEach(task => {
//       const taskDay = new Date(task.createdAt).getDay();
//       // Adjust JS Sunday (0) to index 6
//       const dayName = days[(taskDay + 6) % 7];
//       if (dayCounts[dayName] !== undefined) {
//         dayCounts[dayName]++;
//       }
//     });

//     const formattedData = days.map(day => ({
//       day,
//       tasks: dayCounts[day]
//     }));

//     return res.status(200).json({
//       success: true,
//       data: formattedData
//     });
//   } catch (error) {
//     console.error("Error in getWeeklyActivity:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Server Error fetching weekly activity",
//       error: error.message
//     });
//   }
// };

// exports.getReports = async (req, res) => {
//   try {
//     const { staffId } = req.params;
//     const filter = staffId ? { "assignedStaff.staffId": staffId } : {};

//     const allTasks = await Task.find(filter).sort({ createdAt: -1 });

//     // Separate Installation vs Query tasks
//     const installationReports = allTasks.filter(
//       t => t.installationId || t.title?.toLowerCase().includes('installation')
//     );

//     const queryReports = allTasks.filter(
//       t => !t.installationId && !t.title?.toLowerCase().includes('installation')
//     );

//     // Calculate monthly totals for the reports bar chart
//     const monthlyData = await Task.aggregate([
//       { $match: filter },
//       {
//         $group: {
//           _id: { $month: "$createdAt" },
//           completed: {
//             $sum: { $cond: [{ $in: ["$status", ["Completed", "Resolved"]] }, 1, 0] }
//           },
//           pending: {
//             $sum: { $cond: [{ $in: ["$status", ["Pending", "In Progress"]] }, 1, 0] }
//           }
//         }
//       },
//       { $sort: { "_id": 1 } }
//     ]);

//     const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
//     const monthlyCompleted = monthlyData.map(item => ({
//       month: monthNames[item._id - 1],
//       completed: item.completed,
//       pending: item.pending
//     }));

//     return res.status(200).json({
//       success: true,
//       data: {
//         installationReports,
//         queryReports,
//         monthlyCompleted
//       }
//     });
//   } catch (error) {
//     console.error("Error in getReports:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Server Error fetching reports",
//       error: error.message
//     });
//   }
// };

// exports.addTaskRemark = async (req, res) => {
//   console.log(req.body, "remark");
//   try {
//     const { taskId } = req.params;
    
//     // 1. Text & Author extract karein
//     const text = req.body.text || req.body.remark?.text;
//     const author = req.body.author || req.body.remark?.author || 'Staff';

//     if (!text) {
//       return res.status(400).json({ 
//         success: false, 
//         message: "Remark text is required" 
//       });
//     }

//     // 2. Task find karein
//     const task = await Task.findOne({
//       $or: [{ _id: taskId }, { taskId: taskId }]
//     });

//     if (!task) {
//       return res.status(404).json({ success: false, message: "Task not found" });
//     }

//     if (!task.remarks) {
//       task.remarks = [];
//     }

//     // 3. Remark push karein
//     task.remarks.push({
//       text: String(text),
//       author: String(author),
//       createdAt: new Date()
//     });

//     // 4. Save document
//     await task.save();

//     return res.status(200).json({ success: true, data: task });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };


// exports.uploadTaskFile = async (req, res) => {
//   console.log(req.body, "file upload payload");
//   try {
//     const { taskId } = req.params;
//     const label = req.body?.label || "Document"; 
//     const file = req.file;

//     if (!file) {
//       return res.status(400).json({ success: false, message: "No file provided" });
//     }

//     // Task Find karein (MongoDB ID ya Custom TaskId se)
//     let task = await Task.findOne({
//       $or: [{ _id: taskId }, { taskId: taskId }]
//     });

//     if (!task) {
//       return res.status(404).json({ success: false, message: "Task not found" });
//     }

//     // Memory Storage (Buffer) ko CloudinaryStream se upload karein
//     const uploadFromBuffer = () => {
//       return new Promise((resolve, reject) => {
//         const stream = cloudinary.uploader.upload_stream(
//           {
//             folder: "task_documents",
//             resource_type: "auto", // PDF, DOCX, PNG, JPG automatic detect karega
//             // flags: "attachment:false",  PDF ko Direct Browser me Open karne ki permission deta hai
//           },
//           (error, result) => {
//             if (result) resolve(result);
//             else reject(error);
//           }
//         );
        
//         // Stream buffer to Cloudinary
//         streamifier.createReadStream(file.buffer).pipe(stream);
//       });
//     };

//     const result = await uploadFromBuffer();

//     // Files Array Safety Check
//     if (!task.files) {
//       task.files = [];
//     }

//     // Clean File URL Fix for PDFs/Raw Docs
//     let fileUrl = result.secure_url;

//     // Direct Database push
//     task.files.push({
//       label: label,
//       fileUrl: fileUrl,
//       publicId: result.public_id,
//       fileType: file.mimetype || result.format || result.resource_type, // Exact MimeType save hoga (e.g. application/pdf, image/png)
//       uploadedAt: new Date(),
//     });

//     // Save with explicit modification mark
//     task.markModified('files');
//     await task.save();

//     return res.status(200).json({ 
//       success: true, 
//       message: "File uploaded successfully!", 
//       data: task 
//     });

//   } catch (error) {
//     console.error("Cloudinary File Upload Error:", error);
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };



const Staff = require("../models/StaffModel");
const Task = require("../models/Task");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const Installation = require("../models/Installation")

exports.createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, assignedStaff } = req.body;

    const staff = await Staff.findById(assignedStaff);

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff not found",
      });
    }

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,

      assignedStaff: {
        staffId: staff._id,
        name: staff.name,
        email: staff.email,
        phone: staff.phone,
        designation: staff.designation,
        department: staff.department,
      },
    });

    staff.assignedQueries += 1;
    await staff.save();

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// GET /task  — bulk fetch ALL tasks in one call.
// Used by the Installations page (frontend) to build an
// installationId -> task lookup without an N+1 request per row.
// Supports optional ?status=&priority=&staffId= query filters.
exports.getAllTasks = async (req, res) => {
  try {
    const { status, priority, staffId } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (staffId) filter["assignedStaff.staffId"] = staffId;

    const tasks = await Task.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    console.error("Error fetching all tasks:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error fetching tasks",
      error: error.message,
    });
  }
};

exports.getTasksByStaff = async (req, res) => {
  console.log("staff", req.body);
  try {
    const { staffId } = req.params;
    const { status } = req.query;

    let filter = {
      "assignedStaff.staffId": staffId,
    };

    if (status) {
      if (status === "Resolved") {
        filter.status = "Resolved";
      } else {
        filter.status = status;
      }
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    console.error("Error fetching filtered tasks:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error while querying tasks schema",
      error: error.message,
    });
  }
};

exports.fetchTaskById = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findOne({
      $or: [{ _id: taskId }, { taskId: taskId }],
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching task",
      error: error.message,
    });
  }
};

// GET /task/by-installation/:installationId
// Returns the task linked to a given installation (matched via
// task.installationId, which is stored as the Installation's _id string).
// If more than one task somehow exists for the same installation,
// the most recently updated one is returned.
exports.getTaskByInstallation = async (req, res) => {
  try {
    const { installationId } = req.params;

    const task = await Task.findOne({ installationId }).sort({ updatedAt: -1 });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "No task found for this installation",
      });
    }

    return res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error("Error fetching task by installation:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error fetching task",
      error: error.message,
    });
  }
};

// exports.updateTaskStatus = async (req, res) => {
//   console.log("updateTaskStatus received body:", req.body);
//   try {
//     const { taskId } = req.params;
//     const { status } = req.body;

//     // 1. Frontend se aane wali progress nikalen
//     let progress = req.body.progress;

//     // 2. Safety Check / Fallback: Agar frontend se progress na bhi aaye, toh backend khud set kar lega
//     if (progress === undefined || progress === null) {
//       if (status === "In Progress") {
//         progress = 10;
//       } else if (status === "Completed" || status === "Resolved") {
//         progress = 100;
//       } else if (status === "Pending") {
//         progress = 0;
//       }
//     }

//     // 3. Database mein status aur progress dono update karein
//     const task = await Task.findByIdAndUpdate(
//       taskId,
//       {
//         status,
//         progress, // DB mein progress column update ho jayega
//       },
//       { new: true, runValidators: true }
//     );

//     if (!task) {
//       return res.status(404).json({ success: false, message: "Task not found" });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Status and progress updated successfully",
//       data: task,
//     });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

exports.updateTaskStatus = async (req, res) => {
  console.log("updateTaskStatus received body:", req.body);
  try {
    const { taskId } = req.params;
    const { status, note, updatedBy } = req.body;

    let progress = req.body.progress;
    if (progress === undefined || progress === null) {
      if (status === "In Progress") {
        progress = 10;
      } else if (status === "Completed" || status === "Resolved") {
        progress = 100;
      } else if (status === "Pending") {
        progress = 0;
      }
    }

    const historyEntry = {
      status: status,
      date: new Date(),
      note: note || `Status updated to ${status}`,
      updatedBy: updatedBy || req.user?.name || "Staff",
    };

    const task = await Task.findByIdAndUpdate(
      taskId,
      {
        $set: { 
          status: status, 
          progress: progress 
        },
        $push: { 
          statusHistory: historyEntry 
        },
      },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    // 🟢 Installation database update with status & expiryDate (375 Days)
    if (task.installationId) {
      const installation = await Installation.findById(task.installationId);
      if (installation) {
        installation.status = status;

        // Status Completed hone par EXACT 375 Days add karein
        if (status === "Completed" || status === "Resolved") {
          const baseDate = installation.installationDate 
            ? new Date(installation.installationDate) 
            : new Date();

          const expiry = new Date(baseDate);
          expiry.setDate(expiry.getDate() + 375);

          installation.expiryDate = expiry;
        }

        await installation.save(); 
      }
    }

    return res.status(200).json({
      success: true,
      message: "Status and progress updated successfully",
      data: task,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// exports.updateTaskStatus = async (req, res) => {
//   console.log("updateTaskStatus received body:", req.body);
//   try {
//     const { taskId } = req.params;
//     const { status, note, updatedBy } = req.body;

//     // 1. Progress determination
//     let progress = req.body.progress;
//     if (progress === undefined || progress === null) {
//       if (status === "In Progress") {
//         progress = 10;
//       } else if (status === "Completed" || status === "Resolved") {
//         progress = 100;
//       } else if (status === "Pending") {
//         progress = 0;
//       }
//     }

//     // 2. New History Item Object
//     const historyEntry = {
//       status: status,
//       date: new Date(),
//       note: note || `Status updated to ${status}`,
//       updatedBy: updatedBy || req.user?.name || 'Staff'
//     };

//     // 3. Update task (Status & Progress set karein, History array me push karein)
//     const task = await Task.findByIdAndUpdate(
//       taskId,
//       {
//         $set: { 
//           status: status, 
//           progress: progress 
//         },
//         $push: { 
//           statusHistory: historyEntry 
//         }
//       },
//       { new: true, runValidators: true }
//     );

  
//     if (!task) {
//       return res.status(404).json({ success: false, message: "Task not found" });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Status and progress updated successfully",
//       data: task,
//     });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

exports.updateTaskProgress = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { progress } = req.body; // e.g., 50 (percentage)

    const task = await Task.findByIdAndUpdate(taskId, { progress }, { new: true });

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Progress updated successfully",
      data: task,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMonthlyPerformance = async (req, res) => {
  try {
    const { staffId } = req.params;
    const matchStage = staffId ? { "assignedStaff.staffId": staffId } : {};

    const monthlyData = await Task.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { $month: "$createdAt" },
          assigned: { $sum: 1 },
          completed: {
            $sum: {
              $cond: [{ $in: ["$status", ["Completed", "Resolved"]] }, 1, 0],
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const formattedData = monthlyData.map((item) => ({
      month: monthNames[item._id - 1],
      assigned: item.assigned,
      completed: item.completed,
    }));

    return res.status(200).json({
      success: true,
      data: formattedData,
    });
  } catch (error) {
    console.error("Error in getMonthlyPerformance:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error fetching monthly performance",
      error: error.message,
    });
  }
};

exports.getWeeklyActivity = async (req, res) => {
  try {
    const { staffId } = req.params;

    // Calculate start of current week (Monday)
    const now = new Date();
    const dayOfWeek = now.getDay();
    const distanceToMonday = (dayOfWeek + 6) % 7;
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - distanceToMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    const filter = {
      createdAt: { $gte: startOfWeek },
    };

    if (staffId) {
      filter["assignedStaff.staffId"] = staffId;
    }

    const weeklyTasks = await Task.find(filter);

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const dayCounts = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };

    weeklyTasks.forEach((task) => {
      const taskDay = new Date(task.createdAt).getDay();
      // Adjust JS Sunday (0) to index 6
      const dayName = days[(taskDay + 6) % 7];
      if (dayCounts[dayName] !== undefined) {
        dayCounts[dayName]++;
      }
    });

    const formattedData = days.map((day) => ({
      day,
      tasks: dayCounts[day],
    }));

    return res.status(200).json({
      success: true,
      data: formattedData,
    });
  } catch (error) {
    console.error("Error in getWeeklyActivity:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error fetching weekly activity",
      error: error.message,
    });
  }
};

exports.getReports = async (req, res) => {
  try {
    const { staffId } = req.params;
    const filter = staffId ? { "assignedStaff.staffId": staffId } : {};

    const allTasks = await Task.find(filter).sort({ createdAt: -1 });

    // Separate Installation vs Query tasks
    const installationReports = allTasks.filter(
      (t) => t.installationId || t.title?.toLowerCase().includes("installation")
    );

    const queryReports = allTasks.filter(
      (t) => !t.installationId && !t.title?.toLowerCase().includes("installation")
    );

    // Calculate monthly totals for the reports bar chart
    const monthlyData = await Task.aggregate([
      { $match: filter },
      {
        $group: {
          _id: { $month: "$createdAt" },
          completed: {
            $sum: { $cond: [{ $in: ["$status", ["Completed", "Resolved"]] }, 1, 0] },
          },
          pending: {
            $sum: { $cond: [{ $in: ["$status", ["Pending", "In Progress"]] }, 1, 0] },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyCompleted = monthlyData.map((item) => ({
      month: monthNames[item._id - 1],
      completed: item.completed,
      pending: item.pending,
    }));

    return res.status(200).json({
      success: true,
      data: {
        installationReports,
        queryReports,
        monthlyCompleted,
      },
    });
  } catch (error) {
    console.error("Error in getReports:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error fetching reports",
      error: error.message,
    });
  }
};

exports.addTaskRemark = async (req, res) => {
  console.log(req.body, "remark");
  try {
    const { taskId } = req.params;

    // 1. Text & Author extract karein
    const text = req.body.text || req.body.remark?.text;
    const author = req.body.author || req.body.remark?.author || "Staff";

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Remark text is required",
      });
    }

    // 2. Task find karein
    const task = await Task.findOne({
      $or: [{ _id: taskId }, { taskId: taskId }],
    });

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    if (!task.remarks) {
      task.remarks = [];
    }

    // 3. Remark push karein
    task.remarks.push({
      text: String(text),
      author: String(author),
      createdAt: new Date(),
    });

    // 4. Save document
    await task.save();

    return res.status(200).json({ success: true, data: task });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.uploadTaskFile = async (req, res) => {
  console.log(req.body, "file upload payload");
  try {
    const { taskId } = req.params;
    const label = req.body?.label || "Document";
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: false, message: "No file provided" });
    }

    // Task Find karein (MongoDB ID ya Custom TaskId se)
    let task = await Task.findOne({
      $or: [{ _id: taskId }, { taskId: taskId }],
    });

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    // Memory Storage (Buffer) ko CloudinaryStream se upload karein
    const uploadFromBuffer = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "task_documents",
            resource_type: "auto", // PDF, DOCX, PNG, JPG automatic detect karega
            // flags: "attachment:false",  PDF ko Direct Browser me Open karne ki permission deta hai
          },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );

        // Stream buffer to Cloudinary
        streamifier.createReadStream(file.buffer).pipe(stream);
      });
    };

    const result = await uploadFromBuffer();

    // Files Array Safety Check
    if (!task.files) {
      task.files = [];
    }

    // Clean File URL Fix for PDFs/Raw Docs
    let fileUrl = result.secure_url;

    // Direct Database push
    task.files.push({
      label: label,
      fileUrl: fileUrl,
      publicId: result.public_id,
      fileType: file.mimetype || result.format || result.resource_type, // Exact MimeType save hoga (e.g. application/pdf, image/png)
      uploadedAt: new Date(),
    });

    // Save with explicit modification mark
    task.markModified("files");
    await task.save();

    return res.status(200).json({
      success: true,
      message: "File uploaded successfully!",
      data: task,
    });
  } catch (error) {
    console.error("Cloudinary File Upload Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};