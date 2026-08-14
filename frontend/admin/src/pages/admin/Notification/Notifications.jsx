import React, { useState } from "react";
import {
  Bell,
  AlertTriangle,
  Clock,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Search,
  Send,
  ChevronRight,
  ShieldAlert,
  X,
  MessageSquare,
  Sparkles,
  Filter,
} from "lucide-react";
import { Link } from "react-router-dom";

const initialNotifications = [
  {
    id: 1,
    type: "overdue",
    title: "Task Overdue - Weight Scale Calibration",
    staffName: "Rahul Sharma",
    staffDept: "Installation & Service",
    taskTitle: "Calibration of Weighing Scale at Site-A",
    dueDate: "2026-07-18",
    daysOverdue: 2,
    priority: "High",
    read: false,
    timeGroup: "Today",
  },
  {
    id: 2,
    type: "due_soon",
    title: "Task Due Today - Load Cell Inspection",
    staffName: "Priya Verma",
    staffDept: "Maintenance",
    taskTitle: "Check load cell sensors for Client XYZ",
    dueDate: "2026-07-20",
    daysOverdue: 0,
    priority: "Medium",
    read: false,
    timeGroup: "Today",
  },
  {
    id: 3,
    type: "performance_low",
    title: "Low Completion Rate Alert",
    staffName: "Amit Patel",
    staffDept: "Support",
    taskTitle: "Performance Dropped Below 50%",
    metric: "4 Tasks Pending, 1 Resolved this week",
    priority: "High",
    read: true,
    timeGroup: "Earlier",
  },
  {
    id: 4,
    type: "due_soon",
    title: "Task Due Tomorrow - Terminal Meter Setup",
    staffName: "Chhavi Chaturvedi",
    staffDept: "Technical",
    taskTitle: "Display Panel Repair & Testing",
    dueDate: "2026-07-21",
    daysOverdue: -1,
    priority: "Low",
    read: false,
    timeGroup: "Today",
  },
  {
    id: 5,
    type: "performance_high",
    title: "Top Performer Milestone",
    staffName: "Suresh Kumar",
    staffDept: "Field Operations",
    taskTitle: "100% On-Time Task Resolution",
    metric: "12 Tasks Completed ahead of deadline",
    priority: "Info",
    read: true,
    timeGroup: "Earlier",
  },
];

