import { useEffect, useMemo, useState } from 'react';
import { 
  ListChecks, 
  CheckCircle2, 
  Clock3, 
  Percent, 
  Star, 
  Download, 
  FileSpreadsheet,
  Wrench, 
  HelpCircle, 
  FileBarChart2,
  Filter
} from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';

import Layout from '../../components/staff/Layout';
import StatCard from '../../components/staff/StatCard';
import { StatusBadge, PriorityBadge } from '../../components/staff/Badge';
import { CardSkeleton, ChartSkeleton, TableRowSkeleton } from '../../components/staff/Skeleton';
import MonthlyBarChart from '../../components/staff/charts/MonthlyBarChart';
import WeeklyLineChart from '../../components/staff/charts/WeeklyLineChart';
import { useAuth } from '../../context/AuthContext';
import { fetchTasks, fetchMonthlyPerformance, fetchWeeklyActivity, fetchReports } from '../../services/staff/taskService';
import Logo from '../../assets/Logo1.png';

// Company Details Object
const COMPANY_INFO = {
  name: "JYOTI WEIGHING SYSTEMS PVT. LTD.",
  tagline: "Providing Complete Weighing Solution",
  address: "88, Jaora Compound Main Rd, Ushaganj, Near Family court, Indore, MP",
  phone: "+91-9755711999",
  email: "info@jyotiweighing.in",
  website: "www.jyotiweighing.in"
};

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

// --- EXACT UI THEME MATCHING GLASS ALERT ---
const showCustomAlert = (title, text, icon = 'info') => {
  const iconColors = {
    success: '#10b981', // Emerald Green
    warning: '#f59e0b', // Amber
    error: '#ef4444',   // Red
    info: '#2563eb'     // Theme Royal Blue
  };

  Swal.fire({
    title: `<span class="text-slate-900 dark:text-white font-extrabold text-xl tracking-tight">${title}</span>`,
    html: `<p class="text-slate-600 dark:text-slate-300 font-medium text-sm mt-1 leading-relaxed">${text}</p>`,
    icon: icon,
    iconColor: iconColors[icon] || iconColors.info,
    background: '#fff',
    backdrop: `
      rgba(15, 23, 42, 0.35)
      backdrop-filter: blur(10px)
      -webkit-backdrop-filter: blur(10px)
    `,
    showConfirmButton: true,
    confirmButtonText: 'Dismiss',
    buttonsStyling: false,
    showClass: {
      popup: 'animate-in fade-in zoom-in-95 duration-200 ease-out'
    },
    hideClass: {
      popup: 'animate-out fade-out zoom-out-95 duration-150 ease-in'
    },
    customClass: {
      popup: `
        rounded-3xl 
        bg-white/80 dark:bg-slate-900/85 
        backdrop-blur-2xl backdrop-saturate-150
        border border-white/60 dark:border-white/10
        shadow-[0_20px_50px_rgba(0,0,0,0.15)]
        p-7 transition-all max-w-sm w-full
      `,
      confirmButton: `
        mt-3 px-8 py-2.5 rounded-xl 
        bg-gradient-to-r from-blue-600 to-indigo-600 
        hover:from-blue-700 hover:to-indigo-700
        text-white font-bold text-sm 
        shadow-lg shadow-blue-500/25 
        hover:scale-[1.02] active:scale-95 
        transition-all duration-200 ease-out
      `
    }
  });
};

