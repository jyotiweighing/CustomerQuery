
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Phone,
  Search,
  X,
  AlertTriangle,
  Eye,
  PlayCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Calendar,
  Clock,
  User,
  Filter
} from 'lucide-react';
import { StatusBadge, PriorityBadge } from './Badge';

export default function TaskTable({ tasks = [], onQuickStatus, onAddRemark }) {
  const navigate = useNavigate();

  // --- FILTERS & SEARCH STATES ---
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [urgencyFilter, setUrgencyFilter] = useState('ALL');
  const [dateRangeFilter, setDateRangeFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('NEWEST');
  const [selectedTaskForModal, setSelectedTaskForModal] = useState(null);

  // --- PAGINATION STATES ---
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 15;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, urgencyFilter, dateRangeFilter, sortOrder]);

  // --- HELPER FUNCTION FOR TASK METRICS ---
  const processTask = (task) => {
    const taskId = task._id || task.id || 'N/A';
    const displayTaskId = task.taskId || (taskId !== 'N/A' ? taskId.slice(-6) : 'N/A');

    const clientName =
      task.partyDetails?.partyName ||
      (typeof task.client === 'object' ? task.client?.name : task.client) ||
      'N/A';

    const clientMobile =
      task.partyDetails?.mobileNo ||
      (typeof task.client === 'object' ? task.client?.mobile : task.mobile) ||
      'N/A';

    const salesPerson =
      task.partyDetails?.salesPersonName ||
      (typeof task.salesPerson === 'object' ? task.salesPerson?.name : task.salesPerson) ||
      'N/A';

    const softwareInfo = task.softwareType
      ? `${task.softwareType}${task.softwareDetails ? ` (${task.softwareDetails})` : ''}`
      : task.softwareDetails || 'N/A';

    const rawDate = task.createdAt || task.assignedDate || task.dueDate;
    const taskCreatedDate = rawDate ? new Date(rawDate) : new Date(0);

    const dueDateFormatted = task.dueDate
      ? new Date(task.dueDate).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
      : 'N/A';

    const assignedDateFormatted = task.createdAt || task.assignedDate
      ? new Date(task.createdAt || task.assignedDate).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
      : 'N/A';

    const taskType = task.type || task.taskType || (task.installationId ? 'Installation' : 'Task');
    const progress =
      task.status === 'Completed' || task.status === 'Resolved' ? 100 : task.progress ?? 0;

    let isUrgent = false;
    let isOverdue = false;
    let alertText = '';
    let urgencyType = 'NORMAL';

    if (
      task.status !== 'Completed' &&
      task.status !== 'Resolved' &&
      task.status !== 'Cancelled' &&
      task.dueDate
    ) {
      const taskDate = new Date(task.dueDate);
      const today = new Date();

      const normalizeDate = (d) =>
        new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

      const taskTime = normalizeDate(taskDate);
      const todayTime = normalizeDate(today);
      const tomorrowTime = todayTime + 24 * 60 * 60 * 1000;

      if (taskTime < todayTime) {
        isOverdue = true;
        isUrgent = true;
        alertText = 'Overdue!';
        urgencyType = 'OVERDUE';
      } else if (taskTime === todayTime) {
        isUrgent = true;
        alertText = 'Due Today';
        urgencyType = 'TODAY';
      } else if (taskTime === tomorrowTime) {
        isUrgent = true;
        alertText = 'Due Tomorrow';
        urgencyType = 'TOMORROW';
      }
    }

    return {
      ...task,
      taskId,
      displayTaskId,
      clientName,
      clientMobile,
      salesPerson,
      softwareInfo,
      dueDateFormatted,
      assignedDateFormatted,
      taskCreatedDate,
      taskType,
      progress,
      isUrgent,
      isOverdue,
      alertText,
      urgencyType,
    };
  };

  const processedTasks = useMemo(() => {
    return tasks.map(processTask);
  }, [tasks]);

  // --- FILTERED & SORTED TASKS ---
  const filteredTasks = useMemo(() => {
    let list = processedTasks.filter((task) => {
      const search = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        task.title?.toLowerCase().includes(search) ||
        task.clientName.toLowerCase().includes(search) ||
        task.displayTaskId.toLowerCase().includes(search) ||
        task.clientMobile.includes(search);

      const matchesStatus =
        statusFilter === 'ALL' || task.status?.toLowerCase() === statusFilter.toLowerCase();

      let matchesUrgency = true;
      if (urgencyFilter === 'OVERDUE') matchesUrgency = task.isOverdue;
      if (urgencyFilter === 'TODAY') matchesUrgency = task.urgencyType === 'TODAY';
      if (urgencyFilter === 'TOMORROW') matchesUrgency = task.urgencyType === 'TOMORROW';

      let matchesDate = true;
      const today = new Date();
      const tDate = task.taskCreatedDate;

      if (dateRangeFilter === 'TODAY') {
        matchesDate =
          tDate.getDate() === today.getDate() &&
          tDate.getMonth() === today.getMonth() &&
          tDate.getFullYear() === today.getFullYear();
      } else if (dateRangeFilter === 'THIS_WEEK') {
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        matchesDate = tDate >= startOfWeek;
      } else if (dateRangeFilter === 'THIS_MONTH') {
        matchesDate =
          tDate.getMonth() === today.getMonth() &&
          tDate.getFullYear() === today.getFullYear();
      }

      return matchesSearch && matchesStatus && matchesUrgency && matchesDate;
    });

    list.sort((a, b) => {
      const dateA = a.taskCreatedDate.getTime();
      const dateB = b.taskCreatedDate.getTime();
      return sortOrder === 'NEWEST' ? dateB - dateA : dateA - dateB;
    });

    return list;
  }, [processedTasks, searchTerm, statusFilter, urgencyFilter, dateRangeFilter, sortOrder]);

  // --- PAGINATION CALCULATION ---
  const totalTasks = filteredTasks.length;
  const totalPages = Math.max(1, Math.ceil(totalTasks / tasksPerPage));

  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * tasksPerPage;
    return filteredTasks.slice(startIndex, startIndex + tasksPerPage);
  }, [filteredTasks, currentPage, tasksPerPage]);

  return (
    <div className="w-full space-y-2 relative">
      {/* Ambient Background Glows */}
      <div className="absolute -top-12 -left-12 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-12 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* ==================== GLASS FILTER BAR ==================== */}
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-4 shadow-sm transition-all">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search Client, Task ID, Phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:bg-white transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filters & Badge */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={dateRangeFilter}
              onChange={(e) => setDateRangeFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50/80 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 cursor-pointer transition-all"
            >
              <option value="ALL">All Dates</option>
              <option value="TODAY">Created Today</option>
              <option value="THIS_WEEK">This Week</option>
              <option value="THIS_MONTH">This Month</option>
            </select>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-3 py-2 bg-slate-50/80 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 cursor-pointer transition-all"
            >
              <option value="NEWEST">Latest First</option>
              <option value="OLDEST">Oldest First</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50/80 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 cursor-pointer transition-all"
            >
              <option value="ALL">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              {/* <option value="Cancelled">Cancelled</option> */}
            </select>

            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50/80 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 cursor-pointer transition-all"
            >
              <option value="ALL">All Deadlines</option>
              <option value="OVERDUE">Overdue Only</option>
              <option value="TODAY">Due Today</option>
              <option value="TOMORROW">Due Tomorrow</option>
            </select>

            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/80  px-3 py-2 rounded-xl flex items-center gap-1.5 ml-auto sm:ml-0">
              <Sparkles size={13} className="text-indigo-500" />
              Total: {totalTasks}
            </span>
          </div>

        </div>
      </div>

      {/* ==================== TABLE CONTAINER ==================== */}
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs min-w-[720px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Task & ID</th>
                <th className="py-3.5 px-4">Client Contact</th>
                <th className="py-3.5 px-4">Status & Progress</th>
                <th className="py-3.5 px-4">Assigned Date</th>
                <th className="py-3.5 px-4">Due Date</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedTasks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400 font-medium">
                    No tasks match your filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedTasks.map((task) => (
                  <tr
                    key={task.taskId}
                    onClick={() => setSelectedTaskForModal(task)}
                    className={`group cursor-pointer transition-colors duration-150 hover:bg-slate-50/80  ${
                      task.isOverdue
                        ? 'bg-rose-50/40 '
                        : ''
                    }`}
                  >
                    {/* Task Title & ID */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 line-clamp-1 max-w-[180px] group-hover:text-indigo-600 transition-colors">
                        {task.title || 'Untitled Task'}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                        <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium">
                          {task.taskType}
                        </span>
                        <span className="font-mono">#{task.displayTaskId}</span>
                      </div>
                    </td>

                    {/* Client Details */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800 line-clamp-1">
                        {task.clientName}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500 flex items-center gap-1 mt-0.5">
                        <Phone size={11} className="text-indigo-500 shrink-0" />
                        +91 {task.clientMobile}
                      </div>
                    </td>

                    {/* Status & Progress */}
                    <td className="py-3.5 px-4 space-y-1.5">
                      <StatusBadge status={task.status || 'Pending'} />
                      <div className="w-24">
                        <div className="flex justify-between text-[9px] font-medium text-slate-400 mb-0.5">
                          <span>Progress</span>
                          <span>{task.progress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              task.isOverdue 
                                ? 'bg-rose-500' 
                                : 'bg-indigo-600'
                            }`}
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Assigned Date */}
                    <td className="py-3.5 px-4 text-slate-600 font-medium whitespace-nowrap">
                      {task.assignedDateFormatted}
                    </td>

                    {/* Due Date & Alerts */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1 items-start">
                        <span className={`font-semibold ${task.isOverdue ? 'text-rose-600 ' : 'text-slate-700 '}`}>
                          {task.dueDateFormatted}
                        </span>
                        
                        {task.isUrgent && (
                          <span
                            className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                              task.isOverdue
                                ? 'bg-rose-100 text-rose-700'
                                : 'bg-amber-100 text-amber-700 '
                            }`}
                          >
                            <AlertTriangle size={9} /> {task.alertText}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Priority */}
                    <td className="py-3.5 px-4">
                      <PriorityBadge priority={task.priority || 'Medium'} />
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => navigate(`/tasks/${task.taskId}`)}
                          title="View Details"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                        >
                          <Eye size={15} />
                        </button>

                        {task.status !== 'In Progress' &&
                          task.status !== 'Completed' &&
                          task.status !== 'Cancelled' && (
                            <button
                              onClick={() => onQuickStatus(task.taskId, 'In Progress')}
                              title="Start Task"
                              className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors"
                            >
                              <PlayCircle size={15} />
                            </button>
                          )}

                        {task.status !== 'Completed' && task.status !== 'Cancelled' && (
                          <button
                            onClick={() => onQuickStatus(task.taskId, 'Completed')}
                            title="Mark Completed"
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50  transition-colors"
                          >
                            <CheckCircle2 size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ==================== PAGINATION ==================== */}
        {totalTasks > 0 && (
          <div className="px-4 py-3 border-t border-slate-200/80 flex items-center justify-between bg-slate-50/50 ">
            <div className="text-xs text-slate-500 font-medium">
              Showing <span className="font-semibold text-slate-800">{(currentPage - 1) * tasksPerPage + 1}</span> to{' '}
              <span className="font-semibold text-slate-800 ">{Math.min(currentPage * tasksPerPage, totalTasks)}</span> of{' '}
              <span className="font-semibold text-slate-800">{totalTasks}</span> tasks
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-all"
              >
                <ChevronLeft size={16} />
              </button>

              <span className="text-xs font-semibold px-2.5 py-1 text-slate-700">
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>


      {selectedTaskForModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-md p-4 animate-in fade-in duration-200">
    <div className="bg-white/85 backdrop-blur-xl border border-white/60 rounded-3xl shadow-2xl shadow-slate-950/20 w-full max-w-lg overflow-hidden transition-all">
      
      <div className={`p-5 flex items-start justify-between border-b ${
        selectedTaskForModal.isOverdue
          ? 'bg-gradient-to-r from-rose-500/10 via-red-500/5 to-transparent border-rose-200/60'
          : 'bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-transparent border-slate-200/80'
      }`}>
        <div className="space-y-1.5 pr-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-mono font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border border-indigo-200 px-2 py-0.5 rounded-md">
              {selectedTaskForModal.taskType} #{selectedTaskForModal.displayTaskId}
            </span>
            {selectedTaskForModal.isUrgent && (
              <span className="bg-gradient-to-r from-rose-500 to-red-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm shadow-rose-500/30 animate-pulse">
                <AlertTriangle size={10} /> {selectedTaskForModal.alertText}
              </span>
            )}
          </div>

          <h2 className="text-lg font-bold text-slate-900 leading-snug">
            {selectedTaskForModal.title || 'Untitled Task'}
          </h2>
        </div>

        <button
          onClick={() => setSelectedTaskForModal(null)}
          className="p-2 text-slate-400 hover:text-slate-700 rounded-xl bg-slate-100/80 hover:bg-slate-200 transition-colors shrink-0"
        >
          <X size={16} />
        </button>
      </div>

      <div className="p-5 space-y-4 text-xs">
        
        <div className="p-4 bg-gradient-to-br from-slate-50/90 to-indigo-50/30 rounded-2xl border border-slate-200/80 shadow-sm space-y-2.5">
          <div className="font-bold text-slate-800 flex items-center gap-2">
            <div className="p-1 rounded-lg bg-indigo-500/10 text-indigo-600 ">
              <Building2 size={14} />
            </div>
            Client Details
          </div>
          <div className="grid grid-cols-2 gap-2 text-slate-600 pt-1">
            <div>Name: <span className="font-semibold text-slate-900 ">{selectedTaskForModal.clientName}</span></div>
            <div>Phone: <span className="font-mono font-semibold text-slate-900 ">{selectedTaskForModal.clientMobile}</span></div>
            <div>Sales Person: <span className="font-semibold text-slate-900 ">{selectedTaskForModal.salesPerson}</span></div>
            <div>Software: <span className="font-semibold text-slate-900 ">{selectedTaskForModal.softwareInfo}</span></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-white/60 border border-slate-200/80 rounded-2xl space-y-1 shadow-sm">
            <span className="text-slate-400 font-medium">Status</span>
            <div><StatusBadge status={selectedTaskForModal.status} /></div>
          </div>

          <div className="p-3 bg-white/60 border border-slate-200/80 rounded-2xl space-y-1 shadow-sm">
            <span className="text-slate-400 font-medium">Priority</span>
            <div><PriorityBadge priority={selectedTaskForModal.priority} /></div>
          </div>

          <div className="p-3 bg-white/60 border border-slate-200/80 rounded-2xl space-y-1 shadow-sm">
            <span className="text-slate-400 font-medium">Assigned Date</span>
            <div className="font-bold text-slate-800 ">{selectedTaskForModal.assignedDateFormatted}</div>
          </div>

          <div className={`p-3 border rounded-2xl space-y-1 shadow-sm ${
            selectedTaskForModal.isOverdue 
              ? 'border-rose-300/80 bg-rose-50/60 text-rose-600' 
              : 'border-slate-200/80 bg-white/60 text-slate-800'
          }`}>
            <span className="text-slate-400 font-medium">Due Date</span>
            <div className="font-extrabold">{selectedTaskForModal.dueDateFormatted}</div>
          </div>
        </div>

        {selectedTaskForModal.description && (
          <div className="space-y-1">
            <span className="font-bold text-slate-700 block">Description</span>
            <p className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/70 text-slate-600 leading-relaxed">
              {selectedTaskForModal.description}
            </p>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-50/80  border-t border-slate-200/80  flex items-center justify-end">
        <button
          onClick={() => {
            setSelectedTaskForModal(null);
            navigate(`/tasks/${selectedTaskForModal.taskId}`);
          }}
          className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-indigo-500/25 active:scale-95 transition-all"
        >
          View Full Details
        </button>
      </div>

    </div>
  </div>
)}
    </div>
  );
}


