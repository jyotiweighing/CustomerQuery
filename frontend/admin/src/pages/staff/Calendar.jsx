import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, AlertCircle, CheckCircle2, FileText, Calendar as CalendarIcon, Sparkles } from 'lucide-react';
import Layout from '../../components/staff/Layout';
import { fetchTasks } from '../../services/staff/taskService';

// Jyoti Blue Theme Palette Matrix
const TASK_PALETTES = [
  { 
    bg: 'bg-gradient-to-r from-blue-600 to-indigo-600', 
    text: 'text-blue-700 dark:text-blue-300', 
    lightBg: 'bg-blue-500/10 backdrop-blur-md border border-blue-200/30',
    ring: 'ring-blue-500/30'
  },
  { 
    bg: 'bg-gradient-to-r from-indigo-600 to-violet-600', 
    text: 'text-indigo-700 dark:text-indigo-300', 
    lightBg: 'bg-indigo-500/10 backdrop-blur-md border border-indigo-200/30',
    ring: 'ring-indigo-500/30'
  },
  { 
    bg: 'bg-gradient-to-r from-sky-500 to-blue-600', 
    text: 'text-sky-700 dark:text-sky-300', 
    lightBg: 'bg-sky-500/10 backdrop-blur-md border border-sky-200/30',
    ring: 'ring-sky-500/30'
  }
];