export default function Performance() {
  const { staff } = useAuth();

  const [tasks, setTasks] = useState(null);
  const [monthly, setMonthly] = useState(null);
  const [weekly, setWeekly] = useState(null);
  const [reports, setReports] = useState(null);
  const [tab, setTab] = useState('installation');
  
  // Year & Month Filter States
  const [selectedYear, setSelectedYear] = useState('ALL');
  const [selectedMonth, setSelectedMonth] = useState('ALL');

  useEffect(() => {
    const staffId = staff?._id || staff?.id || staff?.staffId;

    if (staffId) {
      fetchTasks(staffId).then((data) => setTasks(data));
      fetchMonthlyPerformance(staffId).then((data) => setMonthly(data));
      fetchWeeklyActivity(staffId).then((data) => setWeekly(data));
      fetchReports(staffId).then((data) => setReports(data));
    }
  }, [staff]);

  // Tab Wise Raw Data Filter
  const tabWiseData = useMemo(() => {
    if (reports) {
      return tab === 'installation' 
        ? reports.installationReports || [] 
        : reports.queryReports || [];
    }
    
    if (!tasks) return [];
    return tasks.filter((t) =>
      tab === 'installation'
        ? t.installationId || t.title?.toLowerCase().includes('installation')
        : !t.installationId && !t.title?.toLowerCase().includes('installation')
    );
  }, [reports, tasks, tab]);

  // Available Unique Years List
  const availableYears = useMemo(() => {
    if (!tabWiseData.length) return [];
    const years = tabWiseData.map((item) => {
      const dateStr = item.assignedDate || item.createdAt || item.dueDate;
      return dateStr ? new Date(dateStr).getFullYear() : null;
    }).filter(Boolean);
    
    return [...new Set(years)].sort((a, b) => b - a);
  }, [tabWiseData]);

  // Combined Filtered Data (Year + Month)
  const activeTableData = useMemo(() => {
    return tabWiseData.filter((item) => {
      const dateStr = item.assignedDate || item.createdAt || item.dueDate;
      if (!dateStr) return false;
      const d = new Date(dateStr);
      
      const matchYear = selectedYear === 'ALL' || d.getFullYear().toString() === selectedYear.toString();
      const matchMonth = selectedMonth === 'ALL' || d.getMonth().toString() === selectedMonth.toString();
      
      return matchYear && matchMonth;
    });
  }, [tabWiseData, selectedYear, selectedMonth]);

  // Dynamic Metrics Calculation
  const stats = useMemo(() => {
    if (!tasks) return null;
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'Completed' || t.status === 'Resolved').length;
    const pending = tasks.filter((t) => t.status === 'Pending' || t.status === 'In Progress').length;
    const successRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, pending, successRate };
  }, [tasks]);

  // --- EXCEL DOWNLOAD ---
  const handleDownloadExcel = () => {
    if (!activeTableData.length) {
      showCustomAlert('No Data Found', 'No task data available for selected filter.', 'warning');
      return;
    }

    const filterText = `${selectedMonth !== 'ALL' ? MONTH_NAMES[parseInt(selectedMonth)] : 'All Months'} - ${selectedYear}`;
    
    const excelRows = activeTableData.map((t) => {
      const assignedDateObj = t.assignedDate || t.createdAt;
      return {
        'Task ID': t.taskId || t._id?.substring(0, 8) || 'N/A',
        'Client Name': t.partyDetails?.partyName || t.client?.name || t.client || 'N/A',
        'Software Details': t.softwareDetails || t.softwareType || t.software?.name || 'N/A',
        'Assigned Date': assignedDateObj ? new Date(assignedDateObj).toLocaleDateString('en-IN') : 'N/A',
        'Due Date': t.dueDate ? new Date(t.dueDate).toLocaleDateString('en-IN') : 'N/A',
        'Status': t.status || 'Pending',
        'Priority': t.priority || 'Medium'
      };
    });

    const worksheet = XLSX.utils.json_to_sheet([]);

    XLSX.utils.sheet_add_aoa(worksheet, [
      [`COMPANY: ${COMPANY_INFO.name}`],
      [`REPORT TYPE: ${tab.toUpperCase()} REPORT`],
      [`PERIOD FILTER: ${filterText}`],
      [`TOTAL RECORDS: ${activeTableData.length}`],
      []
    ], { origin: 'A1' });

    XLSX.utils.sheet_add_json(worksheet, excelRows, { origin: 'A6', skipHeader: false });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
    XLSX.writeFile(workbook, `${tab}_Report_${filterText.replace(/\s+/g, '_')}.xlsx`);
    
    showCustomAlert('Download Complete', 'Excel report downloaded successfully!', 'success');
  };

  // --- ULTRA-BEAUTIFUL BRANDED PDF DOWNLOAD ---
  const handleDownloadPDF = () => {
    if (!activeTableData.length) {
      showCustomAlert('No Data Found', 'No task data available to export PDF.', 'warning');
      return;
    }

    const doc = new jsPDF('p', 'mm', 'a4');
    const filterText = `${selectedMonth !== 'ALL' ? MONTH_NAMES[parseInt(selectedMonth)] : 'All Months'} ${selectedYear !== 'ALL' ? selectedYear : 'All Years'}`;
    const reportTitle = `${tab === 'installation' ? 'INSTALLATION' : 'SERVICE QUERY'} PERFORMANCE REPORT`;
    
    const generatedOn = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const pdfBody = activeTableData.map((t) => [
      t.taskId || t._id?.substring(0, 8) || 'N/A',
      t.partyDetails?.partyName || t.client?.name || t.client || 'N/A',
      t.softwareDetails || t.softwareType || 'N/A',
      t.assignedDate || t.createdAt ? new Date(t.assignedDate || t.createdAt).toLocaleDateString('en-IN') : 'N/A',
      t.dueDate ? new Date(t.dueDate).toLocaleDateString('en-IN') : 'N/A',
      t.status || 'Pending',
      t.priority || 'Medium'
    ]);

    autoTable(doc, {
      startY: 83,
      head: [['Task ID', 'Client / Party Name', 'Software / Type', 'Assigned', 'Due Date', 'Status', 'Priority']],
      body: pdfBody,
      theme: 'grid',
      headStyles: { 
        fillColor: [15, 23, 42],
        textColor: [255, 255, 255],
        fontSize: 8.5,
        fontStyle: 'bold',
        halign: 'left',
        cellPadding: 3.5
      },
      styles: { 
        fontSize: 8, 
        cellPadding: 3,
        textColor: [30, 41, 59],
        lineColor: [241, 245, 249],
        lineWidth: 0.2
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      },
      columnStyles: {
        0: { fontStyle: 'bold', textColor: [37, 99, 235] },
        1: { fontStyle: 'bold' },
        5: { fontStyle: 'bold' },
        6: { fontStyle: 'bold' }
      },
      margin: { top: 82, bottom: 20, left: 14, right: 14 },

      didParseCell: (data) => {
        if (data.section === 'body') {
          if (data.column.index === 5) {
            const status = String(data.cell.raw).toLowerCase();
            if (status.includes('completed') || status.includes('resolved')) {
              data.cell.styles.textColor = [16, 185, 129];
            } else if (status.includes('pending') || status.includes('in progress')) {
              data.cell.styles.textColor = [245, 158, 11];
            }
          }
          if (data.column.index === 6) {
            const priority = String(data.cell.raw).toLowerCase();
            if (priority.includes('high') || priority.includes('urgent')) {
              data.cell.styles.textColor = [239, 68, 68];
            } else if (priority.includes('medium')) {
              data.cell.styles.textColor = [59, 130, 246];
            } else {
              data.cell.styles.textColor = [100, 116, 139];
            }
          }
        }
      },
      
      didDrawPage: (data) => {
        const pageSize = doc.internal.pageSize;
        const pageWidth = pageSize.width || pageSize.getWidth();
        const pageHeight = pageSize.height || pageSize.getHeight();

        // Top Branding Accent Line
        doc.setFillColor(37, 99, 235);
        doc.rect(0, 0, pageWidth, 3, 'F');

        // Background Watermark
        doc.saveGraphicsState();
        doc.setGState(new doc.GState({ opacity: 0.04 }));
        try {
          doc.addImage(Logo, 'PNG', pageWidth / 2 - 45, pageHeight / 2 - 45, 90, 90);
        } catch (e) {}
        doc.restoreGraphicsState();

        // Centered Header Section
        const logoWidth = 40;
        const logoHeight = 24;
        const logoX = (pageWidth - logoWidth) / 2;
        const logoY = 6;

        try {
          doc.addImage(Logo, 'PNG', logoX, logoY, logoWidth, logoHeight);
        } catch(e) {}

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text(COMPANY_INFO.name, pageWidth / 2, 34, { align: 'center' });

        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 116, 139);
        doc.text(COMPANY_INFO.tagline, pageWidth / 2, 38.5, { align: 'center' });
        doc.text(COMPANY_INFO.address, pageWidth / 2, 42, { align: 'center' });

        doc.setTextColor(71, 85, 105);
        const contactText = `Email: ${COMPANY_INFO.email} | Phone: ${COMPANY_INFO.phone} | Generated: ${generatedOn}`;
        doc.text(contactText, pageWidth / 2, 45.5, { align: 'center' });

        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.5);
        doc.line(14, 48.5, pageWidth - 14, 48.5);

        // Summary Banner
        const bannerY = 51;
        const bannerHeight = 28;
        
        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(226, 232, 240);
        doc.roundedRect(14, bannerY, pageWidth - 28, bannerHeight, 3, 3, 'FD');

        doc.setFillColor(37, 99, 235);
        doc.roundedRect(14, bannerY, 3, bannerHeight, 1.5, 1.5, 'F');

        doc.setFontSize(10.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text(reportTitle, 22, bannerY + 8);

        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105);

        doc.text(`Staff Executive: `, 22, bannerY + 15);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text(`${staff?.name || staff?.fullName || 'All Staff Members'}`, 45, bannerY + 15);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105);
        doc.text(`Period Filter: `, 22, bannerY + 21);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text(`${filterText}`, 42, bannerY + 21);

        const totalRecords = activeTableData.length;
        doc.setFillColor(238, 242, 255);
        doc.roundedRect(pageWidth - 58, bannerY + 4.5, 40, 19, 2, 2, 'F');

        doc.setFontSize(6.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(79, 70, 229);
        doc.text('TOTAL RECORDS', pageWidth - 38, bannerY + 10.5, { align: 'center' });

        doc.setFontSize(10.5);
        doc.text(`${totalRecords}`, pageWidth - 38, bannerY + 18, { align: 'center' });

        // Footer
        doc.setDrawColor(226, 232, 240);
        doc.line(14, pageHeight - 14, pageWidth - 14, pageHeight - 14);

        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(148, 163, 184);
        doc.text(`CONFIDENTIAL - ${COMPANY_INFO.name}`, 14, pageHeight - 8);

        const pageStr = `Page ${data.pageNumber} of ${doc.internal.getNumberOfPages()}`;
        doc.text(pageStr, pageWidth - 14 - doc.getTextWidth(pageStr), pageHeight - 8);
      }
    });

    doc.save(`${tab}_Report_${filterText.replace(/\s+/g, '_')}.pdf`);
    showCustomAlert('PDF Generated', 'Branded PDF report generated successfully!', 'success');
  };

  return (
    <Layout title="My Performance" subtitle="Track your productivity, metrics, and detailed task reports.">
      
      {/* Top Controls Section */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        
        {/* Navigation Tabs */}
        <div className="flex gap-1.5 rounded-2xl border border-white/20 bg-white/40 p-1.5 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/40">
          <button
            onClick={() => setTab('installation')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-300 ${
              tab === 'installation'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-white/30 dark:text-slate-300'
            }`}
          >
            <Wrench size={15} /> Installations
          </button>
          <button
            onClick={() => setTab('query')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-300 ${
              tab === 'query'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-white/30 dark:text-slate-300'
            }`}
          >
            <HelpCircle size={15} /> Queries
          </button>
        </div>

        {/* Filter Dropdowns & Export Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          
          <div className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/50 px-3 py-1.5 text-sm backdrop-blur-md dark:border-white/10 dark:bg-slate-800/50">
            <Filter size={14} className="text-indigo-600 dark:text-indigo-400" />
            
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none dark:text-slate-100"
            >
              <option value="ALL" className="dark:bg-slate-900">All Months</option>
              {MONTH_NAMES.map((month, idx) => (
                <option key={month} value={idx} className="dark:bg-slate-900">{month}</option>
              ))}
            </select>

            <span className="text-slate-300 dark:text-slate-700">|</span>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none dark:text-slate-100"
            >
              <option value="ALL" className="dark:bg-slate-900">All Years</option>
              {availableYears.map((yr) => (
                <option key={yr} value={yr} className="dark:bg-slate-900">{yr}</option>
              ))}
            </select>
          </div>

          <button 
            onClick={handleDownloadExcel} 
            className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white shadow-lg backdrop-blur-md transition-all duration-200 hover:scale-[1.02] active:scale-95"
          >
            <FileSpreadsheet size={16} /> Excel
          </button>

          <button 
            onClick={handleDownloadPDF} 
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg backdrop-blur-md transition-all duration-200 hover:scale-[1.02] active:scale-95"
          >
            <Download size={16} /> PDF Report
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {!stats ? (
          Array.from({ length: 5 }).map((_, i) => <CardSkeleton key={i} />)
        ) : (
          <>
            <StatCard label="Total Assigned" value={stats.total} icon={ListChecks} tone="brand" />
            <StatCard label="Completed" value={stats.completed} icon={CheckCircle2} tone="emerald" />
            <StatCard label="Pending" value={stats.pending} icon={Clock3} tone="amber" />
            <StatCard label="Success Rate" value={`${stats.successRate}%`} icon={Percent} tone="brand" trend="+2%" />
            <StatCard label="Rating" value={staff?.rating || '5.0'} icon={Star} tone="amber" />
          </>
        )}
      </div>

      {/* Analytics Charts */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/20 bg-gradient-to-br from-white/60 to-white/20 p-6 shadow-xl backdrop-blur-2xl dark:border-white/10 dark:from-slate-900/60 dark:to-slate-900/20">
          <div className="mb-3 flex items-center gap-2">
            <FileBarChart2 size={18} className="text-blue-600 dark:text-blue-400" />
            <h3 className="text-base font-bold text-slate-800 dark:text-white">Monthly Performance</h3>
          </div>
          <p className="mb-4 text-xs font-medium text-slate-500 dark:text-slate-400">Assigned vs completed tasks by month</p>
          {monthly ? <MonthlyBarChart data={monthly} /> : <ChartSkeleton />}
        </div>

        <div className="rounded-3xl border border-white/20 bg-gradient-to-br from-white/60 to-white/20 p-6 shadow-xl backdrop-blur-2xl dark:border-white/10 dark:from-slate-900/60 dark:to-slate-900/20">
          <h3 className="mb-1 text-base font-bold text-slate-800 dark:text-white">Weekly Graph</h3>
          <p className="mb-4 text-xs font-medium text-slate-500 dark:text-slate-400">Daily task volume this week</p>
          {weekly ? <WeeklyLineChart data={weekly} /> : <ChartSkeleton />}
        </div>
      </div>

      {/* Table Section */}
      <div className="mt-6 rounded-3xl border border-white/20 bg-gradient-to-br from-white/70 via-white/40 to-white/20 p-6 shadow-xl backdrop-blur-2xl dark:border-white/10 dark:from-slate-900/70 dark:to-slate-900/20">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-800 dark:text-white">
            {tab === 'installation' ? 'Installation Reports' : 'Query Reports'}
          </h3>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Showing {activeTableData.length} filtered entries
          </span>
        </div>

        {!reports && !tasks ? (
          <table className="w-full">
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRowSkeleton key={i} />
              ))}
            </tbody>
          </table>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-white/20 text-xs uppercase tracking-wider text-slate-500 dark:border-white/10 dark:text-slate-400">
                  <th className="px-3 py-3">Task ID</th>
                  <th className="px-3 py-3">Client</th>
                  <th className="px-3 py-3">Software</th>
                  <th className="px-3 py-3">Assigned Date</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Priority</th>
                  <th className="px-3 py-3">Due Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 dark:divide-white/5">
                {activeTableData.map((t) => (
                  <tr key={t._id || t.id} className="transition-colors hover:bg-white/30 dark:hover:bg-slate-800/40">
                    <td className="px-3 py-3 font-semibold text-blue-600 dark:text-blue-400">
                      {t.taskId || t._id?.substring(0, 8)}
                    </td>
                    <td className="px-3 py-3 font-medium text-slate-700 dark:text-slate-200">
                      {t.partyDetails?.partyName || t.client?.name || t.client || 'N/A'}
                    </td>
                    <td className="px-3 py-3 text-slate-600 dark:text-slate-300">
                      {t.softwareDetails || t.softwareType || t.software?.name || 'N/A'}
                    </td>
                    <td className="px-3 py-3 text-slate-500 dark:text-slate-400">
                      {t.assignedDate || t.createdAt ? new Date(t.assignedDate || t.createdAt).toLocaleDateString('en-IN') : 'N/A'}
                    </td>
                    <td className="px-3 py-3">
                      <StatusBadge status={t.status} />
                    </td>
                    <td className="px-3 py-3">
                      <PriorityBadge priority={t.priority} />
                    </td>
                    <td className="px-3 py-3 text-slate-500 dark:text-slate-400">
                      {t.dueDate ? new Date(t.dueDate).toLocaleDateString('en-IN') : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </Layout>
  );
}