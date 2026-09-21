// const Installation = require("../models/Installation");
// const Task = require("../models/Task");
// const Staff = require("../models/StaffModel");
// const generateTaskId = require("../utils/generateTaskId");

// exports.createInstallation = async (data) => {
//   // Installation Create
//   const installation = await Installation.create(data);

//   // Staff Assign hai to Task bhi Create karo
//   if (data.assignedStaff?.staffId) {
//     const staff = await Staff.findById(data.assignedStaff.staffId).populate(
//       "department",
//       "name",
//     );

//     if (staff) {
//       const taskId = await generateTaskId();
//       await Task.create({
//         taskId,

//         title: `Installation - ${installation.partyName}`,

//         softwareDetails: installation.softwareDetails,

//         softwareType: installation.softwareType,

//         description: installation.softwareDetails,

//         priority: "High",

//         status: "Pending",

//         dueDate: installation.installationDate,

//       installationId: installation._id.toString(),

//         assignedStaff: {
//           staffId: staff._id.toString(),
//           name: staff.fullName,
//           email: staff.email,
//           phone: staff.phone,
//           designation: staff.designation,
//           department: staff.department?.name || "",
//         },

//         partyDetails: {
//           poNumber: installation.poNumber,
//           billNumber: installation.billNumber,
//           billDate: installation.billDate,
//           partyName: installation.partyName,
//           address: installation.address,
//           location: installation.location,
//           contactPerson: installation.contactPerson,
//           mobileNo: installation.mobileNo,
//           alternateNo: installation.alternateNo,
//           email: installation.email,
//           salesPersonName: installation.salesPersonName,
//         },
//       });
//       // Staff Assigned Count Update
//       staff.assignedQueries += 1;
//       await staff.save();
//     }
//   }

//   return installation;
// };

// exports.getAllInstallations = async () => {
//   return await Installation.find()
//     .populate({
//       path: "assignedStaff",
//       select: "fullName name phone email designation department",
//       populate: {
//         path: "department",
//         select: "name",
//       },
//     })
//     .sort({ createdAt: -1 });
// };

// const Installation = require("../models/Installation");
// const Task = require("../models/Task");
// const Staff = require("../models/StaffModel");
// const Notification = require("../models/Notification");
// const generateTaskId = require("../utils/generateTaskId");

// exports.createInstallation = async (data) => {

//   const installation = await Installation.create(data);
//   if (data.assignedStaff?.staffId) {
//     const staff = await Staff.findById(data.assignedStaff.staffId).populate(
//       "department",
//       "name"
//     );

//     if (staff) {
//       const taskId = await generateTaskId();
//       const newTask = await Task.create({
//         taskId,
//         title: `Installation - ${installation.partyName}`,
//         softwareDetails: installation.softwareDetails,
//         softwareType: installation.softwareType,
//         description: installation.softwareDetails,
//         priority: "High",
//         status: "Pending",
//         dueDate: installation.installationDate,
//         installationId: installation._id.toString(),

//         assignedStaff: {
//           staffId: staff._id.toString(),
//           name: staff.fullName,
//           email: staff.email,
//           phone: staff.phone,
//           designation: staff.designation,
//           department: staff.department?.name || "",
//         },

//         partyDetails: {
//           poNumber: installation.poNumber,
//           billNumber: installation.billNumber,
//           billDate: installation.billDate,
//           partyName: installation.partyName,
//           address: installation.address,
//           location: installation.location,
//           contactPerson: installation.contactPerson,
//           mobileNo: installation.mobileNo,
//           alternateNo: installation.alternateNo,
//           email: installation.email,
//           salesPersonName: installation.salesPersonName,
//         },
//       });
//       await Notification.create({
//         staffId: staff._id.toString(),
//         taskId: newTask._id.toString(),
//         title: "New Task Assigned",
//         message: `You have been assigned a new installation task for ${installation.partyName}.`,
//         type: "assigned",
//         read: false,
//       });

//       staff.assignedQueries += 1;
//       await staff.save();
//     }
//   }

//   return installation;
// };

// exports.getAllInstallations = async () => {
//   return await Installation.find()
//     .populate({
//       path: "assignedStaff",
//       select: "fullName name phone email designation department",
//       populate: {
//         path: "department",
//         select: "name",
//       },
//     })
//     .sort({ createdAt: -1 });
// };