const formatDateKey = (dateString) => {
  if (!dateString) return null;
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return null;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function CalendarPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cursor, setCursor] = useState(new Date(2026, 6, 1)); // July 2026

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 2;

  const staffId = "6a50dc2dd834a03a0f954187"; 

  useEffect(() => {
    setLoading(true);
    fetchTasks(staffId)
      .then((res) => {
        const fetchedData = Array.isArray(res) ? res : (res?.data || []);
        setTasks(fetchedData);
      })
      .catch((err) => console.error("Error fetching tasks:", err))
      .finally(() => setLoading(false));
  }, [staffId]);

  // Sort Tasks Latest First
  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [tasks]);

  // Paginated Tasks
  const totalPages = Math.ceil(sortedTasks.length / tasksPerPage) || 1;
  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * tasksPerPage;
    return sortedTasks.slice(startIndex, startIndex + tasksPerPage);
  }, [sortedTasks, currentPage]);

  const { events, taskColorMap } = useMemo(() => {
    const eventList = [];
    const colorMap = {};

    tasks.forEach((task, index) => {
      const palette = TASK_PALETTES[index % TASK_PALETTES.length];
      colorMap[task.taskId] = palette;

      const assignedDateStr = formatDateKey(task.createdAt);
      if (assignedDateStr) {
        eventList.push({
          id: `${task._id}-assigned`,
          taskId: task.taskId,
          title: `${task.taskId}`,
          date: assignedDateStr,
          type: 'assigned',
          palette,
          rawTask: task
        });
      }

      const dueDateStr = formatDateKey(task.dueDate);
      if (dueDateStr) {
        eventList.push({
          id: `${task._id}-due`,
          taskId: task.taskId,
          title: `DUE: ${task.taskId}`,
          date: dueDateStr,
          type: 'due',
          palette,
          rawTask: task
        });
      }
    });

    return { events: eventList, taskColorMap: colorMap };
  }, [tasks]);

  const { days, monthLabel } = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const firstDay = new Date(year, month, 1);
    const startOffset = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const cells = [];
    for (let i = 0; i < startOffset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    return {
      days: cells,
      monthLabel: cursor.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    };
  }, [cursor]);

  const eventsFor = (day) => {
    if (!day) return [];
    const yr = cursor.getFullYear();
    const mo = String(cursor.getMonth() + 1).padStart(2, '0');
    const da = String(day).padStart(2, '0');
    const dateStr = `${yr}-${mo}-${da}`;

    return events.filter((e) => e.date === dateStr);
  };

  return (
    <Layout title="Task Schedule Calendar" subtitle="Assigned and Due dates visualization with distinct task indicators.">
      
      {/* Full height container with overflow control */}
      <div className="relative h-[calc(100vh-65px)] w-full overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/20 -m-6 p-5">
        
        <div className="grid h-full grid-cols-2 gap-5 lg:grid-cols-[1fr_380px] items-stretch">
          
          {/* Main Glass Calendar Card (Stretched to fill bottom) */}
          <div className="flex flex-col justify-between overflow-hidden backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 p-5 rounded-3xl border border-white/50 dark:border-slate-800/80 shadow-2xl shadow-blue-500/5 h-full">
            
            {/* Header Controls */}
            <div className="flex items-center justify-between shrink-0 mb-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-400 text-white shadow-md shadow-blue-500/30">
                  <CalendarIcon size={18} />
                </div>
                <h3 className="text-xl font-black bg-gradient-to-r from-slate-800 via-blue-900 to-indigo-900 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  {monthLabel}
                </h3>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-2xl backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50">
                <button 
                  onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))} 
                  className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all text-slate-600 dark:text-slate-300"
                  aria-label="Previous Month"
                >
                  <ChevronLeft size={16} />
                </button>
                <button 
                  onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))} 
                  className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all text-slate-600 dark:text-slate-300"
                  aria-label="Next Month"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Weekdays */}
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-blue-900/60 dark:text-slate-400 py-1 uppercase tracking-wider shrink-0">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>

            {/* Calendar Grid - Stretches perfectly to fill bottom space */}
            <div className="grid grid-cols-7 gap-2 flex-1 my-1">
              {days.map((day, idx) => {
                const dayEvents = eventsFor(day);
                return (
                  <div 
                    key={idx} 
                    className={`h-full rounded-2xl p-2 transition-all duration-300 flex flex-col justify-start overflow-hidden ${
                      day 
                        ? 'bg-white/50 dark:bg-slate-800/40 border border-white/80 dark:border-slate-800 hover:border-blue-400/50 backdrop-blur-xs' 
                        : 'border-transparent'
                    }`}
                  >
                    {day && (
                      <>
                        <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 ml-1">
                          {day}
                        </span>
                        <div className="mt-1 space-y-1 overflow-y-auto flex-1 no-scrollbar">
                          {dayEvents.map((e) => {
                            const isDue = e.type === 'due';
                            return (
                              <div 
                                key={e.id} 
                                className={`truncate rounded-lg px-2 py-0.5 text-[10px] font-extrabold text-white shadow-xs ${
                                  isDue 
                                    ? 'bg-gradient-to-r from-rose-500 to-pink-600' 
                                    : `${e.palette.bg}`
                                }`}
                                title={`${e.rawTask.title} (${isDue ? 'DUE DATE' : 'ASSIGNED'})`}
                              >
                                {e.title}
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

          </div>

          {/* Right Glass Sidebar: Tasks List */}
          <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 p-5 rounded-3xl border border-white/50 dark:border-slate-800/80 shadow-2xl shadow-blue-500/5 flex flex-col justify-between h-full overflow-hidden">
            
            <div className="flex flex-col h-full overflow-hidden">
              <div className="flex items-center justify-between mb-4 shrink-0">
                <div className="flex items-center gap-2">
                  <Sparkles size={18} className="text-blue-600 dark:text-blue-400" />
                  <h3 className="text-lg font-extrabold text-slate-800 dark:text-white">Upcoming Tasks</h3>
                </div>
                <span className="text-xs font-black px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
                  {sortedTasks.length} Total
                </span>
              </div>
              
              {loading ? (
                <div className="py-12 text-center text-xs font-semibold text-slate-400 animate-pulse">
                  Loading schedule...
                </div>
              ) : sortedTasks.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8">No tasks found.</p>
              ) : (
                <div className="space-y-3.5 flex-1 overflow-hidden flex flex-col justify-center">
                  {paginatedTasks.map((task) => {
                    const palette = taskColorMap[task.taskId] || TASK_PALETTES[0];
                    const assignedDate = formatDateKey(task.createdAt);
                    const dueDate = formatDateKey(task.dueDate);

                    return (
                      <div 
                        key={task._id} 
                        className="group relative rounded-2xl border border-slate-200/60 dark:border-slate-800/80 p-3.5 bg-white/60 dark:bg-slate-800/50 backdrop-blur-md shadow-sm hover:border-blue-400/60 transition-all duration-300"
                      >
                        {/* Gradient Border Accent Strip */}
                        <div className={`absolute top-0 left-4 right-4 h-1 rounded-b-full ${palette.bg}`} />

                        <div className="flex items-center justify-between gap-2 mt-0.5">
                          <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-lg ${palette.lightBg} ${palette.text}`}>
                            {task.taskId}
                          </span>
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            task.priority === 'High' 
                              ? 'bg-rose-500/10 text-rose-600 border border-rose-200/50' 
                              : 'bg-amber-500/10 text-amber-600 border border-amber-200/50'
                          }`}>
                            {task.priority} Priority
                          </span>
                        </div>

                        <h4 className="mt-2 text-sm font-black text-slate-800 dark:text-white truncate">
                          {task.title}
                        </h4>

                        {task.partyDetails && (
                          <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
                            Client: <span className="font-bold text-slate-700 dark:text-slate-200">{task.partyDetails.partyName}</span>
                          </p>
                        )}

                        <div className="mt-2 text-xs flex items-center justify-between text-slate-500 dark:text-slate-400 font-medium">
                          <span>Type: <strong className="text-slate-700 dark:text-slate-200">{task.softwareType}</strong></span>
                          <span>Progress: <strong className="text-blue-600 dark:text-blue-400">{task.progress || 0}%</strong></span>
                        </div>

                        <div className="mt-1.5 flex items-center gap-2.5 text-xs text-slate-400">
                          {task.files?.length > 0 && (
                            <span className="flex items-center gap-1 font-semibold">
                              <FileText size={12} className="text-blue-500" /> {task.files.length}
                            </span>
                          )}
                          <span className="flex items-center gap-1 font-semibold">
                            <CheckCircle2 size={12} className="text-emerald-500" /> {task.status}
                          </span>
                        </div>

                        {/* Glass Dates Footer */}
                        <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700/50 grid grid-cols-2 gap-1 text-[11px]">
                          <div className="flex items-center gap-1.5">
                            <div className="p-1 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600">
                              <Clock size={11} />
                            </div>
                            <div>
                              <span className="block text-[9px] text-slate-400 font-medium">Assigned</span>
                              <span className="font-extrabold text-slate-700 dark:text-slate-200">{assignedDate}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <div className="p-1 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-500">
                              <AlertCircle size={11} />
                            </div>
                            <div>
                              <span className="block text-[9px] text-slate-400 font-medium">Due Date</span>
                              <span className="font-extrabold text-rose-600 dark:text-rose-400">{dueDate}</span>
                            </div>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Pagination Controls Fixed at Bottom */}
            {!loading && sortedTasks.length > tasksPerPage && (
              <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between shrink-0">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-200 transition-all"
                >
                  <ChevronLeft size={14} /> Prev
                </button>

                <span className="text-xs font-extrabold text-slate-600 dark:text-slate-400">
                  {currentPage} / {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-200 transition-all"
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </Layout>
  );
}
