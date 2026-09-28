const Task = require("../models/Task");
const Installation = require("../models/Installation");
const Department = require("../models/Department");
const Staff = require("../models/StaffModel");
const User = require("../models/StaffModel");

// exports.getReportsAnalytics = async (req, res) => {
//   try {
//     const { department, fromDate, toDate, staff } = req.query;

//     // 1. Fetch Departments (Lookup Dictionary)
//     const allDepartments = await Department.find({}).lean();
//     const deptMap = {};
//     allDepartments.forEach((d) => {
//       deptMap[String(d._id)] = d.name;
//     });

//     // 2. Fetch All Master Staff Members
//     let userFilter = { role: { $regex: new RegExp("^staff$", "i") } };
//     const rawMasterStaff = await User.find(userFilter)
//       .select("name email staffId department departmentname role")
//       .lean();

//     const allMasterStaff = rawMasterStaff.map((s) => {
//       let deptName = "technical";
//       if (s.department && deptMap[String(s.department)]) {
//         deptName = deptMap[String(s.department)];
//       } else if (s.departmentname) {
//         deptName = s.departmentname;
//       } else if (typeof s.department === "string") {
//         deptName = s.department;
//       }

//       return {
//         _id: String(s._id),
//         name: s.name || s.email?.split("@")[0] || "Staff Member",
//         email: s.email || "",
//         staffId: s.staffId || String(s._id),
//         department: deptName,
//       };
//     });

//     // 3. Build Task Filter
//     let taskFilter = {};

//     if (fromDate || toDate) {
//       taskFilter.createdAt = {};
//       if (fromDate) {
//         const start = new Date(fromDate);
//         start.setHours(0, 0, 0, 0);
//         taskFilter.createdAt.$gte = start;
//       }
//       if (toDate) {
//         const end = new Date(toDate);
//         end.setHours(23, 59, 59, 999);
//         taskFilter.createdAt.$lte = end;
//       }
//     }

//     if (staff && staff !== "ALL") {
//       const matchedStaffObj = allMasterStaff.find(
//         (s) =>
//           s.name.toLowerCase() === staff.toLowerCase() ||
//           s.email.toLowerCase() === staff.toLowerCase() ||
//           s.staffId === staff
//       );

//       if (matchedStaffObj) {
//         taskFilter["$or"] = [
//           { "assignedStaff.staffId": matchedStaffObj._id },
//           { "assignedStaff.staffId": matchedStaffObj.staffId },
//           { "assignedStaff.email": matchedStaffObj.email },
//         ];
//       }
//     }

//     // 4. Fetch Tasks Data
//     const rawTasks = await Task.find(taskFilter).sort({ createdAt: -1 }).lean();

//     // 5. Map Tasks to include Staff Name & Department Name
//     const formattedTaskList = rawTasks.map((t) => {
//       let staffName = "Unassigned";
//       let staffDept = "General";

//       if (t.assignedStaff) {
//         const st = t.assignedStaff;

//         // Match with masterStaff array using staffId or email
//         const matchedStaff = allMasterStaff.find(
//           (s) =>
//             s._id === String(st.staffId) ||
//             s.staffId === String(st.staffId) ||
//             s.email.toLowerCase() === String(st.email).toLowerCase()
//         );

//         if (matchedStaff) {
//           staffName = matchedStaff.name;
//           staffDept = matchedStaff.department;
//         } else {
//           // Fallback agar direct department text ho embedded object me
//           if (st.department) staffDept = st.department;
//           if (st.email) staffName = st.email.split("@")[0];
//         }
//       }

//       return {
//         taskId: t.taskId || `TSK-${t._id.toString().slice(-4).toUpperCase()}`,
//         clientName: t.partyDetails?.partyName || t.partyDetails?.contactPerson || "N/A",
//         softwareType: t.softwareType || t.softwareDetails || "General",
//         assignedStaffName: staffName,
//         assignedStaffDept: staffDept,
//         assignedDate: t.createdAt ? new Date(t.createdAt).toLocaleDateString("en-GB") : "-",
//         dueDate: t.dueDate ? new Date(t.dueDate).toLocaleDateString("en-GB") : "-",
//         progressDate: t.dueDate ? new Date(t.dueDate).toLocaleDateString("en-GB") : "-",
//         status: t.status || "Pending",
//         priority: t.priority || "High",
//       };
//     });

