const mongoose = require("mongoose");
const Query = require("../models/Query");
const Customer = require("../models/Customer");
const Staff = require("../models/StaffModel");
const User = require("../models/User");
const Task = require("../models/Task");

const findQuery = (id) => mongoose.isValidObjectId(id)
  ? Query.findOne({ $or: [{ _id: id }, { queryId: id }] })
  : Query.findOne({ queryId: id });

const buildTaskFromQuery = async ({ query, assignee, assigneeRole, assignedBy }) => {
  const existingTask = await Task.findOne({ sourceQueryId: query._id });
  if (existingTask) return existingTask;

  return Task.create({
    title: query.subject,
    description: query.description,
    softwareType: query.softwareType || "",
    softwareFeature: Array.isArray(query.softwareFeature) ? query.softwareFeature : [],
    material: Array.isArray(query.material) ? query.material : [],
    priority: query.priority,
    status: "Pending",
    sourceType: "CustomerQuery",
    sourceQueryId: query._id,
    sourceQueryCode: query.queryId,
    preferredContact: query.preferredContact,
    partyDetails: query.partyDetails,
    assignedStaff: {
      staffId: String(assignee._id),
      name: assignee.name,
      email: assignee.email,
      phone: assignee.phone || assignee.mobile || "",
      designation: assignee.designation || (assigneeRole === "admin" ? "Admin" : "Support Agent"),
      department: assignee.departmentname || assignee.department || (assigneeRole === "admin" ? "Administration" : ""),
      role: assigneeRole,
    },
    statusHistory: [{
      status: "Pending",
      note: assignedBy
        ? `Task created from ${query.queryId} and assigned by ${assignedBy.name}`
        : `Task created from ${query.queryId}`,
      updatedBy: assignedBy?.name || assignee.name,
    }],
  });
};