// exports.updateInstallation = async (id, updateData) => {
//   const updated = await Installation.findByIdAndUpdate(
//     id,
//     { $set: updateData },
//     { returnDocument: 'after', runValidators: true }
//   );
//   return updated;
// };

const Installation = require("../models/Installation");
const Task = require("../models/Task");
const Staff = require("../models/StaffModel");
const Notification = require("../models/Notification");
const generateTaskId = require("../utils/generateTaskId");

function buildStaffSnapshot(staff) {
  return {
    staffId: staff._id.toString(),
    name: staff.fullName,
    email: staff.email,
    phone: staff.phone,
    designation: staff.designation,
    department: staff.department?.name || "",
  };
}

function buildPartyDetails(installation) {
  return {
    poNumber: installation.poNumber,
    billNumber: installation.billNumber,
    billDate: installation.billDate,
    partyName: installation.partyName,
    address: installation.address,
    location: installation.location,
    contactPerson: installation.contactPerson,
    mobileNo: installation.mobileNo,
    alternateNo: installation.alternateNo,
    email: installation.email,
    salesPersonName: installation.salesPersonName,
  };
}

// ---------------------------------------------------------------------
// CREATE
// A task is ALWAYS created for a new installation, even when no staff is
// assigned yet. If a staff member is picked later (via edit), the task
// gets an assignedStaff attached — see updateInstallation below.
// ---------------------------------------------------------------------
// exports.createInstallation = async (data) => {
//   const installation = await Installation.create(data);

//   const taskId = await generateTaskId();
//   const taskPayload = {
//     taskId,
//     title: `Installation - ${installation.partyName}`,
//     softwareDetails: installation.softwareDetails,
//     softwareType: installation.softwareType,
//     description: installation.softwareDetails,
//     priority: data.priority,
//     status: installation.status,
//     dueDate: installation.installationDate || undefined,
//     installationId: installation._id.toString(),
//     partyDetails: buildPartyDetails(installation),
//   };

//   if (data.assignedStaff?.staffId) {
//     const staff = await Staff.findById(data.assignedStaff.staffId).populate(
//       "department",
//       "name",
//     );
//     if (staff) {
//       taskPayload.assignedStaff = buildStaffSnapshot(staff);
//       staff.assignedQueries += 1;
//       await staff.save();
//     }
//   }

//   const newTask = await Task.create(taskPayload);

//   if (taskPayload.assignedStaff) {
//     await Notification.create({
//       staffId: taskPayload.assignedStaff.staffId,
//       taskId: newTask._id.toString(),
//       title: "New Task Assigned",
//       message: `You have been assigned a new installation task for ${installation.partyName}.`,
//       type: "assigned",
//       read: false,
//     });
//   }

//   return installation;
// };
exports.createInstallation = async (data) => {
  // 1. Unique Check for poNumber and billNumber
  if (data.poNumber) {
    const existingPO = await Installation.findOne({ poNumber: data.poNumber.trim() });
    if (existingPO) {
      throw new Error(`PO Number '${data.poNumber}' already exists.`);
    }
  }

  if (data.billNumber) {
    const existingBill = await Installation.findOne({ billNumber: data.billNumber.trim() });
    if (existingBill) {
      throw new Error(`Bill Number '${data.billNumber}' already exists.`);
    }
  }

  // 2. Create Installation
  const installation = await Installation.create(data);

  const taskId = await generateTaskId();
  const taskPayload = {
    taskId,
    title: `Installation - ${installation.partyName}`,
    softwareDetails: installation.softwareDetails,
    softwareType: installation.softwareType,
    description: installation.softwareDetails,
    priority: data.priority,
    status: installation.status,
    dueDate: installation.installationDate || undefined,
    installationId: installation._id.toString(),
    partyDetails: buildPartyDetails(installation),
  };

  // 3. Handle Assigned Staff
  if (data.assignedStaff?.staffId) {
    const staff = await Staff.findById(data.assignedStaff.staffId).populate(
      "department",
      "name"
    );
    if (staff) {
      taskPayload.assignedStaff = buildStaffSnapshot(staff);
      staff.assignedQueries += 1;
      await staff.save();
    }
  }

  // 4. Create Task
  const newTask = await Task.create(taskPayload);

  // 5. Create Notification
  if (taskPayload.assignedStaff) {
    await Notification.create({
      staffId: taskPayload.assignedStaff.staffId,
      taskId: newTask._id.toString(),
      title: "New Task Assigned",
      message: `You have been assigned a new installation task for ${installation.partyName}.`,
      type: "assigned",
      read: false,
    });
  }

  return installation;
};

