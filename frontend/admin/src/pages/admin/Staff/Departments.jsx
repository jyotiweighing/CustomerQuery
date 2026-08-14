import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  Building2,
  Users,
  Inbox,
  Plus,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  Briefcase,
  User,
  CheckCircle2,
  Clock,
  Calendar,
  ChevronDown,
  ChevronUp,
  Mail,
  AlertTriangle,
} from "lucide-react";
import PageHeader from "../../../components/admin/common/PageHeader";
import Button from "../../../components/admin/common/Button";
import {
  getDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment,
} from "../../../services/admin/departmentService";
import { getstafftask } from "../../../services/admin/staffService";
import { showAlert } from "../../../utils/sweetAlert";
import { MessageSquare } from "lucide-react";
import { addTaskRemark } from "../../../services/staff/taskService";

export default function Departments() {
  const [departmentList, setDepartmentList] = useState([]);
  const [staffTaskList, setStaffTaskList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 9;
  const [activeModal, setActiveModal] = useState(null); // 'staff' | 'tasks' | null
  const [selectedDept, setSelectedDept] = useState(null);
  const [expandedStaffId, setExpandedStaffId] = useState(null);
  const [staffCurrentPage, setStaffCurrentPage] = useState(1);
  const staffPerPage = 6;
  const [tasksCurrentPage, setTasksCurrentPage] = useState(1);
  const tasksPerPage = 2;

  // 🆕 Remarks related states
  const [expandedRemarksId, setExpandedRemarksId] = useState(null);
  const [remarkText, setRemarkText] = useState({}); // { [taskId]: "typed text" }
  const [submittingRemarkId, setSubmittingRemarkId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  // const fetchData = async () => {
  //   setLoading(true);
  //   try {
  //     const [deptRes, staffRes] = await Promise.all([
  //       getDepartments(),
  //       getstafftask(),
  //     ]);

  //     const depts = deptRes.departments || deptRes.data || [];
  //     setDepartmentList(depts);

  //     const staffData =
  //       staffRes.data ||
  //       staffRes.staff ||
  //       (Array.isArray(staffRes) ? staffRes : []);
  //     setStaffTaskList(staffData);

  //     setCurrentPage(1);
  //   } catch (err) {
  //     console.error("Failed to fetch data:", err);
  //     showAlert({
  //       icon: "error",
  //       title: "Error",
  //       text: "Failed to load workspace data",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchData = async () => {
  setLoading(true);
  try {
    // 1. Fetch Departments (Main Priority)
    try {
      const deptRes = await getDepartments();
      const depts = deptRes.departments || deptRes.data || [];
      setDepartmentList(depts);
    } catch (deptErr) {
      console.error("Failed to fetch departments:", deptErr);
      setDepartmentList([]);
    }

    // 2. Fetch Staff Tasks (Fail-safe)
    try {
      const staffRes = await getstafftask();
      const staffData =
        staffRes.data ||
        staffRes.staff ||
        (Array.isArray(staffRes) ? staffRes : []);
      setStaffTaskList(staffData);
    } catch (staffErr) {
      console.warn("No staff found or error fetching staff:", staffErr);
      // Agar staff nahi milta toh empty array set kar do taaki UI crash na ho
      setStaffTaskList([]);
    }

    setCurrentPage(1);
  } catch (err) {
    console.error("Failed to fetch data:", err);
  } finally {
    setLoading(false);
  }
};
  const formatDate = (dateString) => {
    if (!dateString) return "Not Specified";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const handleAddDept = async () => {
    const { value: deptName } = await Swal.fire({
      background: "transparent",
      showCancelButton: true,
      confirmButtonText: "Create Now ➔",
      cancelButtonText: "Cancel",
      buttonsStyling: false,
      customClass: {
        popup: "p-0 bg-transparent shadow-none border-none max-w-md w-full",
        actions:
          "flex flex-row justify-end gap-3 mt-6 pt-4 border-t border-slate-100 w-full",
        confirmButton:
          "px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-2xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer",
        cancelButton:
          "px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-2xl transition-all cursor-pointer",
      },
      html: `
        <div class="relative text-left font-sans p-6 rounded-[32px] bg-white border border-slate-200 shadow-2xl">
          <div class="absolute top-5 right-5 bg-emerald-50 text-emerald-600 border border-emerald-200 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-sm flex items-center gap-1">
            <span>⚡</span> ADD TEAM
          </div>
          <div class="flex items-center gap-3.5 mb-6 pr-24">
            <div class="h-12 w-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xl shrink-0">⚡</div>
            <div>
              <h3 class="text-xl font-extrabold text-slate-900 tracking-tight leading-snug">Create Department</h3>
              <p class="text-xs text-slate-500 mt-0.5 leading-relaxed">Add a new operational group to your workspace</p>
            </div>
          </div>
          <div class="space-y-2 mt-4">
            <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Department Title</label>
            <input id="swal-light-input" class="w-full px-4 py-3.5 text-sm font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-slate-400 block" placeholder="e.g. Technical Support, Sales..." autocomplete="off" />
          </div>
        </div>
      `,
      preConfirm: () => {
        const input = document.getElementById("swal-light-input");
        if (!input || !input.value.trim()) {
          Swal.showValidationMessage("Please provide a department name");
          return false;
        }
        return input.value.trim();
      },
    });

    if (deptName) {
      try {
        await addDepartment({ name: deptName });
        showAlert({
          icon: "success",
          title: "Created!",
          text: "Department added successfully",
          timer: 1500,
          showConfirmButton: false,
        });
        fetchData();
      } catch (err) {
        showAlert({
          icon: "error",
          title: "Error",
          text: err.response?.data?.message || "Could not add department",
        });
      }
    }
  };

  const handleEditDept = async (dept) => {
    const { value: updatedName } = await Swal.fire({
      background: "transparent",
      showCancelButton: true,
      confirmButtonText: "Save Changes ➔",
      cancelButtonText: "Cancel",
      buttonsStyling: false,
      customClass: {
        popup: "p-0 bg-transparent shadow-none border-none max-w-md w-full",
        actions:
          "flex flex-row justify-end gap-3 mt-6 pt-4 border-t border-slate-100 w-full",
        confirmButton:
          "px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all cursor-pointer",
        cancelButton:
          "px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-2xl transition-all cursor-pointer",
      },
      html: `
        <div class="relative text-left font-sans p-6 rounded-[32px] bg-white border border-slate-200 shadow-2xl">
          <div class="absolute top-5 right-5 bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-sm flex items-center gap-1"><span>✎</span> EDIT MODE</div>
          <div class="flex items-center gap-3.5 mb-6 pr-24">
            <div class="h-12 w-12 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center font-bold text-xl shrink-0">🛠️</div>
            <div>
              <h3 class="text-xl font-extrabold text-slate-900 tracking-tight leading-snug">Update Department</h3>
              <p class="text-xs text-slate-500 mt-0.5 leading-relaxed">Modify department details in workspace</p>
            </div>
          </div>
          <div class="space-y-2 mt-4">
            <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Department Title</label>
            <input id="swal-light-edit" value="${dept.name}" class="w-full px-4 py-3.5 text-sm font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all block" autocomplete="off" />
          </div>
        </div>
      `,
      preConfirm: () => {
        const input = document.getElementById("swal-light-edit");
        if (!input || !input.value.trim()) {
          Swal.showValidationMessage("Department name cannot be empty!");
          return false;
        }
        return input.value.trim();
      },
    });

    if (updatedName && updatedName !== dept.name) {
      try {
        await updateDepartment(dept.id || dept._id, { name: updatedName });
        showAlert({
          icon: "success",
          title: "Updated!",
          text: "Department updated successfully",
          timer: 1500,
          showConfirmButton: false,
        });
        fetchData();
      } catch (err) {
        showAlert({
          icon: "error",
          title: "Error",
          text: err.response?.data?.message || "Could not update department",
        });
      }
    }
  };

  const handleDeleteDept = async (id) => {
    const result = await Swal.fire({
      background: "transparent",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete It",
      cancelButtonText: "Keep It",
      buttonsStyling: false,
      customClass: {
        popup: "p-0 bg-transparent shadow-none border-none max-w-sm w-full",
        actions: "flex flex-col gap-2 mt-4 w-full",
        confirmButton:
          "w-full py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm rounded-2xl shadow-lg shadow-rose-500/20 active:scale-95 transition-all cursor-pointer",
        cancelButton:
          "w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-2xl transition-all cursor-pointer",
      },
      html: `
        <div class="relative text-center font-sans p-6 rounded-[32px] bg-white border border-slate-200 shadow-2xl">
          <div class="mx-auto mb-4 h-16 w-16 rounded-3xl bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center text-2xl shadow-sm">🗑️</div>
          <h3 class="text-xl font-extrabold text-slate-900 tracking-tight">Delete Department?</h3>
          <p class="text-xs text-slate-500 mt-2 leading-relaxed px-2">This department will be removed permanently from the database.</p>
        </div>
      `,
    });

    if (result.isConfirmed) {
      try {
        await deleteDepartment(id);
        showAlert({
          icon: "success",
          title: "Deleted!",
          text: "Department deleted successfully",
          timer: 1500,
          showConfirmButton: false,
        });
        fetchData();
      } catch (err) {
        showAlert({
          icon: "error",
          title: "Error",
          text: err.response?.data?.message || "Could not delete department",
        });
      }
    }
  };

  // 🆕 Remark submit handler
  const handleAddRemark = async (task) => {
    const taskId = task._id || task.id;
    const text = (remarkText[taskId] || "").trim();
    if (!text) {
      showAlert({
        icon: "warning",
        title: "Empty Remark",
        text: "Kuch likhein pehle.",
      });
      return;
    }
    setSubmittingRemarkId(taskId);
    try {
      await addTaskRemark(taskId, { text, author: "Admin" }); // apna current logged-in user ka naam yaha daalein
      setRemarkText((prev) => ({ ...prev, [taskId]: "" }));
      await fetchData();
      showAlert({
        icon: "success",
        title: "Remark Added",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (err) {
      showAlert({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Remark add nahi ho paya",
      });
    } finally {
      setSubmittingRemarkId(null);
    }
  };

  const iconGradients = [
    "from-emerald-500 to-teal-500",
    "from-blue-500 to-indigo-500",
    "from-cyan-500 to-blue-500",
    "from-violet-500 to-purple-500",
  ];

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentDepartments = departmentList.slice(
    indexOfFirstCard,
    indexOfLastCard,
  );
  const totalPages = Math.ceil(departmentList.length / cardsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getDeptStaff = (deptId) => {
    const filteredStaff = staffTaskList.filter((s) => {
      const staffDeptId =
        typeof s.department === "object"
          ? s.department?._id || s.department?.id
          : s.department;
      return staffDeptId === deptId;
    });

    return filteredStaff.sort(
      (a, b) =>
        new Date(b.createdAt || b.id || 0) - new Date(a.createdAt || a.id || 0),
    );
  };

  const getDeptActiveTasks = (deptId) => {
    const deptStaff = getDeptStaff(deptId);
    let activeTasksList = [];

    deptStaff.forEach((staff) => {
      const staffTasks = Array.isArray(staff.tasks) ? staff.tasks : [];
      const active = staffTasks.filter(
        (task) => task.status === "Pending" || task.status === "In Progress",
      );

      active.forEach((t) => {
        activeTasksList.push({
          ...t,
          assignedTo: staff.name || staff.email || "Unknown Staff",
          staffId: staff.id || staff._id,
        });
      });
    });

    return activeTasksList.sort((a, b) => {
      const dateA = new Date(a.dueDate || a.deadline || 0);
      const dateB = new Date(b.dueDate || b.deadline || 0);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const isOverdueA = dateA < today;
      const isOverdueB = dateB < today;

      // Agar dono overdue hain, toh purana wala pehle (Oldest due date first)
      if (isOverdueA && isOverdueB) return dateA - dateB;
      // Agar ek overdue hai toh usko pehle dikhao
      if (isOverdueA) return -1;
      if (isOverdueB) return 1;

      // Agar dono future/aaj ke hain, toh jo sabse paas hai wo pehle dikhega
      return dateA - dateB;
    });
  };

  // Open Modal Helpers
  const openStaffModal = (dept) => {
    setSelectedDept(dept);
    setExpandedStaffId(null);
    setStaffCurrentPage(1);
    setActiveModal("staff");
  };

  const openTasksModal = (dept) => {
    setSelectedDept(dept);
    setTasksCurrentPage(1);
    setExpandedRemarksId(null); // 🆕 reset remarks expand state on open
    setActiveModal("tasks");
  };

  const handleAssignedStaffRedirect = (staffId) => {
    setExpandedStaffId(staffId);
    setStaffCurrentPage(1);
    setActiveModal("staff");
  };

  // Pagination Calculations for Staff Members Drawer (6 per page)
  const deptStaffList = selectedDept
    ? getDeptStaff(selectedDept._id || selectedDept.id)
    : [];
  const totalStaffPages = Math.ceil(deptStaffList.length / staffPerPage);
  const indexOfLastStaff = staffCurrentPage * staffPerPage;
  const indexOfFirstStaff = indexOfLastStaff - staffPerPage;
  const paginatedStaffList = deptStaffList.slice(
    indexOfFirstStaff,
    indexOfLastStaff,
  );

  // Pagination Calculations for Active Tasks Drawer (2 per page)
  const deptActiveTasksList = selectedDept
    ? getDeptActiveTasks(selectedDept._id || selectedDept.id)
    : [];
  const totalTasksPages = Math.ceil(deptActiveTasksList.length / tasksPerPage);
  const indexOfLastTask = tasksCurrentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const paginatedActiveTasksList = deptActiveTasksList.slice(
    indexOfFirstTask,
    indexOfLastTask,
  );

  return (
    <div className="space-y-6 relative">
      <PageHeader
        title="Departments"
        subtitle="Organize your support staff by team"
        actions={
          <Button
            onClick={handleAddDept}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold px-5 py-2.5 rounded-2xl shadow-lg shadow-cyan-500/20 text-sm transition-all duration-200 active:scale-95"
          >
            <Plus size={18} /> Add Department
          </Button>
        }
      />

      {loading ? (
        <div className="py-20 text-center font-medium text-slate-400 text-sm animate-pulse">
          Loading departments...
        </div>
      ) : departmentList.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {currentDepartments.map((d, index) => {
              const deptId = d._id || d.id;
              const deptStaff = getDeptStaff(deptId);
              const activeTasks = getDeptActiveTasks(deptId);
              const absoluteIndex = indexOfFirstCard + index;
              const iconGradient =
                iconGradients[absoluteIndex % iconGradients.length];

              return (
                <div
                  key={deptId}
                  className="group relative rounded-[28px] p-6 bg-white border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                >
                  <div className="flex items-start justify-between mb-6 relative z-10">
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`h-12 w-12 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white p-0.5 shadow-md`}
                      >
                        <div className="h-full w-full bg-white rounded-[14px] flex items-center justify-center text-slate-800">
                          <Building2 size={22} className="text-slate-700" />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors capitalize">
                          {d.name}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                          <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
                            Active Team
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100">
                      <button
                        onClick={() => handleEditDept(d)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-white transition-all active:scale-95"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteDept(deptId)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-white transition-all active:scale-95"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 relative z-10">
                    <button
                      onClick={() => openStaffModal(d)}
                      className="text-left rounded-2xl bg-slate-50/80 border border-slate-100 p-3.5 flex items-center gap-3 hover:bg-blue-50 hover:border-blue-200 transition-all active:scale-95 group/btn cursor-pointer"
                    >
                      <div className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white group-hover/btn:bg-blue-600 group-hover/btn:text-white transition-all">
                        <Users size={16} />
                      </div>
                      <div>
                        <p className="text-base font-extrabold text-slate-900 tracking-tight group-hover/btn:text-blue-600">
                          {deptStaff.length}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Staff Members
                        </p>
                      </div>
                    </button>

                    <button
                      onClick={() => openTasksModal(d)}
                      className="text-left rounded-2xl bg-slate-50/80 border border-slate-100 p-3.5 flex items-center gap-3 hover:bg-cyan-50 hover:border-cyan-200 transition-all active:scale-95 group/btn cursor-pointer"
                    >
                      <div className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white transition-all">
                        <Inbox size={16} />
                      </div>
                      <div>
                        <p className="text-base font-extrabold text-slate-900 tracking-tight group-hover/btn:text-cyan-600">
                          {activeTasks.length}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Active Tasks
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-200/80 pt-6 mt-4">
              <span className="text-xs font-semibold text-slate-400">
                Showing {indexOfFirstCard + 1} to{" "}
                {Math.min(indexOfLastCard, departmentList.length)} of{" "}
                {departmentList.length} Departments
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl border border-slate-200 text-slate-500 bg-white hover:bg-slate-50 disabled:opacity-50 transition-all active:scale-95"
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`h-9 w-9 rounded-xl text-xs font-bold transition-all ${currentPage === page ? "bg-blue-600 text-white shadow-lg" : "border border-slate-200 text-slate-600 bg-white hover:bg-slate-50"}`}
                    >
                      {page}
                    </button>
                  ),
                )}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl border border-slate-200 text-slate-500 bg-white hover:bg-slate-50 disabled:opacity-50 transition-all active:scale-95"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-[28px] bg-white border border-slate-200 py-16 text-center text-slate-500 text-sm shadow-sm">
          No departments found. Click{" "}
          <span className="text-emerald-600 font-semibold">
            "Add Department"
          </span>{" "}
          to create one.
        </div>
      )}

      {/* STAFF MEMBERS VIEW DRAWER (6 PER PAGE) */}
      {activeModal === "staff" && selectedDept && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-end z-50">
          <div className="bg-white w-full max-w-lg h-full p-6 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
            <div className="flex flex-col h-full overflow-hidden">
              <div className="flex items-center justify-between pb-5 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 capitalize">
                    <Users className="text-blue-600" size={20} />{" "}
                    {selectedDept.name} Members
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Showing {indexOfFirstStaff + 1} -{" "}
                    {Math.min(indexOfLastStaff, deptStaffList.length)} of{" "}
                    {deptStaffList.length} members
                  </p>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-6 flex-1 overflow-y-auto space-y-3 pr-1">
                {paginatedStaffList.length > 0 ? (
                  paginatedStaffList.map((staff) => {
                    const staffId = staff.id || staff._id;
                    const isExpanded = expandedStaffId === staffId;
                    const staffTasks = Array.isArray(staff.tasks)
                      ? staff.tasks
                      : [];
                    const activeTasks = staffTasks.filter(
                      (task) =>
                        task.status === "Pending" ||
                        task.status === "In Progress",
                    );

                    return (
                      <div
                        key={staffId}
                        className={`rounded-2xl border transition-all overflow-hidden ${isExpanded ? "border-blue-500 bg-blue-50/20 shadow-md" : "border-slate-100 bg-slate-50/60 hover:bg-white"}`}
                      >
                        <div
                          onClick={() =>
                            setExpandedStaffId(isExpanded ? null : staffId)
                          }
                          className="p-4 flex items-center justify-between cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                              {staff.name ? (
                                staff.name.charAt(0).toUpperCase()
                              ) : (
                                <User size={16} />
                              )}
                            </div>
                            <div>
                              <h5 className="text-sm font-bold text-slate-800">
                                {staff.name || "Anonymous"}
                              </h5>
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                {staff.role || "Team Member"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-slate-200/60 text-slate-700 font-bold text-[9px]">
                              {activeTasks.length} Active
                            </span>
                            {isExpanded ? (
                              <ChevronUp size={16} className="text-slate-400" />
                            ) : (
                              <ChevronDown
                                size={16}
                                className="text-slate-400"
                              />
                            )}
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="px-4 pb-4 pt-2 border-t border-slate-100 bg-white space-y-4">
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <Mail size={14} className="text-slate-400" />
                              <span className="font-semibold text-slate-700">
                                Email:
                              </span>
                              <span>
                                {staff.email || "No email registered"}
                              </span>
                            </div>
                            <div className="space-y-2">
                              <h6 className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                                <Briefcase size={12} /> Tasks (
                                {activeTasks.length})
                              </h6>
                              {activeTasks.length > 0 ? (
                                <div className="space-y-2">
                                  {activeTasks.map((task, idx) => {
                                    const tDate = new Date(
                                      task.dueDate || task.deadline || 0,
                                    );
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0);
                                    const isOverdue = tDate < today;

                                    return (
                                      <div
                                        key={task.id || task._id || idx}
                                        className={`p-3 rounded-xl border space-y-2 ${isOverdue ? "bg-rose-50/50 border-rose-200 text-rose-900" : "bg-slate-50 border-slate-100"}`}
                                      >
                                        <div className="flex justify-between items-start">
                                          <p className="text-xs font-bold">
                                            {task.title}
                                          </p>
                                          <span
                                            className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded ${isOverdue ? "bg-rose-600 text-white" : "bg-amber-100 text-amber-700"}`}
                                          >
                                            {isOverdue
                                              ? "Overdue"
                                              : task.status}
                                          </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-[10px] pt-1 border-t border-slate-200/60">
                                          <div className="flex items-center gap-1">
                                            <Calendar size={10} />{" "}
                                            <span>
                                              Assigned:{" "}
                                              {formatDate(task.assignedDate)}
                                            </span>
                                          </div>
                                          <div
                                            className={`flex items-center gap-1 font-semibold ${isOverdue ? "text-rose-600" : ""}`}
                                          >
                                            <Clock size={10} />{" "}
                                            <span>
                                              Due: {formatDate(task.dueDate)}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <p className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-xl border border-dashed">
                                  No active tasks assigned.
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="py-12 text-center text-slate-400 text-sm">
                    No staff members in this department yet.
                  </div>
                )}
              </div>

              {totalStaffPages > 1 && (
                <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-4 bg-white">
                  <span className="text-[11px] font-semibold text-slate-400">
                    Page {staffCurrentPage} of {totalStaffPages}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        setStaffCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={staffCurrentPage === 1}
                      className="p-1.5 rounded-lg border text-slate-500 disabled:opacity-40"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    {Array.from(
                      { length: totalStaffPages },
                      (_, i) => i + 1,
                    ).map((p) => (
                      <button
                        key={p}
                        onClick={() => setStaffCurrentPage(p)}
                        className={`h-7 w-7 rounded-lg text-[11px] font-bold ${staffCurrentPage === p ? "bg-blue-600 text-white" : "border text-slate-600"}`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      onClick={() =>
                        setStaffCurrentPage((prev) =>
                          Math.min(prev + 1, totalStaffPages),
                        )
                      }
                      disabled={staffCurrentPage === totalStaffPages}
                      className="p-1.5 rounded-lg border text-slate-500 disabled:opacity-40"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
            <Button
              onClick={() => setActiveModal(null)}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white mt-4"
            >
              Close Panel
            </Button>
          </div>
        </div>
      )}

      {/* 🔴 ACTIVE TASKS VIEW DRAWER (DUE DATE PRIORITY + HIGH ALERT RED HIGHLIGHTER) */}
      {activeModal === "tasks" && selectedDept && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-end z-50">
          <div className="bg-white w-full max-w-xl h-full p-6 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
            <div className="flex flex-col h-full overflow-hidden">
              <div className="flex items-center justify-between pb-5 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 capitalize">
                    <Briefcase className="text-cyan-600" size={20} />{" "}
                    {selectedDept.name} Urgent Tasks
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Priority Sort (Overdue & Imminent First). Showing{" "}
                    {indexOfFirstTask + 1} -{" "}
                    {Math.min(indexOfLastTask, deptActiveTasksList.length)} of{" "}
                    {deptActiveTasksList.length} tasks
                  </p>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-2 rounded-xl bg-slate-50 text-slate-500"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Tasks List Container */}
              <div className="mt-6 flex-1 overflow-y-auto space-y-4 pr-1">
                {paginatedActiveTasksList.length > 0 ? (
                  paginatedActiveTasksList.map((task, idx) => {
                    // Due Date calculation for Alert Border Styling
                    const taskDueDate = new Date(
                      task.dueDate || task.deadline || 0,
                    );
                    const systemToday = new Date();
                    systemToday.setHours(0, 0, 0, 0);

                    // Overdue condition
                    const isOverdue = taskDueDate < systemToday;

                    // Urgent condition (aaj ya kal ki due date)
                    const oneDayInMs = 24 * 60 * 60 * 1000;
                    const isUrgent =
                      !isOverdue &&
                      taskDueDate.getTime() - systemToday.getTime() <=
                        oneDayInMs;

                    // High alert toggle variable
                    const triggerHighAlert = isOverdue || isUrgent;

                    // 🆕 Remarks related derived values
                    const taskId = task._id || task.id;
                    const taskRemarks = Array.isArray(task.remarks)
                      ? task.remarks
                      : [];
                    const isRemarksExpanded = expandedRemarksId === taskId;

                    return (
                      <div
                        key={task.id || task._id || idx}
                        className={`p-5 rounded-2xl border transition-all space-y-3.5 relative overflow-hidden ${
                          triggerHighAlert
                            ? "border-rose-400 bg-gradient-to-br from-rose-50/70 to-white shadow-md ring-1 ring-rose-300"
                            : "border-slate-100 bg-slate-50/50 hover:bg-white hover:border-cyan-200 hover:shadow-md"
                        }`}
                      >
                        {/* High Alert Badge Bar indicator */}
                        {triggerHighAlert && (
                          <div className="absolute top-0 left-0 right-0 h-1 bg-rose-500 animate-pulse" />
                        )}

                        <div className="flex items-start justify-between">
                          <div className="space-y-1 max-w-[70%]">
                            <h5
                              className={`text-sm font-extrabold tracking-tight leading-snug ${triggerHighAlert ? "text-rose-950" : "text-slate-800"}`}
                            >
                              {task.title || "Untitled Task"}
                            </h5>
                            {task.description && (
                              <p
                                className={`text-xs leading-relaxed ${triggerHighAlert ? "text-rose-700/80" : "text-slate-500"}`}
                              >
                                {task.description}
                              </p>
                            )}
                          </div>

                          {/* Dynamic Badge Design according to timeline status */}
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm border ${
                              isOverdue
                                ? "bg-rose-600 text-white border-rose-700 animate-bounce"
                                : isUrgent
                                  ? "bg-amber-500 text-white border-amber-600 animate-pulse"
                                  : "bg-slate-100 text-slate-700 border-slate-200"
                            }`}
                          >
                            {isOverdue ? (
                              <>
                                <AlertTriangle size={10} /> Overdue Alert
                              </>
                            ) : isUrgent ? (
                              <>
                                <Clock size={10} /> Urgent (Near)
                              </>
                            ) : (
                              <>
                                <Clock size={10} /> {task.status}
                              </>
                            )}
                          </span>
                        </div>

                        {/* Dates grid layout */}
                        <div
                          className={`grid grid-cols-2 gap-3 p-2.5 rounded-xl text-[11px] font-medium ${
                            triggerHighAlert
                              ? "bg-rose-100/50 text-rose-900 border border-rose-200/40"
                              : "bg-slate-100/50 text-slate-600"
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <Calendar
                              size={12}
                              className={
                                triggerHighAlert
                                  ? "text-rose-600"
                                  : "text-blue-500"
                              }
                            />
                            <span>
                              Assigned:{" "}
                              <strong>{formatDate(task.assignedDate)}</strong>
                            </span>
                          </div>
                          <div
                            className={`flex items-center gap-1.5 ${triggerHighAlert ? "font-black text-rose-700" : ""}`}
                          >
                            <Clock
                              size={12}
                              className={
                                triggerHighAlert
                                  ? "text-rose-600"
                                  : "text-rose-500"
                              }
                            />
                            <span>
                              Due Date:{" "}
                              <strong>{formatDate(task.dueDate)}</strong>
                            </span>
                          </div>
                        </div>

                        {/* Redirection link area */}
                        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                          <span className="font-semibold text-slate-400">
                            Assigned To:
                          </span>
                          <button
                            onClick={() =>
                              handleAssignedStaffRedirect(task.staffId)
                            }
                            className={`flex items-center gap-1.5 font-bold px-3 py-1.5 rounded-xl border transition-all duration-200 hover:-translate-y-0.5 active:scale-95 shadow-sm hover:shadow ${
                              triggerHighAlert
                                ? "bg-rose-600 text-white border-rose-700 hover:bg-rose-700"
                                : "bg-blue-50 text-blue-600 border-blue-200/50 hover:bg-blue-100"
                            }`}
                          >
                            <User size={12} />
                            {task.assignedTo}
                          </button>
                        </div>

                        {/* 🆕 Remarks Section — WhatsApp style chat UI (Admin right, Staff left) */}
                        <div className="pt-3 border-t border-slate-100">
                          <button
                            onClick={() =>
                              setExpandedRemarksId(
                                isRemarksExpanded ? null : taskId,
                              )
                            }
                            className="flex items-center justify-between w-full text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors"
                          >
                            <span className="flex items-center gap-1.5">
                              <MessageSquare size={13} /> Remarks (
                              {taskRemarks.length})
                            </span>
                            {isRemarksExpanded ? (
                              <ChevronUp size={14} />
                            ) : (
                              <ChevronDown size={14} />
                            )}
                          </button>

                          {isRemarksExpanded && (
                            <div className="mt-3 space-y-3">
                              {/* Chat Messages Container */}
                              <div className="max-h-52 overflow-y-auto space-y-2.5 pr-1 rounded-xl bg-slate-50/70 p-3 border border-slate-100">
                                {taskRemarks.length > 0 ? (
                                  taskRemarks.map((r, i) => {
                                    // Admin ke remarks (author === 'Admin') right side pe, baaki (staff) left side pe
                                    const isAdminMessage =
                                      (r.author || "").trim().toLowerCase() ===
                                      "admin";

                                    return (
                                      <div
                                        key={r._id || i}
                                        className={`flex ${isAdminMessage ? "justify-end" : "justify-start"}`}
                                      >
                                        <div
                                          className={`flex max-w-[80%] flex-col gap-1 ${isAdminMessage ? "items-end" : "items-start"}`}
                                        >
                                          {/* Author naam - sirf staff ke messages pe dikhao */}
                                          {!isAdminMessage && (
                                            <p className="px-1 text-[10px] font-bold text-cyan-600">
                                              {r.author || "Staff"}
                                            </p>
                                          )}

                                          <div
                                            className={`rounded-2xl px-3.5 py-2 shadow-sm ${
                                              isAdminMessage
                                                ? "rounded-br-sm bg-gradient-to-r from-blue-600 to-cyan-500 text-white"
                                                : "rounded-bl-sm bg-white border border-slate-200 text-slate-700"
                                            }`}
                                          >
                                            <p className="text-xs font-medium leading-relaxed whitespace-pre-wrap break-words">
                                              {r.text}
                                            </p>
                                          </div>

                                          <p className="px-1 text-[9px] font-medium text-slate-400">
                                            {formatDate(r.createdAt)}
                                          </p>
                                        </div>
                                      </div>
                                    );
                                  })
                                ) : (
                                  <p className="text-[11px] text-slate-400 italic text-center py-4">
                                    No Remark Yet
                                  </p>
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={remarkText[taskId] || ""}
                                  onChange={(e) =>
                                    setRemarkText((prev) => ({
                                      ...prev,
                                      [taskId]: e.target.value,
                                    }))
                                  }
                                  placeholder="Remark likhein..."
                                  className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter")
                                      handleAddRemark(task);
                                  }}
                                />
                                <button
                                  onClick={() => handleAddRemark(task)}
                                  disabled={submittingRemarkId === taskId}
                                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all active:scale-95 disabled:opacity-50 shrink-0"
                                >
                                  {submittingRemarkId === taskId
                                    ? "..."
                                    : "Add"}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-12 text-center text-slate-400 text-sm">
                    No active tasks assigned in this department.
                  </div>
                )}
              </div>

              {/* Tasks Inner Pagination Controls */}
              {totalTasksPages > 1 && (
                <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-4 bg-white">
                  <span className="text-[11px] font-semibold text-slate-400">
                    Page {tasksCurrentPage} of {totalTasksPages}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        setTasksCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={tasksCurrentPage === 1}
                      className="p-1.5 rounded-lg border text-slate-500 disabled:opacity-40"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    {Array.from(
                      { length: totalTasksPages },
                      (_, i) => i + 1,
                    ).map((p) => (
                      <button
                        key={p}
                        onClick={() => setTasksCurrentPage(p)}
                        className={`h-7 w-7 rounded-lg text-[11px] font-bold ${tasksCurrentPage === p ? "bg-cyan-600 text-white" : "border text-slate-600"}`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      onClick={() =>
                        setTasksCurrentPage((prev) =>
                          Math.min(prev + 1, totalTasksPages),
                        )
                      }
                      disabled={tasksCurrentPage === totalTasksPages}
                      className="p-1.5 rounded-lg border text-slate-500 disabled:opacity-40"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
            <Button
              onClick={() => setActiveModal(null)}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white mt-4"
            >
              Close Panel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
