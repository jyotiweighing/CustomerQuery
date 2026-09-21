import {
  Inbox,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Users,
  Building2,
  Loader2,
  RefreshCw,
  Calendar,
  Filter,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import KpiCard from "../../../components/admin/cards/KpiCard";
import QueriesTable from "../../../components/admin/tables/QueriesTable";
import AssignStaffModal from "../../../components/admin/modals/AssignStaffModal";
import PageHeader from "../../../components/admin/common/PageHeader";
import Button from "../../../components/admin/common/Button";

import { getDashboardAnalytics } from "../../../services/admin/reportService";

// Exact Sidebar Palette for Pie Chart
const PIE_COLORS = ["#014478", "#0284C7", "#06B6D4", "#3B82F6", "#0ea5e9", "#22d3ee"];

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [deptChartLoading, setDeptChartLoading] = useState(false);
  const [assignTarget, setAssignTarget] = useState(null);

  // Filters State
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedDept, setSelectedDept] = useState("All");

  // Dashboard Main Data
  const [data, setData] = useState({
    departmentsList: [],
    kpis: {},
    statusPieData: [],
    monthlyQueries: [],
    departmentPerformance: [],
    recentQueries: [],
  });

  // Dedicated state for Staff Workload Chart
  const [deptChartData, setDeptChartData] = useState([]);

  // 1. Initial Load / Refresh Full Dashboard
  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await getDashboardAnalytics("All", selectedYear);
      if (res?.success) {
        setData(res);
        setDeptChartData(res.departmentPerformance || []);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [selectedYear]);

  // 2. Separate Fetcher ONLY for Department Workload Graph
  const handleDepartmentChange = async (e) => {
    const dept = e.target.value;
    setSelectedDept(dept);
    try {
      setDeptChartLoading(true);
      const res = await getDashboardAnalytics(dept, selectedYear);
      if (res?.success) {
        setDeptChartData(res.departmentPerformance || []);
      }
    } catch (error) {
      console.error("Error fetching department staff performance:", error);
    } finally {
      setDeptChartLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center gap-3 bg-slate-50 rounded-3xl p-6">
        <Loader2 className="animate-spin text-[#2563eb]" size={40} />
        <p className="text-xs font-bold uppercase tracking-wider text-[#2563eb]">
          Fetching Live Tasks & Analytics...
        </p>
      </div>
    );
  }

  const { departmentsList = [], kpis, statusPieData, monthlyQueries, recentQueries } = data;

  // KPI Cards Configuration
  const kpiList = [
    { title: "Total Task", value: kpis.totalTasks || 0, icon: Inbox },
    { title: "Pending Task", value: kpis.pendingTasks || 0, icon: Clock },
    { title: "Completed Task", value: kpis.completedTasks || 0, icon: CheckCircle2 },
    { title: "Total Department", value: kpis.totalDepartments || 0, icon: AlertTriangle },
    { title: "Active Staff", value: kpis.activeStaff || 0, icon: Users },
    { title: "Total Staff", value: kpis.totalStaff || 0, icon: Building2 },
  ];

  return (
    <div className="space-y-6 p-2 sm:p-4 min-h-screen rounded-3xl bg-slate-50/50">
      {/* Header Banner Perfectly Matching Sidebar Gradient */}
      <div className="bg-gradient-to-r from-[#2563eb] via-[#0284c7] to-[#06b6d4] p-6 rounded-2xl text-white shadow-md shadow-blue-500/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard</h1>
          <p className="text-blue-100 text-sm mt-1">
            Here's what's happening across your support desk today.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start md:self-auto">
          <button
            onClick={fetchAnalytics}
            className="p-2.5 text-white hover:bg-white/20 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 transition-all shadow-sm"
            title="Refresh Data"
          >
            <RefreshCw size={18} />
          </button>
          <button
            onClick={() => navigate("/installation")}
            className="px-4 py-2.5 bg-white text-[#2563eb] hover:bg-blue-50 font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all"
          >
            View all queries
          </button>
        </div>
      </div>

      {/* 1. Dynamic KPIs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiList.map((k) => (
          <div
            key={k.title}
            className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 border border-slate-100"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {k.title}
              </span>
              <div className="p-2 bg-sky-50 rounded-xl border border-sky-100">
                <k.icon size={18} className="text-[#0284c7]" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-800">{k.value}</div>
          </div>
        ))}
      </div>

      {/* 2. Monthly Chart & Status Pie Chart */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Monthly Task Volume Chart */}
        <div className="xl:col-span-2 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-base">Monthly Task Overview</h3>
            <div className="flex items-center gap-2 bg-sky-50 px-3 py-1.5 rounded-xl border border-sky-100">
              <Calendar size={14} className="text-[#0284c7]" />
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="bg-transparent text-xs font-bold text-slate-700 cursor-pointer focus:outline-none"
              >
                {[2024, 2025, 2026].map((y) => (
                  <option key={y} value={y}>
                    Year {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyQueries}>
              {/* Exact Sidebar Top-to-Bottom Gradient */}
              <defs>
                <linearGradient id="sidebarGradient1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#018ABE" />
                  <stop offset="100%" stopColor="#97CBD9" />
                </linearGradient>
                <linearGradient id="sidebarGradient2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#97CBD9" />
                  <stop offset="100%" stopColor="#71BBD7" />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fontWeight: 600, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 11, fontWeight: 600, fill: '#64748b' }} />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  borderColor: "#e2e8f0",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px", fontWeight: 700 }} />
              <Bar dataKey="total" fill="url(#sidebarGradient1)" name="Total Tasks" radius={[6, 6, 0, 0]} />
              <Bar dataKey="completed" fill="url(#sidebarGradient2)" name="Completed Tasks" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Task Status Pie Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 text-base mb-4 pb-2 border-b border-slate-100">
            Task Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={statusPieData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={4}
              >
                {statusPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: "12px", borderColor: "#e2e8f0" }} />
              <Legend wrapperStyle={{ fontSize: "12px", fontWeight: 700 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Department-Wise Staff Progress Chart */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-2 border-b border-slate-100">
          <h3 className="font-bold text-slate-800 text-base">
            Staff Workload Progress (Department-wise)
          </h3>

          {/* Department Selection Filter */}
          <div className="flex items-center gap-2 bg-sky-50 px-3.5 py-1.5 rounded-xl border border-sky-100 self-start sm:self-auto">
            <Filter size={14} className="text-[#0284c7]" />
            <span className="text-xs font-bold text-slate-700">Department:</span>
            <select
              value={selectedDept}
              onChange={handleDepartmentChange}
              className="bg-transparent text-xs font-bold text-slate-700 cursor-pointer focus:outline-none"
            >
              <option value="All">All Departments</option>
              {departmentsList.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loader specifically for graph */}
        {deptChartLoading ? (
          <div className="h-[280px] flex items-center justify-center gap-2">
            <Loader2 className="animate-spin text-[#0284c7]" size={24} />
            <span className="text-xs font-bold text-[#0284c7]">Filtering Staff Data...</span>
          </div>
        ) : deptChartData && deptChartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={deptChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="staffName" tick={{ fontSize: 11, fontWeight: 600, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 11, fontWeight: 600, fill: '#64748b' }} />
              <Tooltip contentStyle={{ borderRadius: "12px", borderColor: "#e2e8f0" }} />
              <Legend wrapperStyle={{ fontSize: "12px", fontWeight: 700 }} />
              <Bar dataKey="totalAssigned" fill="url(#sidebarGradient1)" name="Total Assigned Tasks" radius={[6, 6, 0, 0]} />
              <Bar dataKey="completed" fill="url(#sidebarGradient2)" name="Resolved Tasks" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[280px] flex items-center justify-center text-slate-400 text-sm font-medium">
            No staff tasks found for selected department.
          </div>
        )}
      </div>

      {/* 4. Recent Queries (Latest 5 Tasks) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg text-slate-800">Recent Tasks (Latest 5)</h2>
          <Link
            to="/installation"
            className="text-xs font-bold uppercase tracking-wider text-[#0284c7] hover:text-[#2563eb] hover:underline"
          >
            View all
          </Link>
        </div>
        <QueriesTable rows={recentQueries || []} onAssign={setAssignTarget} />
      </div>

      {/* Assign Staff Modal */}
      <AssignStaffModal
        open={!!assignTarget}
        query={assignTarget}
        onClose={() => setAssignTarget(null)}
        onAssigned={() => {
          setAssignTarget(null);
          fetchAnalytics();
        }}
      />
    </div>
  );
}