export default function Notifications() {
  const [activeTab, setActiveTab] = useState("all");
  const [filterReadStatus, setFilterReadStatus] = useState("all"); // 'all', 'unread'
  const [searchTerm, setSearchTerm] = useState("");
  const [notifications, setNotifications] = useState(initialNotifications);

  // Toggle Read Status
  const toggleRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  // Dismiss Notification
  const dismissNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Filter Logic
  const filteredNotifications = notifications.filter((item) => {
    const matchesTab =
      activeTab === "all"
        ? true
        : activeTab === "overdue"
        ? item.type === "overdue"
        : activeTab === "due_soon"
        ? item.type === "due_soon"
        : activeTab === "performance"
        ? item.type.startsWith("performance")
        : true;

    const matchesRead =
      filterReadStatus === "all" ? true : filterReadStatus === "unread" ? !item.read : true;

    const matchesSearch =
      item.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.taskTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.staffDept.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesRead && matchesSearch;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6 p-2 sm:p-4 min-h-screen bg-slate-50/50 rounded-3xl">
      {/* 1. Glassmorphism Top Banner */}
      <div className="bg-gradient-to-r from-[#2563eb] via-[#0284c7] to-[#06b6d4] p-6 rounded-3xl text-white shadow-xl shadow-blue-500/10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        {/* Glow Element */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/15 backdrop-blur-md rounded-xl">
              <Bell className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Activity & Notifications
            </h1>
          </div>
          <p className="text-blue-100 text-xs sm:text-sm max-w-xl">
            Real-time updates on staff progress, task deadlines, overdue alerts, and team performance metrics.
          </p>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-3 z-10 self-start lg:self-auto">
          {unreadCount > 0 && (
            <span className="px-3 py-1.5 bg-rose-500/90 text-white font-bold text-xs rounded-xl shadow-sm border border-rose-400/30 flex items-center gap-1.5">
              <Sparkles size={14} /> {unreadCount} Unread Alerts
            </span>
          )}
          <button
            onClick={markAllAsRead}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 active:scale-95 backdrop-blur-md text-white font-bold text-xs uppercase tracking-wider rounded-xl border border-white/20 transition-all shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <CheckCircle2 size={16} />
            Mark All Read
          </button>
        </div>
      </div>

      {/* 2. Compact Control & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          {[
            { id: "all", label: "All Activity", count: notifications.length },
            {
              id: "overdue",
              label: "Overdue",
              count: notifications.filter((n) => n.type === "overdue").length,
              color: "text-red-600",
            },
            {
              id: "due_soon",
              label: "Due Soon",
              count: notifications.filter((n) => n.type === "due_soon").length,
              color: "text-amber-600",
            },
            {
              id: "performance",
              label: "Performance",
              count: notifications.filter((n) => n.type.startsWith("performance")).length,
              color: "text-emerald-600",
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                  activeTab === tab.id
                    ? "bg-white/20 text-white"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Right Controls: Read Toggle & Search */}
        <div className="flex items-center gap-3">
          {/* Read Status Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl shrink-0">
            <button
              onClick={() => setFilterReadStatus("all")}
              className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                filterReadStatus === "all"
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterReadStatus("unread")}
              className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                filterReadStatus === "unread"
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Unread Only
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-64">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search staff or task..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0284c7]/20 focus:border-[#0284c7] transition-all"
            />
          </div>
        </div>
      </div>

      {/* 3. Notifications List Card */}
      <div className="space-y-3">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((item) => (
            <div
              key={item.id}
              className={`group relative bg-white p-4 sm:p-5 rounded-2xl border transition-all duration-200 hover:shadow-md ${
                !item.read
                  ? "border-l-4 border-l-[#2563eb] border-slate-200/90 bg-blue-50/15"
                  : "border-slate-100 opacity-90"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Left Side Info */}
                <div className="flex items-start gap-3.5">
                  {/* Status Indicator Dot */}
                  {!item.read && (
                    <span className="h-2 w-2 rounded-full bg-[#2563eb] shrink-0 mt-2.5 animate-pulse" />
                  )}

                  {/* Dynamic Icon */}
                  <div
                    className={`p-3 rounded-2xl border shrink-0 ${
                      item.type === "overdue"
                        ? "bg-red-50 text-red-600 border-red-100"
                        : item.type === "due_soon"
                        ? "bg-amber-50 text-amber-600 border-amber-100"
                        : item.type === "performance_low"
                        ? "bg-rose-50 text-rose-600 border-rose-100"
                        : "bg-emerald-50 text-emerald-600 border-emerald-100"
                    }`}
                  >
                    {item.type === "overdue" && <AlertTriangle size={20} />}
                    {item.type === "due_soon" && <Clock size={20} />}
                    {item.type === "performance_low" && <TrendingDown size={20} />}
                    {item.type === "performance_high" && <TrendingUp size={20} />}
                  </div>

                  {/* Text Details */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-slate-800 text-sm">{item.title}</h4>

                      {/* Priority Tag */}
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider ${
                          item.priority === "High"
                            ? "bg-red-100 text-red-700"
                            : item.priority === "Medium"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {item.priority}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 font-medium">
                      Task: <span className="font-bold text-slate-800">{item.taskTitle}</span>
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500 font-semibold pt-1 flex-wrap">
                      <span className="text-[#0284c7] font-bold">
                        Staff: {item.staffName} <span className="text-slate-400 font-normal">({item.staffDept})</span>
                      </span>

                      {item.dueDate && (
                        <span className="flex items-center gap-1 text-slate-600">
                          <Clock size={12} />
                          Due: {item.dueDate}
                          {item.daysOverdue > 0 && (
                            <span className="text-red-600 font-bold ml-1">
                              ({item.daysOverdue}d overdue)
                            </span>
                          )}
                        </span>
                      )}

                      {item.metric && (
                        <span className="text-slate-500 italic bg-slate-100 px-2 py-0.5 rounded-md">
                          {item.metric}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 w-full md:w-auto justify-end">
                  {/* Send Reminder / WhatsApp */}
                  {(item.type === "overdue" || item.type === "due_soon") && (
                    <button
                      onClick={() => alert(`Reminder sent to ${item.staffName}!`)}
                      className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl border border-emerald-200/60 transition-all flex items-center gap-1.5 cursor-pointer"
                      title="Send WhatsApp / Alert Reminder"
                    >
                      <MessageSquare size={13} />
                      Send Alert
                    </button>
                  )}

                  {/* Reassign Button */}
                  <Link
                    to="/installation"
                    className="px-3.5 py-2 bg-[#2563eb] hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    Manage
                    <ChevronRight size={13} />
                  </Link>

                  {/* Dismiss Button */}
                  <button
                    onClick={() => dismissNotification(item.id)}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                    title="Dismiss Notification"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-12 rounded-2xl border border-slate-100 text-center space-y-3">
            <div className="p-3 bg-slate-50 text-slate-400 rounded-2xl w-fit mx-auto border border-slate-100">
              <ShieldAlert size={32} />
            </div>
            <h4 className="font-bold text-slate-700 text-base">No Notifications Found</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              There are no pending alerts or notifications matching your filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}