//     // Filter by Department if department filter is active
//     const finalTaskList = (department && department !== "All")
//       ? formattedTaskList.filter((t) => t.assignedStaffDept.toLowerCase() === department.toLowerCase())
//       : formattedTaskList;

//     // Filter Master Staff list according to selected department
//     const filteredMasterStaff = (department && department !== "All")
//       ? allMasterStaff.filter((s) => s.department.toLowerCase() === department.toLowerCase())
//       : allMasterStaff;

//     // 6. Summary Counters
//     const totalTasks = finalTaskList.length;
//     const completedTasks = finalTaskList.filter((t) => t.status === "Completed").length;
//     const pendingTasks = finalTaskList.filter((t) => t.status === "Pending").length;
//     const inProgressTasks = finalTaskList.filter((t) => t.status === "In Progress").length;

//     const completionPercentage =
//       totalTasks > 0 ? Number(((completedTasks / totalTasks) * 100).toFixed(1)) : 0;

//     const taskStatusSplit = [
//       { name: "Completed", value: completedTasks, color: "#10b981" },
//       { name: "Pending", value: pendingTasks, color: "#f59e0b" },
//       { name: "In Progress", value: inProgressTasks, color: "#3b82f6" },
//     ];

//     // 7. Staff Performance Calculation
//     const staffProgress = filteredMasterStaff.map((staffMember) => {
//       const assignedTasks = finalTaskList.filter(
//         (t) => t.assignedStaffName.toLowerCase() === staffMember.name.toLowerCase()
//       );

//       const totalAssigned = assignedTasks.length;
//       const completed = assignedTasks.filter((t) => t.status === "Completed").length;
//       const pending = assignedTasks.filter((t) => t.status === "Pending").length;
//       const inProgress = assignedTasks.filter((t) => t.status === "In Progress").length;

//       return {
//         name: staffMember.name,
//         email: staffMember.email,
//         staffId: staffMember.staffId,
//         department: staffMember.department,
//         totalAssigned,
//         completed,
//         pending,
//         inProgress,
//         completionRate: totalAssigned > 0 ? Number(((completed / totalAssigned) * 100).toFixed(1)) : 0,
//       };
//     });

//     // 8. Final Response
//     res.status(200).json({
//       success: true,
//       masterStaffList: allMasterStaff,
//       summary: {
//         totalTasks,
//         completedTasks,
//         pendingTasks,
//         inProgressTasks,
//         completionPercentage,
//       },
//       taskStatusSplit,
//       staffProgress,
//       taskList: finalTaskList,
//     });
//   } catch (error) {
//     console.error("Error in getReportsAnalytics:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