exports.createQuery = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id);
    if (!customer) return res.status(404).json({ success: false, message: "Customer not found" });

    const {
      subject,
      category,
      product,
      softwareType = "",
      softwareFeature = [],
      material = [],
      priority,
      description,
      preferredContact,
      partyDetails = {},
    } = req.body;
    if (!subject || !category || !description || !preferredContact || !partyDetails.partyName || !partyDetails.contactPerson || !partyDetails.mobileNo || !partyDetails.email) {
      return res.status(400).json({ success: false, message: "Required query and party/contact fields are missing" });
    }

    const query = await Query.create({
      customer: {
        customerId: customer._id,
        customerCode: customer.customerId,
        name: customer.name,
        email: customer.email,
        mobile: customer.mobile,
        companyName: customer.companyName,
      },
      subject,
      category,
      product,
      softwareType,
      softwareFeature: Array.isArray(softwareFeature) ? softwareFeature : [],
      material: Array.isArray(material) ? material : [],
      priority,
      description,
      preferredContact,
      partyDetails,
    });

    return res.status(201).json({ success: true, message: "Query created successfully", data: query });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyQueries = async (req, res) => {
  try {
    const queries = await Query.find({ "customer.customerId": req.user.id }).sort({ createdAt: -1 });
    return res.json({ success: true, count: queries.length, data: queries });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getQueryById = async (req, res) => {
  try {
    const query = await findQuery(req.params.id);
    if (!query) return res.status(404).json({ success: false, message: "Query not found" });

    if (String(req.user.role || "").toLowerCase() === "customer" && String(query.customer.customerId) !== String(req.user.id)) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    return res.json({ success: true, data: query });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllQueries = async (req, res) => {
  try {
    if (!["admin", "staff"].includes(String(req.user?.role || "").toLowerCase())) {
      return res.status(403).json({ success: false, message: "Admin/Staff access only" });
    }

    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;
    if (req.query.search) {
      const regex = new RegExp(req.query.search, "i");
      filter.$or = [
        { queryId: regex },
        { subject: regex },
        { "customer.name": regex },
        { "customer.companyName": regex },
        { "partyDetails.partyName": regex },
      ];
    }

    const queries = await Query.find(filter).sort({ createdAt: -1 });
    return res.json({ success: true, count: queries.length, data: queries });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Admin assigns a customer query to a selected staff member.
// A Task is created automatically and linked back to the Query.
exports.assignQueryToStaff = async (req, res) => {
  try {
    if (String(req.user?.role || "").toLowerCase() !== "admin") {
      return res.status(403).json({ success: false, message: "Only Admin can assign a customer query to staff" });
    }

    const { staffId } = req.body;
    if (!staffId || !mongoose.isValidObjectId(staffId)) {
      return res.status(400).json({ success: false, message: "Valid staffId is required" });
    }

    const query = await findQuery(req.params.id);
    if (!query) return res.status(404).json({ success: false, message: "Query not found" });

    if (query.taskId) {
      return res.status(409).json({
        success: false,
        message: `This query is already assigned${query.taskCode ? ` as ${query.taskCode}` : ""}`,
        data: query,
      });
    }

    const staff = await Staff.findById(staffId);
    if (!staff) return res.status(404).json({ success: false, message: "Staff member not found" });
    if (staff.status && staff.status !== "Active") {
      return res.status(400).json({ success: false, message: "Selected staff member is not active" });
    }

    const admin = await User.findById(req.user.id).select("name email role");
    const assignedBy = {
      userId: String(req.user.id),
      name: admin?.name || req.user.name || "Admin",
      email: admin?.email || req.user.email || "",
      role: "admin",
      assignedAt: new Date(),
    };

    const task = await buildTaskFromQuery({ query, assignee: staff, assigneeRole: "staff", assignedBy });

    query.status = "Assigned";
    query.pickedBy = {
      userId: String(staff._id),
      name: staff.name,
      email: staff.email,
      role: "staff",
      pickedAt: new Date(),
    };
    query.assignedStaff = {
      staffId: String(staff._id),
      name: staff.name,
      email: staff.email,
      phone: staff.phone || "",
      designation: staff.designation || "Support Agent",
      department: staff.departmentname || String(staff.department || ""),
      assignedAt: new Date(),
    };
    query.assignedBy = assignedBy;
    query.taskId = task._id;
    query.taskCode = task.taskId;
    await query.save();

    staff.assignedQueries = (staff.assignedQueries || 0) + 1;
    await staff.save();

    return res.status(201).json({
      success: true,
      message: `Query assigned to ${staff.name} and task ${task.taskId} created successfully`,
      data: { query, task },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Existing self-pick flow retained for staff/admin compatibility.
exports.pickQuery = async (req, res) => {
  try {
    const query = await findQuery(req.params.id);
    if (!query) return res.status(404).json({ success: false, message: "Query not found" });
    if (query.taskId) return res.status(409).json({ success: false, message: "This query is already picked and a task already exists", data: query });

    const requesterRole = String(req.user?.role || "").toLowerCase();
    if (!["staff", "admin"].includes(requesterRole)) return res.status(403).json({ success: false, message: "Only Admin or Staff can pick a query" });

    const pickedByRole = String(req.body.pickedByRole || requesterRole).toLowerCase();
    const pickedById = req.body.pickedById || req.user.id;
    if (!["staff", "admin"].includes(pickedByRole)) return res.status(400).json({ success: false, message: "pickedByRole must be staff or admin" });
    if (requesterRole !== "admin" && String(pickedById) !== String(req.user.id)) return res.status(403).json({ success: false, message: "Staff can only pick queries for themselves" });

    let actor;
    if (pickedByRole === "staff") actor = await Staff.findById(pickedById);
    else actor = await User.findOne({ _id: pickedById, role: { $in: ["Admin", "admin"] } });
    if (!actor) return res.status(404).json({ success: false, message: `${pickedByRole} not found` });

    const task = await buildTaskFromQuery({ query, assignee: actor, assigneeRole: pickedByRole });

    query.status = pickedByRole === "staff" ? "Assigned" : "Picked";
    query.pickedBy = { userId: String(actor._id), name: actor.name, email: actor.email, role: pickedByRole, pickedAt: new Date() };
    query.taskId = task._id;
    query.taskCode = task.taskId;
    await query.save();

    if (pickedByRole === "staff") {
      actor.assignedQueries = (actor.assignedQueries || 0) + 1;
      await actor.save();
    }

    return res.status(201).json({ success: true, message: "Query picked and task created successfully", data: { query, task } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.addMessage = async (req, res) => {
  try {
    const query = await findQuery(req.params.id);
    if (!query) return res.status(404).json({ success: false, message: "Query not found" });
    const { message, senderType, senderName } = req.body;
    if (!message) return res.status(400).json({ success: false, message: "Message is required" });

    const type = String(req.user.role || "").toLowerCase() === "customer" ? "customer" : (senderType || String(req.user.role || "staff").toLowerCase());
    query.messages.push({
      senderType: type,
      senderId: String(req.user.id),
      senderName: senderName || (type === "customer" ? query.customer.name : "Support"),
      message,
    });
    await query.save();
    return res.status(201).json({ success: true, data: query });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
