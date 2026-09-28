import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Clock3,
  CheckCircle2,
  Activity,
  Flame,
  CalendarClock,
  Gauge,
  Bell,
  ArrowUpRight,
  Building2,
} from "lucide-react";
import Layout from "../../components/staff/Layout";
import StatCard from "../../components/staff/StatCard";
import { CardSkeleton, ChartSkeleton } from "../../components/staff/Skeleton";
import { PriorityBadge } from "../../components/staff/Badge";
import MonthlyBarChart from "../../components/staff/charts/MonthlyBarChart";
import WeeklyLineChart from "../../components/staff/charts/WeeklyLineChart";
import { useAuth } from "../../context/AuthContext";
import {
  fetchTasks,
  fetchMonthlyPerformance,
  fetchWeeklyActivity,
} from "../../services/staff/taskService";
import {
  fetchNotifications,
  checkDueDateAlerts,
} from "../../services/staff/notificationService";

// Helper function for Relative Time Formatting
function formatTime(createdAt) {
  if (!createdAt) return "";
  const date = new Date(createdAt);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;

  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function Dashboard() {
  const { staff } = useAuth();
  const [tasks, setTasks] = useState(null);
  const [monthly, setMonthly] = useState(null);
  const [weekly, setWeekly] = useState(null);
  const [notifications, setNotifications] = useState(null);
  const [imageError, setImageError] = useState(false);

  // Dynamic fetch using staffId
  useEffect(() => {
    const staffId = staff?._id || staff?.id || staff?.staffId;

    if (staffId) {
      fetchTasks(staffId).then((data) => setTasks(data));
      fetchMonthlyPerformance(staffId).then((data) => setMonthly(data));
      fetchWeeklyActivity(staffId).then((data) => setWeekly(data));

      const loadNotifications = async () => {
        await checkDueDateAlerts();
        const data = await fetchNotifications(staffId);
        if (Array.isArray(data)) {
          setNotifications(data.slice(0, 5));
        } else {
          setNotifications([]);
        }
      };

      loadNotifications();
    }
  }, [staff]);

  // Dynamic Metrics Calculation
  const stats = useMemo(() => {
    if (!tasks) return null;

    const todayStr = new Date().toISOString().slice(0, 10);
    const total = tasks.length;

    const todayCount = tasks.filter((t) => {
      const assigned = t.assignedDate ? new Date(t.assignedDate).toISOString().slice(0, 10) : null;
      const due = t.dueDate ? new Date(t.dueDate).toISOString().slice(0, 10) : null;
      return assigned === todayStr || due === todayStr;
    }).length;

    const pendingCount = tasks.filter((t) => t.status === "Pending").length;
    const inProgressCount = tasks.filter((t) => t.status === "In Progress").length;
    const completedCount = tasks.filter(
      (t) => t.status === "Completed" || t.status === "Resolved"
    ).length;
    const highPriorityCount = tasks.filter(
      (t) => t.priority === "High" && t.status !== "Completed" && t.status !== "Resolved"
    ).length;

    const performanceRate = total > 0 ? Math.round((completedCount / total) * 100) : 0;

    return {
      today: todayCount,
      pending: pendingCount,
      inProgress: inProgressCount,
      completed: completedCount,
      highPriority: highPriorityCount,
      performance: performanceRate,
    };
  }, [tasks]);

  const staffInitials = useMemo(() => {
    if (!staff?.name) return "NA";

    return staff.name
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0].toUpperCase())
      .join("");
  }, [staff]);

  // Upcoming Deadlines logic
  const upcomingDeadlines = useMemo(() => {
    if (!tasks) return [];
    return [...tasks]
      .filter((t) => t.status !== "Completed" && t.status !== "Resolved" && t.status !== "Cancelled")
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5);
  }, [tasks]);

  return (
    <Layout
      title={`Welcome back, ${staff?.name?.split(" ")[0] || "User"}`}
      subtitle="Here's what's happening with your tasks today."
    >
      {/* Welcome card - Matched with Sidebar Gradient Color */}
      <div className="glass-card mb-6 flex flex-col items-start justify-between gap-5 overflow-hidden rounded-2xl bg-gradient-to-r from-[#1d4ed8] via-[#2563eb] to-[#3b82f6] p-6 text-white shadow-lg shadow-blue-500/10 sm:flex-row sm:items-center sm:p-8">
        <div className="flex items-center gap-4">
          {staff?.avatar && !imageError ? (
            <img
              src={staff.avatar}
              alt={staff?.name}
              onError={() => setImageError(true)}
              className="h-16 w-16 rounded-2xl object-cover ring-4 ring-white/20"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-xl font-bold text-white ring-4 ring-white/20">
              {staffInitials}
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-blue-100">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <h2 className="text-xl font-extrabold capitalize sm:text-2xl">
              {staff?.name}
            </h2>
          </div>
        </div>
        <Link
          to="/tasks"
          className="inline-flex items-center gap-1.5 rounded-xl bg-white/20 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur transition-all hover:bg-white/30"
        >
          View My Tasks <ArrowUpRight size={16} />
        </Link>
      </div>

      {/* Dynamic Stat cards (5 Items Layout) */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {!stats ? (
          Array.from({ length: 5 }).map((_, i) => <CardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              label="Pending"
              value={stats.pending}
              icon={Clock3}
              tone="amber"
            />
            <StatCard
              label="In Progress"
              value={stats.inProgress}
              icon={Activity}
              tone="violet"
            />
            <StatCard
              label="Completed"
              value={stats.completed}
              icon={CheckCircle2}
              tone="emerald"
            />
            <StatCard
              label="High Priority"
              value={stats.highPriority}
              icon={Flame}
              tone="rose"
            />
            <StatCard
              label="Performance"
              value={`${stats.performance}%`}
              icon={Gauge}
              tone="brand"
              trend="+4%"
            />
          </>
        )}
      </div>

      {/* Dynamic Charts */}
      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="glass-card rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
          <h3 className="mb-1 text-base font-bold text-slate-800">
            Monthly Task Completion
          </h3>
          <p className="mb-3 text-xs text-slate-400">
            Assigned vs completed over the last 6 months
          </p>
          {monthly ? <MonthlyBarChart data={monthly} /> : <ChartSkeleton />}
        </div>
        <div className="glass-card rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
          <h3 className="mb-1 text-base font-bold text-slate-800">
            Weekly Activity
          </h3>
          <p className="mb-3 text-xs text-slate-400">
            Tasks handled per day this week
          </p>
          {weekly ? <WeeklyLineChart data={weekly} /> : <ChartSkeleton />}
        </div>
      </div>

      {/* Upcoming Deadlines + Recent Notifications */}
      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Deadlines Section */}
        <div className="glass-card rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-3 flex items-center gap-2">
            <CalendarClock size={18} className="text-[#2563eb]" />
            <h3 className="text-base font-bold text-slate-800">
              Upcoming Deadlines
            </h3>
          </div>
          <div className="space-y-3">
            {!tasks ? (
              <ChartSkeleton />
            ) : upcomingDeadlines.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-400">
                No upcoming deadlines. You're all caught up!
              </p>
            ) : (
              upcomingDeadlines.map((t) => (
                <Link
                  to={`/tasks/${t._id || t.id}`}
                  key={t._id || t.id}
                  className="flex items-center justify-between rounded-xl border border-slate-100 p-3 transition-colors hover:bg-slate-50/80"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#2563eb]">
                      <Building2 size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-700">
                        {t.partyDetails?.partyName || t.client?.name || t.client || "Client Task"}
                      </p>
                      <p className="text-xs text-slate-400">
                        Due {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <PriorityBadge priority={t.priority || "Medium"} />
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent Notifications Section */}
        <div className="glass-card rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell size={18} className="text-[#2563eb]" />
              <h3 className="text-base font-bold text-slate-800">
                Recent Notifications
              </h3>
            </div>
            <Link
              to="/notifications"
              className="text-xs font-semibold text-[#2563eb] hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {!notifications ? (
              <ChartSkeleton />
            ) : notifications.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-400">
                No new notifications.
              </p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id || n.id}
                  className={`flex items-start gap-3 rounded-xl border p-3 transition-colors ${
                    !n.read
                      ? "border-blue-100 bg-blue-50/50"
                      : "border-slate-100 bg-white"
                  }`}
                >
                  <span
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                      !n.read ? "bg-[#2563eb] animate-pulse" : "bg-slate-300"
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-semibold ${!n.read ? "text-slate-900" : "text-slate-700"}`}>
                      {n.title}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {n.message}
                    </p>
                  </div>
                  <span className="ml-2 shrink-0 text-[11px] text-slate-400">
                    {formatTime(n.createdAt)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
