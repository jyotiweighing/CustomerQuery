

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
exports.createInstallation = async (data) => {
  let installation = null;
  let newTask = null;
  let assignedStaff = null;
  let staffIncremented = false;
  try {
    const clean = { ...data };
    ["billNumber", "billDate", "installationDate", "salesPersonName"].forEach((key) => {
      if (clean[key] === "" || clean[key] === undefined) delete clean[key];
    });
    if (clean.amount === "" || clean.amount === undefined) delete clean.amount;

    if (!clean.poNumber?.trim()) throw new Error("PO Number is required.");
    if (!clean.partyName?.trim()) throw new Error("Party Name is required.");
    if (!clean.mobileNo?.trim()) throw new Error("Mobile Number is required.");

    if (await Installation.exists({ poNumber: clean.poNumber.trim() })) {
      throw new Error(`PO Number '${clean.poNumber}' already exists.`);
    }
    if (clean.billNumber && await Installation.exists({ billNumber: clean.billNumber.trim() })) {
      throw new Error(`Bill Number '${clean.billNumber}' already exists.`);
    }

    if (clean.assignedStaff?.staffId) {
      assignedStaff = await Staff.findById(clean.assignedStaff.staffId).populate("department", "name");
      if (!assignedStaff) throw new Error("Selected staff member was not found.");
      if (assignedStaff.status && assignedStaff.status !== "Active") throw new Error("Selected staff member is not active.");
    }

    installation = await Installation.create(clean);
    const taskId = await generateTaskId();
    const taskPayload = {
      taskId, title: `Installation - ${installation.partyName}`,
      softwareDetails: installation.softwareDetails || "", softwareType: installation.softwareType || "",
      softwareFeature: installation.softwareFeature || [], material: installation.material || [],
      description: installation.softwareDetails || `Installation - ${installation.partyName}`,
      priority: installation.priority || "Medium", sourceType: "Installation", status: installation.status || "Pending",
      dueDate: installation.installationDate || undefined, installationId: installation._id.toString(),
      partyDetails: buildPartyDetails(installation),
      statusHistory: [{ status: installation.status || "Pending", note: "Installation task created" }],
    };
    if (assignedStaff) taskPayload.assignedStaff = buildStaffSnapshot(assignedStaff);

    newTask = await Task.create(taskPayload);

    if (assignedStaff) {
      assignedStaff.assignedQueries = (assignedStaff.assignedQueries || 0) + 1;
      await assignedStaff.save();
      staffIncremented = true;
      await Notification.create({
        staffId: assignedStaff._id.toString(), taskId: newTask._id.toString(),
        title: "New Task Assigned", message: `You have been assigned a new installation task for ${installation.partyName}.`,
        type: "assigned", read: false,
      });
    }
    return installation;
  } catch (error) {
    // Compensating rollback: never leave an installation without its task.
    try { if (newTask?._id) await Task.deleteOne({ _id: newTask._id }); } catch (rollbackError) { console.error("Task rollback failed:", rollbackError); }
    try { if (installation?._id) await Installation.deleteOne({ _id: installation._id }); } catch (rollbackError) { console.error("Installation rollback failed:", rollbackError); }
    if (staffIncremented && assignedStaff) {
      try { await Staff.updateOne({ _id: assignedStaff._id }, { $inc: { assignedQueries: -1 } }); } catch (rollbackError) { console.error("Staff counter rollback failed:", rollbackError); }
    }
    throw error;
  }
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
    task.softwareFeature = updated.softwareFeature || [];
    task.material = updated.material || [];
    task.description = updated.softwareDetails;
    task.priority = updated.priority || task.priority || "Medium";
    task.sourceType = "Installation";
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
        softwareFeature: updated.softwareFeature || [],
        description: updated.softwareDetails,
        priority: updated.priority || "Medium",
        sourceType: "Installation",
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
