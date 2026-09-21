import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Mail,
  Phone,
  Pencil,
  Trash2,
  Users,
  Upload,
  Sparkles,
  Award,
  Filter,
  X,
  Briefcase,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Swal from "sweetalert2";

import PageHeader from "../../../components/admin/common/PageHeader";
import {
  getstafftask,
  addStaffMember,
  updateStaffMember,
  deleteStaffMember,
} from "../../../services/admin/staffService";
import { getDepartments } from "../../../services/admin/departmentService";
import { showAlert } from "../../../utils/sweetAlert";

const getInitials = (name) => {
  if (!name) return "ST";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const calculatePerformance = (assigned = 0, resolved = 0) => {
  if (!assigned || assigned === 0) return 0;
  const percentage = (resolved / assigned) * 100;
  return Math.min(Math.round(percentage), 100);
};

// 🟢 Ek task overdue hai ya nahi ye check karta hai
// (due date nikal chuki ho AND task abhi tak complete/resolved na hua ho)
const isTaskOverdue = (task) => {
  if (!task || !task.dueDate) return false;
  const isDone = task.status === "Completed" || task.status === "Resolved";
  if (isDone) return false;
  const due = new Date(task.dueDate?.$date || task.dueDate);
  if (isNaN(due.getTime())) return false;
  // End of due date tak allow karo, uske baad overdue maano
  due.setHours(23, 59, 59, 999);
  return due.getTime() < Date.now();
};

export default function StaffManagement() {
  const [list, setList] = useState([]);
  const [departmentsList, setDepartmentsList] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Task detailed view states
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [selectedStaffForTasks, setSelectedStaffForTasks] = useState(null);
  const [taskFilterStatus, setTaskFilterStatus] = useState("");

  useEffect(() => {
    fetchStaffAndDepartments();
  }, []);

  // Filter badalne par pagination ko 1st page par reset karein
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDepartment]);

  const fetchStaffAndDepartments = async () => {
    try {
      setLoading(true);
      const [staffTaskRes, deptRes] = await Promise.all([
        getstafftask().catch(() => ({ data: [] })),
        getDepartments().catch(() => null),
      ]);

      const staffList =
        staffTaskRes?.data ||
        staffTaskRes?.staff ||
        (Array.isArray(staffTaskRes) ? staffTaskRes : []);

      setList(staffList);

      let deptsArray = [];
      if (Array.isArray(deptRes)) deptsArray = deptRes;
      else if (Array.isArray(deptRes?.departments))
        deptsArray = deptRes.departments;
      else if (Array.isArray(deptRes?.data)) deptsArray = deptRes.data;
      else if (Array.isArray(deptRes?.data?.departments))
        deptsArray = deptRes.data.departments;

      setDepartmentsList(deptsArray);
    } catch (err) {
      console.error("Error loading data:", err);
      showAlert({
        icon: "error",
        title: "Error Loading Data",
        text: err.response?.data?.message || "Could not fetch data",
      });
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (staffMember) => {
    setEditing(staffMember);
    setModalOpen(true);
  };

  const openTaskDetails = (staffMember, statusType = "") => {
    setSelectedStaffForTasks(staffMember);
    setTaskFilterStatus(statusType);
    setTaskModalOpen(true);
  };

  const handleSave = async (formData) => {
    try {
      if (editing) {
        await updateStaffMember(editing._id || editing.id, formData);
        showAlert({
          icon: "success",
          title: "Updated!",
          text: "Staff member updated successfully",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        await addStaffMember(formData);
        showAlert({
          icon: "success",
          title: "Added!",
          text: "New staff member added",
          timer: 1500,
          showConfirmButton: false,
        });
      }
      setModalOpen(false);
      fetchStaffAndDepartments();
    } catch (err) {
      showAlert({
        icon: "error",
        title: "Action Failed",
        text: err.response?.data?.message || "Failed to save staff member",
      });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      html: `
      <div class="flex flex-col items-center bg-white rounded-[38px] p-8 pb-10 shadow-xl border border-slate-100/50 max-w-[620px] w-full mx-auto">
        <div class="h-16 w-16 bg-rose-50/70 border border-rose-100/60 rounded-[22px] flex items-center justify-center mb-6 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
        </div>
        <h2 class="text-2xl font-black text-slate-800 mb-3 tracking-tight">Delete Staff Member?</h2>
        <p class="text-sm text-slate-400 font-medium px-4 text-center leading-relaxed">This staff member will be removed permanently from the database.</p>
      </div>
    `,
      showCancelButton: true,
      confirmButtonText: "Yes, Delete It",
      cancelButtonText: "Keep It",
      customClass: {
        popup: "!bg-transparent shadow-none border-none p-0 max-w-[620px]",
        actions: "flex flex-col gap-3 w-[85%] mx-auto mt-6 justify-center items-center",
        confirmButton:
          "w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-[20px] text-sm font-extrabold shadow-lg shadow-blue-500/20 transition-all duration-200 active:scale-95 text-center",
        cancelButton:
          "w-full py-3.5 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-slate-700 rounded-[20px] text-sm font-extrabold transition-all duration-200 active:scale-95 text-center",
      },
      buttonsStyling: false,
    });

    if (result.isConfirmed) {
      try {
        await deleteStaffMember(id);
        showAlert({
          icon: "success",
          title: "Deleted!",
          text: "Staff member removed successfully",
          timer: 1500,
          showConfirmButton: false,
        });
        fetchStaffAndDepartments();
      } catch (err) {
        showAlert({
          icon: "error",
          title: "Error",
          text: err.response?.data?.message || "Could not delete staff member",
        });
      }
    }
  };

  const filteredList = list.filter((s) => {
    if (!selectedDepartment) return true;
    const staffDeptId =
      typeof s.department === "object"
        ? s.department?._id || s.department?.id
        : s.department;
    return staffDeptId === selectedDepartment;
  });

  // 🟢 PAGINATION LOGIC
  const totalPages = Math.ceil(filteredList.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedList = filteredList.slice(startIndex, startIndex + rowsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/20 to-blue-50/30 font-sans">
      <PageHeader
        title="Support Staff"
        subtitle={`${filteredList.length} team members showing`}
        actions={
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-3 py-2 rounded-2xl border border-slate-200/80 shadow-sm">
              <Filter size={15} className="text-cyan-600" />
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer min-w-[140px]"
              >
                <option value="">All Departments</option>
                {departmentsList.map((d) => (
                  <option key={d._id || d.id} value={d._id || d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={openAdd}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold px-5 py-2.5 rounded-2xl shadow-lg shadow-cyan-500/20 text-sm transition-all duration-200 active:scale-95"
            >
              <Plus size={18} />
              <span>Add Staff</span>
            </button>
          </div>
        }
      />

      {loading ? (
        <div className="py-20 text-center text-slate-400 font-medium">
          Loading staff records...
        </div>
      ) : paginatedList.length > 0 ? (
        <>
          {/* 🟢 Staff Table */}
          <div className="mt-6 bg-white/70 backdrop-blur-md rounded-3xl border border-white/80 shadow-xl shadow-slate-200/50 overflow-hidden">
            <div className="w-full">
              <table className="w-full text-sm table-fixed">
                <colgroup>
                  <col className="w-[19%]" />
                  <col className="w-[17%]" />
                  <col className="w-[11%]" />
                  <col className="w-[8%]" />
                  <col className="w-[9%]" />
                  <col className="w-[9%]" />
                  <col className="w-[13%]" />
                  <col className="w-[7%]" />
                  <col className="w-[7%]" />
                </colgroup>
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100">
                    <th className="text-left px-3 py-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                      Staff
                    </th>
                    <th className="text-left px-2 py-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                      Contact
                    </th>
                    <th className="text-left px-2 py-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                      Dept
                    </th>
                    <th className="text-center px-1 py-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                      Assign
                    </th>
                    <th className="text-center px-1 py-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                      Done
                    </th>
                    <th className="text-center px-1 py-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                      Overdue
                    </th>
                    <th className="text-left px-2 py-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                      Perf
                    </th>
                    <th className="text-center px-2 py-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                      Status
                    </th>
                    <th className="text-center px-2 py-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedList.map((s) => {
                    const staffId = s._id || s.id;
                    const deptName =
                      s.departmentname ||
                      (typeof s.department === "object"
                        ? s.department?.name
                        : s.department);

                    const staffTasks = Array.isArray(s.tasks) ? s.tasks : [];
                    const assigned = staffTasks.length || s.assignedQueries || 0;
                    const resolved = staffTasks.filter(
                      (t) => t.status === "Resolved" || t.status === "Completed",
                    ).length;
                    const overdueCount = staffTasks.filter(isTaskOverdue).length;
                    const perfScore = calculatePerformance(assigned, resolved);

                    return (
                      <tr
                        key={staffId}
                        className={`border-b border-slate-100 last:border-b-0 hover:bg-cyan-50/30 transition-colors ${
                          overdueCount > 0 ? "bg-rose-50/30" : ""
                        }`}
                      >
                        {/* Staff Name + Avatar */}
                        <td className="px-3 py-3 align-middle">
                          <div className="flex items-center gap-2 min-w-0">
                            {s.avatar ? (
                              <img
                                src={s.avatar}
                                alt={s.name}
                                className="h-9 w-9 rounded-xl object-cover ring-2 ring-white shadow-sm shrink-0"
                              />
                            ) : (
                              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 ring-2 ring-white shadow-sm flex items-center justify-center font-black text-white text-xs shrink-0">
                                {getInitials(s.name)}
                              </div>
                            )}
                            <div className="min-w-0">
                              <p
                                className="font-extrabold text-slate-800 text-xs capitalize tracking-tight truncate"
                                title={s.name}
                              >
                                {s.name}
                              </p>
                              <p className="text-[9px] font-bold text-cyan-600 uppercase tracking-wider truncate">
                                {s.designation || "Support Agent"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Contact */}
                        <td className="px-2 py-3 align-middle">
                          <div className="space-y-1 min-w-0">
                            <div
                              className="flex items-center gap-1 text-[11px] text-slate-600 truncate"
                              title={s.email}
                            >
                              <Mail size={11} className="text-cyan-500 shrink-0" />
                              <span className="truncate font-medium">{s.email}</span>
                            </div>
                            <div className="flex items-center gap-1 text-[11px] text-slate-600 truncate">
                              <Phone size={11} className="text-cyan-500 shrink-0" />
                              <span className="font-medium truncate">{s.phone}</span>
                            </div>
                          </div>
                        </td>

                        {/* Department */}
                        <td className="px-2 py-3 align-middle">
                          <span
                            className="text-[11px] font-bold text-slate-600 capitalize block truncate"
                            title={deptName || "N/A"}
                          >
                            {deptName || "N/A"}
                          </span>
                        </td>

                        {/* Assigned - clickable */}
                        <td className="px-1 py-3 text-center align-middle">
                          <button
                            onClick={() => openTaskDetails(s, "")}
                            className="inline-flex items-center justify-center h-9 w-9 rounded-lg border border-slate-100 bg-slate-50/80 hover:border-cyan-300 hover:bg-cyan-50 hover:shadow-sm transition-all active:scale-95"
                            title="View all assigned tasks"
                          >
                            <span className="text-xs font-black text-slate-800">
                              {assigned}
                            </span>
                          </button>
                        </td>

                        {/* Completed - clickable */}
                        <td className="px-1 py-3 text-center align-middle">
                          <button
                            onClick={() => openTaskDetails(s, "Completed")}
                            className="inline-flex items-center justify-center h-9 w-9 rounded-lg border border-slate-100 bg-slate-50/80 hover:border-emerald-300 hover:bg-emerald-50 hover:shadow-sm transition-all active:scale-95"
                            title="View completed tasks"
                          >
                            <span className="text-xs font-black text-emerald-600">
                              {resolved}
                            </span>
                          </button>
                        </td>

                        {/* Overdue - clickable, highlighted alag se */}
                        <td className="px-1 py-3 text-center align-middle">
                          <button
                            onClick={() => openTaskDetails(s, "Overdue")}
                            disabled={overdueCount === 0}
                            className={`inline-flex items-center justify-center gap-0.5 h-9 min-w-9 px-1.5 rounded-lg border transition-all active:scale-95 ${
                              overdueCount > 0
                                ? "border-rose-200 bg-rose-50 hover:bg-rose-100 hover:shadow-sm cursor-pointer"
                                : "border-slate-100 bg-slate-50/80 cursor-default"
                            }`}
                            title={
                              overdueCount > 0
                                ? "View overdue tasks"
                                : "No overdue tasks"
                            }
                          >
                            {overdueCount > 0 && (
                              <AlertTriangle size={11} className="text-rose-500 shrink-0" />
                            )}
                            <span
                              className={`text-xs font-black ${
                                overdueCount > 0 ? "text-rose-600" : "text-slate-400"
                              }`}
                            >
                              {overdueCount}
                            </span>
                          </button>
                        </td>

                        {/* Performance */}
                        <td className="px-2 py-3 align-middle">
                          <div className="min-w-0">
                            <div className="flex items-center justify-between mb-1 gap-1">
                              <Award size={10} className="text-amber-500 shrink-0" />
                              <span className="text-[10px] font-black text-slate-700 ml-auto">
                                {perfScore}%
                              </span>
                            </div>
                            <div className="w-full bg-slate-200/70 h-1.5 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${perfScore}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className={`h-full rounded-full ${
                                  perfScore >= 75
                                    ? "bg-gradient-to-r from-emerald-400 to-teal-500"
                                    : perfScore >= 40
                                      ? "bg-gradient-to-r from-amber-400 to-orange-500"
                                      : "bg-gradient-to-r from-rose-400 to-red-500"
                                }`}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-1 py-3 text-center align-middle">
                          <span
                            className={`px-1.5 py-0.5 rounded-full text-[8px] font-extrabold tracking-wide uppercase whitespace-nowrap inline-block ${
                              s.status === "Active"
                                ? "bg-emerald-50 text-emerald-600 border border-emerald-200/60"
                                : "bg-amber-50 text-amber-600 border border-amber-200/60"
                            }`}
                          >
                            {s.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-1 py-3 align-middle">
                          <div className="flex items-center justify-center gap-0.5">
                            <button
                              onClick={() => openEdit(s)}
                              className="text-slate-400 hover:text-blue-600 p-1 transition-colors rounded-lg hover:bg-slate-50"
                              title="Edit Staff"
                            >
                              <Pencil size={13} />
                            </button>
                            <button
                              onClick={() => handleDelete(staffId)}
                              className="text-slate-400 hover:text-rose-600 p-1 transition-colors rounded-lg hover:bg-slate-50"
                              title="Remove Staff"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 🟢 PAGINATION CONTROLS */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8 py-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white transition-all"
              >
                <ChevronLeft size={16} />
              </button>

              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`h-9 w-9 rounded-xl text-xs font-bold transition-all ${
                      currentPage === pageNumber
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/10"
                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="mt-8 py-16 text-center rounded-3xl border-2 border-dashed border-slate-200 bg-white/50 backdrop-blur-sm">
          <Users size={40} className="mx-auto text-slate-300 mb-3" />
          <p className="text-base font-semibold text-slate-700">
            No Staff Members Found
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {selectedDepartment
              ? "No team members found in this specific department."
              : "Click '+ Add Staff' to assign new members."}
          </p>
        </div>
      )}

      {modalOpen && (
        <StaffModal
          open={modalOpen}
          initial={editing}
          departments={departmentsList}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}

      {taskModalOpen && (
        <TaskDetailsModal
          open={taskModalOpen}
          staff={selectedStaffForTasks}
          statusFilter={taskFilterStatus}
          onClose={() => setTaskModalOpen(false)}
        />
      )}
    </div>
  );
}

// 🟢 Task Details Modal — ab "Overdue" filter bhi support karta hai
function TaskDetailsModal({ open, staff, statusFilter, onClose }) {
  if (!staff) return null;

  const tasks = Array.isArray(staff.tasks) ? staff.tasks : [];

  const displayedTasks = tasks.filter((task) => {
    if (!statusFilter) return true;
    if (statusFilter === "Completed") {
      return task.status === "Completed" || task.status === "Resolved";
    }
    if (statusFilter === "Overdue") {
      return isTaskOverdue(task);
    }
    return task.status === statusFilter;
  });

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl rounded-[28px] bg-white/95 backdrop-blur-xl shadow-2xl p-6 border border-slate-100 flex flex-col max-h-[85vh] overflow-hidden"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 shrink-0">
              <div className="flex items-center gap-3">
                <div
                  className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                    statusFilter === "Overdue"
                      ? "bg-rose-50 text-rose-600"
                      : "bg-cyan-50 text-cyan-600"
                  }`}
                >
                  {statusFilter === "Overdue" ? (
                    <AlertTriangle size={20} />
                  ) : (
                    <Briefcase size={20} />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800 tracking-tight">
                    <span
                      className={`font-bold uppercase ${
                        statusFilter === "Overdue" ? "text-rose-600" : "text-cyan-600"
                      }`}
                    >
                      {statusFilter || "All Assigned"}
                    </span>{" "}
                    Tasks
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold">
                    {staff.name}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Scrollable Task List */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3 custom-scrollbar">
              {displayedTasks.length > 0 ? (
                displayedTasks.map((task) => {
                  const taskId =
                    task._id?.$oid || task._id || Math.random().toString();
                  const isCompleted =
                    task.status === "Completed" || task.status === "Resolved";
                  const overdue = isTaskOverdue(task);

                  return (
                    <div
                      key={taskId}
                      className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all ${
                        overdue
                          ? "bg-rose-50/60 border-rose-200/70 hover:bg-rose-50"
                          : "bg-slate-50/60 border-slate-100 hover:bg-slate-50 hover:border-slate-200"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 p-1.5 rounded-lg shrink-0 ${
                            overdue
                              ? "bg-rose-100 text-rose-600"
                              : isCompleted
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-amber-50 text-amber-600"
                          }`}
                        >
                          {overdue ? (
                            <AlertTriangle size={15} />
                          ) : isCompleted ? (
                            <CheckCircle2 size={15} />
                          ) : (
                            <Clock size={15} />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black font-mono bg-white text-slate-500 border px-1.5 py-0.5 rounded-md">
                              {task.taskId || task.title || "Task"}
                            </span>
                            {task.dueDate && (
                              <span
                                className={`text-[10px] font-medium ${
                                  overdue ? "text-rose-500 font-bold" : "text-slate-400"
                                }`}
                              >
                                Due:{" "}
                                {new Date(
                                  task.dueDate?.$date || task.dueDate,
                                ).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          <h5 className="text-sm font-bold text-slate-700 mt-1.5 leading-snug">
                            {task.title}
                          </h5>
                          <p className="text-xs text-slate-500">
                            {task.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wide border ${
                            task.priority === "High"
                              ? "bg-rose-50 text-rose-600 border-rose-200/60"
                              : task.priority === "Medium"
                                ? "bg-amber-50 text-amber-600 border-amber-200/60"
                                : "bg-slate-100 text-slate-500 border-slate-200/60"
                          }`}
                        >
                          {task.priority || "Normal"}
                        </span>
                        {overdue && (
                          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700">
                            Overdue
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                            isCompleted
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {task.status}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 text-xs text-slate-400 font-medium border border-dashed rounded-2xl bg-slate-25">
                  No tasks found with "{statusFilter || "Assigned"}" status for
                  this employee.
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-slate-100 pt-3 flex justify-end shrink-0">
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white  hover:bg-slate-800 font-bold rounded-xl text-xs transition-all active:scale-95"
              >
                Close View
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function StaffModal({ open, initial, departments, onClose, onSave }) {
  const [form, setForm] = useState(() => ({
    name: initial?.name || "",
    email: initial?.email || "",
    phone: initial?.phone || "",
    avatar: initial?.avatar || "",
    department:
      typeof initial?.department === "object"
        ? initial?.department?._id
        : initial?.department || "",
    designation: initial?.designation || "Support Agent",
    status: initial?.status || "Active",
  }));

  useEffect(() => {
    if (!form.department && departments.length > 0) {
      setForm((prev) => ({
        ...prev,
        department: departments[0]._id || departments[0].id,
      }));
    }
  }, [departments]);

  const update = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => update("avatar", reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm p-4 sm:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl rounded-[32px] bg-white/95 backdrop-blur-2xl shadow-2xl p-6 sm:p-8 border border-white/80 my-auto flex flex-col"
          >
            <div className="text-center mb-6 shrink-0">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-extrabold uppercase tracking-wider mb-2">
                <Sparkles size={13} className="text-amber-500" />
                <span>{initial ? "EDIT MODE" : "ADD TEAM MEMBER"}</span>
              </div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                {initial ? "Update Staff Details" : "Create Staff Profile"}
              </h3>
            </div>

            <form
              className="space-y-5 flex-1"
              onSubmit={(e) => {
                e.preventDefault();
                onSave(form);
              }}
            >
              <div className="flex items-center gap-4 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
                {form.avatar ? (
                  <img
                    src={form.avatar}
                    alt="Preview"
                    className="h-12 w-12 rounded-xl object-cover ring-2 ring-blue-100 shadow-sm"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-black text-white text-sm shadow-sm">
                    {getInitials(form.name)}
                  </div>
                )}
                <div className="flex-1">
                  <label className="cursor-pointer inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm transition-all">
                    <Upload size={14} className="text-cyan-600" />
                    <span>Upload Picture</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-1 block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    className="w-full rounded-2xl bg-slate-100/60 border border-slate-200/80 px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:bg-white transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-1 block">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    className="w-full rounded-2xl bg-slate-100/60 border border-slate-200/80 px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:bg-white transition-all"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-1 block">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    className="w-full rounded-2xl bg-slate-100/60 border border-slate-200/80 px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:bg-white transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-1 block">
                    Department
                  </label>
                  <select
                    value={form.department}
                    onChange={(e) => update("department", e.target.value)}
                    className="w-full rounded-2xl bg-slate-100/60 border border-slate-200/80 px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:bg-white transition-all"
                    required
                  >
                    <option value="" disabled>
                      Select Department
                    </option>
                    {departments.map((d) => (
                      <option key={d._id || d.id} value={d._id || d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-1 block">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={form.designation}
                    onChange={(e) => update("designation", e.target.value)}
                    className="w-full rounded-2xl bg-slate-100/60 border border-slate-200/80 px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-1 block">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => update("status", e.target.value)}
                    className="w-full rounded-2xl bg-slate-100/60 border border-slate-200/80 px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:bg-white transition-all"
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-100 shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-sm font-bold shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
                >
                  <span>{initial ? "Save Changes →" : "Create Now →"}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}