function sanitizeUpdateData(updateData) {
  const clean = { ...updateData };
  ["billDate", "installationDate"].forEach((key) => {
    if (clean[key] === "" || clean[key] === undefined) delete clean[key];
  });
  if (clean.amount === "" || clean.amount === undefined) delete clean.amount;
  return clean;
}

// exports.updateInstallation = async (id, updateData) => {
//   const clean = sanitizeUpdateData(updateData);

//   const updated = await Installation.findByIdAndUpdate(
//     id,
//     { $set: clean },
//     { new: true, runValidators: true },
//   );

//   if (!updated) return null;

//   // Keep the linked task's staff assignment in sync whenever the
//   // installation's assignedStaff changes (including the first time it's
//   // set, if the installation was created without one).
//   const staffId = clean.assignedStaff?.staffId;
//   if (staffId) {
//     const staff = await Staff.findById(staffId).populate("department", "name");
//     if (staff) {
//       const assignedStaff = buildStaffSnapshot(staff);
//       let task = await Task.findOne({ installationId: id });
//       console.log("updated.installationDate", updated.installationDate);
//       if (!task) {
//         const taskId = await generateTaskId();
//         task = await Task.create({
//           taskId,
//           title: `Installation - ${updated.partyName}`,
//           softwareDetails: updated.softwareDetails,
//           softwareType: updated.softwareType,
//           description: updated.softwareDetails,
//           priority: "High",
//           status: "Pending",
//           dueDate: updated.installationDate,
//           installationId: id,
//           assignedStaff,
//           partyDetails: buildPartyDetails(updated),
//         });
//         console.log("dueDate", dueDate);
//         staff.assignedQueries += 1;
//         await staff.save();

//         await Notification.create({
//           staffId: assignedStaff.staffId,
//           taskId: task._id.toString(),
//           title: "New Task Assigned",
//           message: `You have been assigned a new installation task for ${updated.partyName}.`,
//           type: "assigned",
//           read: false,
//         });
//       } else if (task.assignedStaff?.staffId !== staffId) {
//         task.assignedStaff = assignedStaff;
//         await task.save();
//         staff.assignedQueries += 1;
//         await staff.save();

//         await Notification.create({
//           staffId: assignedStaff.staffId,
//           taskId: task._id.toString(),
//           title: "Task Reassigned",
//           message: `You have been assigned an installation task for ${updated.partyName}.`,
//           type: "assigned",
//           read: false,
//         });
//       }
//     }
//   }

//   return updated;
// };

// exports.updateInstallation = async (id, updateData) => {
//   const clean = sanitizeUpdateData(updateData);

//   const updated = await Installation.findByIdAndUpdate(
//     id,
//     { $set: clean },
//     { new: true, runValidators: true }
//   );

//   if (!updated) return null;

//   // 1. Check karein ki installationDate valid Date hai ya nahi
//   const validDueDate = updated.installationDate ? new Date(updated.installationDate) : null;

//   const staffId = clean.assignedStaff?.staffId;
//   if (staffId) {
//     const staff = await Staff.findById(staffId).populate("department", "name");
//     if (staff) {
//       const assignedStaff = buildStaffSnapshot(staff);
//       let task = await Task.findOne({ installationId: id });

//       if (!task) {
//         // CASE A: Task nahi hai - Naya Task banayein with dueDate
//         const taskId = await generateTaskId();
//         task = await Task.create({
//           taskId,
//           title: `Installation - ${updated.partyName}`,
//           softwareDetails: updated.softwareDetails,
//           softwareType: updated.softwareType,
//           description: updated.softwareDetails,
//           priority: "High",
//           status: "Pending",
//           dueDate: validDueDate, // ✅ Properly passed Date object
//           installationId: id,
//           assignedStaff,
//           partyDetails: buildPartyDetails(updated),
//         });

//         console.log("Task created with dueDate:", task.dueDate);

//         staff.assignedQueries += 1;
//         await staff.save();