exports.getReportsAnalytics = async (req, res) => {
  try {
    const { department, fromDate, toDate, staff } = req.query;

    // 1. Fetch Departments (Lookup Dictionary)
    const allDepartments = await Department.find({}).lean();
    const deptMap = {};
    allDepartments.forEach((d) => {
      deptMap[String(d._id)] = d.name;
    });

    // 2. Fetch All Master Staff Members
    let userFilter = { role: { $regex: new RegExp("^staff$", "i") } };
    const rawMasterStaff = await User.find(userFilter)
      .select("name email staffId department departmentname role")
      .lean();

    const allMasterStaff = rawMasterStaff.map((s) => {
      let deptName = "technical";
      if (s.department && deptMap[String(s.department)]) {
        deptName = deptMap[String(s.department)];
      } else if (s.departmentname) {
        deptName = s.departmentname;
      } else if (typeof s.department === "string") {
        deptName = s.department;
      }

      return {
        _id: String(s._id),
        name: s.name || s.email?.split("@")[0] || "Staff Member",
        email: s.email || "",
        staffId: s.staffId || String(s._id),
        department: deptName,
      };
    });

    // 3. Build Task Filter
    let taskFilter = {};

    if (fromDate || toDate) {
      taskFilter.createdAt = {};
      if (fromDate) {
        const start = new Date(fromDate);
        start.setHours(0, 0, 0, 0);
        taskFilter.createdAt.$gte = start;
      }
      if (toDate) {
        const end = new Date(toDate);
        end.setHours(23, 59, 59, 999);
        taskFilter.createdAt.$lte = end;
      }
    }

    if (staff && staff !== "ALL") {
      const matchedStaffObj = allMasterStaff.find(
        (s) =>
          s.name.toLowerCase() === staff.toLowerCase() ||
          s.email.toLowerCase() === staff.toLowerCase() ||
          s.staffId === staff
      );

      if (matchedStaffObj) {
        taskFilter["$or"] = [
          { "assignedStaff.staffId": matchedStaffObj._id },
          { "assignedStaff.staffId": matchedStaffObj.staffId },
          { "assignedStaff.email": matchedStaffObj.email },
        ];
      }
    }

    // 4. Fetch Tasks Data
    const rawTasks = await Task.find(taskFilter).sort({ createdAt: -1 }).lean();

    // Installations are also reportable records. Older installations may exist
    // without a linked Task document, so fetch them separately and add them
    // to the report as Installation records. Linked installations are not
    // duplicated because their installationId is already present on a Task.
    const installationFilter = {};
    if (fromDate || toDate) {
      installationFilter.createdAt = {};
      if (fromDate) {
        const start = new Date(fromDate);
        start.setHours(0, 0, 0, 0);
        installationFilter.createdAt.$gte = start;
      }
      if (toDate) {
        const end = new Date(toDate);
        end.setHours(23, 59, 59, 999);
        installationFilter.createdAt.$lte = end;
      }
    }
    const rawInstallations = await Installation.find(installationFilter).sort({ createdAt: -1 }).lean();
    const linkedInstallationIds = new Set(
      rawTasks.map((t) => String(t.installationId || "")).filter(Boolean)
    );

    // 5. Map Tasks to include Staff Name & Department Name & StatusHistory Date
    const formattedTaskList = rawTasks.map((t) => {
      let staffName = "Unassigned";
      let staffDept = "General";

      if (t.assignedStaff) {
        const st = t.assignedStaff;

        // Match with masterStaff array using staffId or email
        const matchedStaff = allMasterStaff.find(
          (s) =>
            s._id === String(st.staffId) ||
            s.staffId === String(st.staffId) ||
            s.email.toLowerCase() === String(st.email).toLowerCase()
        );

        if (matchedStaff) {
          staffName = matchedStaff.name;
          staffDept = matchedStaff.department;
        } else {
          // Fallback agar direct department text ho embedded object me
          if (st.department) staffDept = st.department;
          if (st.email) staffName = st.email.split("@")[0];
        }
      }

      // --- STATUS HISTORY LAST INDEX DATE EXTRACT ---
      const lastHistory = t.statusHistory && t.statusHistory.length > 0 
        ? t.statusHistory[t.statusHistory.length - 1] 
        : null;

      // Extract raw date from status history or fallbacks
      const rawProgressDate = lastHistory?.date || lastHistory?.createdAt || t.progressDate 

      return {
        _id: String(t._id),
        taskMongoId: String(t._id),
        sourceType: t.sourceType || (t.installationId ? "Installation" : "CustomerQuery"),
        sourceQueryId: t.sourceQueryId ? String(t.sourceQueryId) : "",
        sourceQueryCode: t.sourceQueryCode || "",
        taskId: t.taskId || `TSK-${t._id.toString().slice(-4).toUpperCase()}`,
        title: t.title || "",
        createdAt: t.createdAt,
        clientName: t.partyDetails?.partyName || t.partyDetails?.contactPerson || "N/A",
        softwareType: t.softwareType || "General",
        softwareDetails: t.softwareDetails || "",
        softwareFeature: t.softwareFeature || [],
        material: t.material || [],
        // Installation date is stored on the task as dueDate for installation tasks.
        installationDate: t.installationDate || (t.sourceType === "Installation" ? t.dueDate : null),
        description: t.description || "",
        preferredContact: t.preferredContact || "",
        partyDetails: t.partyDetails || {},
        assignedStaff: t.assignedStaff || null,
        progress: typeof t.progress === "number" ? t.progress : 0,
        remarks: t.remarks || [],
        files: t.files || [],
        sourceQueryId: t.sourceQueryId ? String(t.sourceQueryId) : "",
        sourceQueryCode: t.sourceQueryCode || "",
        installationId: t.installationId || "",
        assignedStaffName: staffName,
        assignedStaffDept: staffDept,
        assignedDate: t.createdAt ? new Date(t.createdAt).toLocaleDateString("en-GB") : "-",
        dueDate: t.dueDate ? new Date(t.dueDate).toLocaleDateString("en-GB") : "-",
        billNumber: t.partyDetails?.billNumber ,
        poNumber: t.partyDetails?.poNumber,
        billDate: t.partyDetails?.billDate,
        // Dynamic progress date from statusHistory array
        progressDate: rawProgressDate ? new Date(rawProgressDate).toLocaleDateString("en-GB") : "-",
        
        status: t.status || "Pending",
        priority: t.priority || "High",
      };
    });

    // Add older/unlinked installations so the Installation report tab is never
    // empty merely because its task was not created or was created before the
    // sourceType/installationId fields were introduced.
    const unlinkedInstallationRows = rawInstallations
      .filter((installation) => !linkedInstallationIds.has(String(installation._id)))
      .map((installation) => {
        const staff = installation.assignedStaff || {};
        const staffName = staff.fullName || staff.name || (staff.email ? staff.email.split("@")[0] : "Unassigned");
        const staffDept = staff.department?.name || staff.department || "General";
        return {
          _id: String(installation._id),
          taskMongoId: String(installation._id),
          sourceType: "Installation",
          sourceQueryId: "",
          sourceQueryCode: "",
          taskId: `TSK-${String(installation._id).slice(-4).toUpperCase()}`,
          title: `Installation - ${installation.partyName || "Installation"}`,
          createdAt: installation.createdAt,
          clientName: installation.partyName || installation.contactPerson || "N/A",
          softwareType: installation.softwareType || "General",
          softwareDetails: installation.softwareDetails || "",
          softwareFeature: installation.softwareFeature || [],
          material: installation.material || [],
          installationDate: installation.installationDate || null,
          description: installation.softwareDetails || `Installation - ${installation.partyName || ""}`,
          preferredContact: "",
          partyDetails: {
            poNumber: installation.poNumber || "",
            billNumber: installation.billNumber || "",
            billDate: installation.billDate || null,
            partyName: installation.partyName || "",
            address: installation.address || "",
            location: installation.location || "",
            contactPerson: installation.contactPerson || "",
            mobileNo: installation.mobileNo || "",
            alternateNo: installation.alternateNo || "",
            email: installation.email || "",
            salesPersonName: installation.salesPersonName || "",
          },
          assignedStaff: staff,
          progress: installation.status === "Completed" ? 100 : installation.status === "In Progress" ? 10 : 0,
          remarks: [],
          files: [],
          installationId: String(installation._id),
          assignedStaffName: staffName,
          assignedStaffDept: staffDept,
          assignedDate: installation.createdAt ? new Date(installation.createdAt).toLocaleDateString("en-GB") : "-",
          dueDate: installation.installationDate ? new Date(installation.installationDate).toLocaleDateString("en-GB") : "-",
          billNumber: installation.billNumber || "",
          poNumber: installation.poNumber || "",
          billDate: installation.billDate || null,
          progressDate: installation.updatedAt ? new Date(installation.updatedAt).toLocaleDateString("en-GB") : "-",
          status: installation.status || "Pending",
          priority: installation.priority || "Medium",
        };
      });

    const allReportRows = [...formattedTaskList, ...unlinkedInstallationRows]
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

    // Filter by Department if department filter is active
    const finalTaskList = (department && department !== "All")
      ? allReportRows.filter((t) => t.assignedStaffDept.toLowerCase() === department.toLowerCase())
      : allReportRows;

    // Filter Master Staff list according to selected department
    const filteredMasterStaff = (department && department !== "All")
      ? allMasterStaff.filter((s) => s.department.toLowerCase() === department.toLowerCase())
      : allMasterStaff;

    // 6. Summary Counters
    const totalTasks = finalTaskList.length;
    const completedTasks = finalTaskList.filter((t) => t.status === "Completed").length;
    const pendingTasks = finalTaskList.filter((t) => t.status === "Pending").length;
    const inProgressTasks = finalTaskList.filter((t) => t.status === "In Progress").length;

    const completionPercentage =
      totalTasks > 0 ? Number(((completedTasks / totalTasks) * 100).toFixed(1)) : 0;

    const taskStatusSplit = [
      { name: "Completed", value: completedTasks, color: "#10b981" },
      { name: "Pending", value: pendingTasks, color: "#f59e0b" },
      { name: "In Progress", value: inProgressTasks, color: "#3b82f6" },
    ];

    // 7. Staff Performance Calculation
    const staffProgress = filteredMasterStaff.map((staffMember) => {
      const assignedTasks = finalTaskList.filter(
        (t) => t.assignedStaffName.toLowerCase() === staffMember.name.toLowerCase()
      );

      const totalAssigned = assignedTasks.length;
      const completed = assignedTasks.filter((t) => t.status === "Completed").length;
      const pending = assignedTasks.filter((t) => t.status === "Pending").length;
      const inProgress = assignedTasks.filter((t) => t.status === "In Progress").length;

      return {
        name: staffMember.name,
        email: staffMember.email,
        staffId: staffMember.staffId,
        department: staffMember.department,
        totalAssigned,
        completed,
        pending,
        inProgress,
        completionRate: totalAssigned > 0 ? Number(((completed / totalAssigned) * 100).toFixed(1)) : 0,
      };
    });

    // 8. Final Response
    res.status(200).json({
      success: true,
      masterStaffList: allMasterStaff,
      summary: {
        totalTasks,
        completedTasks,
        pendingTasks,
        inProgressTasks,
        completionPercentage,
      },
      taskStatusSplit,
      staffProgress,
      taskList: finalTaskList,
    });
  } catch (error) {
    console.error("Error in getReportsAnalytics:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const { department, year } = req.query;

    // Filter building based on department selection
    let taskMatch = {};
    if (department && department !== "All") {
      taskMatch["assignedStaff.department"] = {
        $regex: new RegExp(`^${department}$`, "i"),
      };
    }

    // Dynamic Departments List for Filter Dropdown
    const deptDocs = await Department.find({}).select("name");
    const departmentsList = deptDocs.map((d) => d.name);

    // 1. Dynamic KPIs Calculations
    const totalTasks = await Task.countDocuments(taskMatch);

    const pendingTasks = await Task.countDocuments({
      ...taskMatch,
      status: { $in: ["Pending", "In Progress"] },
    });

    const completedTasks = await Task.countDocuments({
      ...taskMatch,
      status: { $in: ["Completed", "Resolved"] },
    });

    const totalDepartments = await Department.countDocuments();
    const activeStaff = await Staff.countDocuments({ status: "Active" });
    const totalStaff = await Staff.countDocuments();

    // 2. Task Status Distribution (Pie Chart)
    const statusAgg = await Task.aggregate([
      { $match: taskMatch },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const statusPieData = statusAgg.map((item) => ({
      name: item._id || "Other",
      value: item.count,
    }));

    // 3. Monthly Task Trends Chart (Filterable by Year)
    const selectedYear = year ? parseInt(year) : new Date().getFullYear();
    const startDate = new Date(`${selectedYear}-01-01`);
    const endDate = new Date(`${selectedYear}-12-31T23:59:59`);

    const monthlyAggregate = await Task.aggregate([
      {
        $match: {
          ...taskMatch,
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: 1 },
          completed: {
            $sum: {
              $cond: [{ $in: ["$status", ["Completed", "Resolved"]] }, 1, 0],
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    const monthlyQueries = monthNames.map((month, idx) => {
      const found = monthlyAggregate.find((m) => m._id === idx + 1);
      return {
        month,
        total: found ? found.total : 0,
        completed: found ? found.completed : 0,
      };
    });

    // 4. Staff Workload Progress (Filtered by Department)
    const tasks = await Task.find({
      "assignedStaff.staffId": { $exists: true, $ne: null },
      ...taskMatch,
    });

    const staffIds = [
      ...new Set(tasks.map((t) => t.assignedStaff?.staffId).filter(Boolean)),
    ];

    const staffDocs = await Staff.find({ _id: { $in: staffIds } }).select(
      "name fullName _id"
    );

    const staffMap = {};
    staffDocs.forEach((s) => {
      staffMap[s._id.toString()] = s.fullName || s.name;
    });

    const perfMap = {};

    tasks.forEach((task) => {
      const staffInfo = task.assignedStaff;
      if (!staffInfo || !staffInfo.staffId) return;

      const sId = staffInfo.staffId.toString();
      const staffName = staffMap[sId] || "Support Agent";
      const dept = staffInfo.department || "General";

      const key = `${sId}_${dept}`;

      if (!perfMap[key]) {
        perfMap[key] = {
          staffName,
          department: dept,
          totalAssigned: 0,
          completed: 0,
          progress: 0,
        };
      }

      perfMap[key].totalAssigned += 1;

      if (["Completed", "Resolved"].includes(task.status) || task.progress === 100) {
        perfMap[key].completed += 1;
      }
    });

    const departmentPerformance = Object.values(perfMap).map((item) => ({
      ...item,
      progress:
        item.totalAssigned > 0
          ? Math.round((item.completed / item.totalAssigned) * 100)
          : 0,
    }));

    // 5. Recent Tasks (Latest 5)
    const tasksList = await Task.find(taskMatch)
      .sort({ createdAt: -1 })
      .limit(5);

    const recentQueries = tasksList.map((task) => ({
      _id: task._id,
      taskId:
        task.taskId ||
        task.ticketId ||
        `TK-${task._id.toString().slice(-6).toUpperCase()}`,
      sourceQueryId: task.sourceQueryId || null,
      sourceQueryCode: task.sourceQueryCode || "",
      title: task.title || "",
      partyName: task.partyDetails?.partyName || task.partyDetails?.contactPerson || "N/A",
      partyDetails: task.partyDetails || {},
      department: task.assignedStaff?.department || "General",
      assignedStaff: task.assignedStaff || null,
      status: task.status || "Pending",
      softwareDetails: task.softwareDetails || "",
      softwareType: task.softwareType || "",
      material: task.material || [],
      createdAt: task.createdAt,
      priority: task.priority || "Medium"
    }));

    return res.status(200).json({
      success: true,
      departmentsList,
      kpis: {
        totalTasks,
        pendingTasks,
        completedTasks,
        totalDepartments,
        activeStaff,
        totalStaff,
      },
      statusPieData,
      monthlyQueries,
      departmentPerformance,
      recentQueries,
    });
  } catch (error) {
    console.error("Dashboard Analytics Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error fetching analytics",
      error: error.message,
    });
  }
};

// exports.getDashboardStats = async (req, res) => {
//   try {
//     const { department, year } = req.query;

//     // Filter building based on department selection
//     let taskMatch = {};
//     if (department && department !== "All") {
//       // Case-insensitive match for department filter
//       taskMatch["assignedStaff.department"] = {
//         $regex: new RegExp(`^${department}$`, "i"),
//       };
//     }

//     // 1. Dynamic KPIs Calculations
//     const totalTasks = await Task.countDocuments(taskMatch);

//     const pendingTasks = await Task.countDocuments({
//       ...taskMatch,
//       status: { $in: ["Pending", "In Progress"] },
//     });

//     const completedTasks = await Task.countDocuments({
//       ...taskMatch,
//       status: { $in: ["Completed", "Resolved"] },
//     });

//     const totalDepartments = await Department.countDocuments();
//     const activeStaff = await Staff.countDocuments({ status: "Active" });
//     const totalStaff = await Staff.countDocuments();

//     // 2. Task Status Distribution (Pie Chart)
//     const statusAgg = await Task.aggregate([
//       { $match: taskMatch },
//       { $group: { _id: "$status", count: { $sum: 1 } } },
//     ]);

//     const statusPieData = statusAgg.map((item) => ({
//       name: item._id || "Other",
//       value: item.count,
//     }));

//     // 3. Monthly Task Trends Chart (Filterable by Year)
//     const selectedYear = year ? parseInt(year) : new Date().getFullYear();
//     const startDate = new Date(`${selectedYear}-01-01`);
//     const endDate = new Date(`${selectedYear}-12-31T23:59:59`);

//     const monthlyAggregate = await Task.aggregate([
//       {
//         $match: {
//           ...taskMatch,
//           createdAt: { $gte: startDate, $lte: endDate },
//         },
//       },
//       {
//         $group: {
//           _id: { $month: "$createdAt" },
//           total: { $sum: 1 },
//           completed: {
//             $sum: {
//               $cond: [{ $in: ["$status", ["Completed", "Resolved"]] }, 1, 0],
//             },
//           },
//         },
//       },
//       { $sort: { _id: 1 } },
//     ]);

//     const monthNames = [
//       "Jan",
//       "Feb",
//       "Mar",
//       "Apr",
//       "May",
//       "Jun",
//       "Jul",
//       "Aug",
//       "Sep",
//       "Oct",
//       "Nov",
//       "Dec",
//     ];
//     const monthlyQueries = monthNames.map((month, idx) => {
//       const found = monthlyAggregate.find((m) => m._id === idx + 1);
//       return {
//         month,
//         total: found ? found.total : 0,
//         completed: found ? found.completed : 0,
//       };
//     });

//     // 4. Staff Workload Progress (Filtered by Department)
//     const tasks = await Task.find({
//       "assignedStaff.staffId": { $exists: true, $ne: null },
//       ...taskMatch, // Filter automatically applies here
//     });

//     const staffIds = [
//       ...new Set(tasks.map((t) => t.assignedStaff?.staffId).filter(Boolean)),
//     ];

//     const staffDocs = await Staff.find({ _id: { $in: staffIds } }).select(
//       "name fullName _id"
//     );

//     const staffMap = {};
//     staffDocs.forEach((s) => {
//       staffMap[s._id.toString()] = s.fullName || s.name;
//     });

//     const perfMap = {};

//     tasks.forEach((task) => {
//       const staffInfo = task.assignedStaff;
//       if (!staffInfo || !staffInfo.staffId) return;

//       const sId = staffInfo.staffId.toString();

//       const staffName =
//         staffMap[sId] || task.remarks?.[0]?.author || "Support Agent";
//       const dept = staffInfo.department || "General";

//       const key = `${sId}_${dept}`;

//       if (!perfMap[key]) {
//         perfMap[key] = {
//           staffName,
//           department: dept,
//           totalAssigned: 0,
//           completed: 0,
//           progress: 0,
//         };
//       }

//       perfMap[key].totalAssigned += 1;

//       if (task.status === "Completed" || task.progress === 100) {
//         perfMap[key].completed += 1;
//       }
//     });

//     // Calculate percentage progress for each staff/department
//     const departmentPerformance = Object.values(perfMap).map((item) => ({
//       ...item,
//       progress:
//         item.totalAssigned > 0
//           ? Math.round((item.completed / item.totalAssigned) * 100)
//           : 0,
//     }));

//     // 5. Recent Tasks (Latest 5) - With Task ID and Department Name
//     const tasksList = await Task.find(taskMatch)
//       .sort({ createdAt: -1 })
//       .limit(5);

//     const recentQueries = tasksList.map((task) => ({
//       _id: task._id,
//       taskId:
//         task.taskId ||
//         task.ticketId ||
//         `TK-${task._id.toString().slice(-6).toUpperCase()}`,
//       title: task.title,
//       partyName: task.partyDetails?.partyName || "N/A",
//       department: task.assignedStaff?.department || "General",
//       status: task.status,
//       createdAt: task.createdAt,
//     }));

//     // Response
//     return res.status(200).json({
//       success: true,
//       kpis: {
//         totalTasks,
//         pendingTasks,
//         completedTasks,
//         totalDepartments,
//         activeStaff,
//         totalStaff,
//       },
//       statusPieData,
//       monthlyQueries,
//       departmentPerformance,
//       recentQueries,
//     });
//   } catch (error) {
//     console.error("Dashboard Analytics Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Server Error fetching analytics",
//       error: error.message,
//     });
//   }
// };