//         await Notification.create({
//           staffId: assignedStaff.staffId,
//           taskId: task._id.toString(),
//           title: "New Task Assigned",
//           message: `You have been assigned a new installation task for ${updated.partyName}.`,
//           type: "assigned",
//           read: false,
//         });
//       } else {
//         // CASE B: Task pehle se exist karta hai - Staff aur dueDate dono sync karein
//         let isTaskUpdated = false;

//         // Sync dueDate
//         if (validDueDate) {
//           task.dueDate = validDueDate;
//           isTaskUpdated = true;
//         }

//         // Sync Staff Assignment
//         if (task.assignedStaff?.staffId !== staffId) {
//           task.assignedStaff = assignedStaff;
//           isTaskUpdated = true;

//           staff.assignedQueries += 1;
//           await staff.save();

//           await Notification.create({
//             staffId: assignedStaff.staffId,
//             taskId: task._id.toString(),
//             title: "Task Reassigned",
//             message: `You have been assigned an installation task for ${updated.partyName}.`,
//             type: "assigned",
//             read: false,
//           });
//         }

//         // Agar dueDate ya Staff change hua hai tabhi update save karein
//         if (isTaskUpdated) {
//           await task.save();
//         }
//       }
//     }
//   }

//   return updated;
// };

exports.updateInstallation = async (id, updateData) => {
  const clean = sanitizeUpdateData(updateData);

  const updated = await Installation.findByIdAndUpdate(
    id,
    { $set: clean },
    { new: true, runValidators: true }
  );

  if (!updated) return null;

  const validDueDate = updated.installationDate ? new Date(updated.installationDate) : null;
  const staffId = clean.assignedStaff?.staffId;

  // 1. Linked Task search karein
  let task = await Task.findOne({ installationId: id });

  if (task) {
    // ==========================================
    // CASE B: Task Pehle Se Exist Karta Hai (Sync Details)
    // ==========================================
    
    // Always update partyDetails, software details, and dueDate on existing task
    task.partyDetails = buildPartyDetails(updated);
    task.softwareDetails = updated.softwareDetails;
    task.softwareType = updated.softwareType;
    task.description = updated.softwareDetails;
    task.title = `Installation - ${updated.partyName}`;
    
    if (validDueDate) {
      task.dueDate = validDueDate;
    }

    // Agar Staff update/change hua ho
    if (staffId && task.assignedStaff?.staffId !== staffId) {
      const staff = await Staff.findById(staffId).populate("department", "name");
      if (staff) {
        const assignedStaff = buildStaffSnapshot(staff);
        task.assignedStaff = assignedStaff;

        staff.assignedQueries += 1;
        await staff.save();

        await Notification.create({
          staffId: assignedStaff.staffId,
          taskId: task._id.toString(),
          title: "Task Reassigned",
          message: `You have been assigned an installation task for ${updated.partyName}.`,
          type: "assigned",
          read: false,
        });
      }
    }

    // Sabhi changes (billNumber, billDate, partyDetails, etc.) ko Task collection me save karein
    await task.save();

  } else if (staffId) {
    // ==========================================
    // CASE A: Task Nahi Hai - Naya Task Banayein
    // ==========================================
    const staff = await Staff.findById(staffId).populate("department", "name");
    if (staff) {
      const assignedStaff = buildStaffSnapshot(staff);
      const taskId = await generateTaskId();

      task = await Task.create({
        taskId,
        title: `Installation - ${updated.partyName}`,
        softwareDetails: updated.softwareDetails,
        softwareType: updated.softwareType,
        description: updated.softwareDetails,
        priority: "High",
        status: "Pending",
        dueDate: validDueDate,
        installationId: id,
        assignedStaff,
        partyDetails: buildPartyDetails(updated), // Naye task me add hoga
      });

      staff.assignedQueries += 1;
      await staff.save();

      await Notification.create({
        staffId: assignedStaff.staffId,
        taskId: task._id.toString(),
        title: "New Task Assigned",
        message: `You have been assigned a new installation task for ${updated.partyName}.`,
        type: "assigned",
        read: false,
      });
    }
  }

  return updated;
};

exports.getAllInstallations = async () => {
  return await Installation.find()
    .populate({
      path: "assignedStaff",
      select: "fullName name phone email designation department",
      populate: {
        path: "department",
        select: "name",
      },
    })
    .sort({ createdAt: -1 });
};
