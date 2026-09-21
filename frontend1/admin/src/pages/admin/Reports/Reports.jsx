import React, { useState, useEffect, useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Inbox,
  CheckCircle2,
  Clock,
  Timer,
  Percent,
  Loader2,
  Filter,
  FileSpreadsheet,
  FileText,
  Calendar,
  User,
  AlertCircle,
  FolderX,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

import PageHeader from "../../../components/admin/common/PageHeader";
import { getAnalytics } from "../../../services/admin/reportService";

// Standard Company Logo import (Replace path as per your folder structure)
import Logo from "../../../assets/Logo1.png";

const COMPANY_INFO = {
  name: "JYOTI WEIGHING SYSTEMS PVT. LTD.",
  tagline: "Providing Complete Weighing Solution",
  address:
    "88, Jaora Compound Main Rd, Ushaganj, Near Family court, Indore, MP",
  email: "info@jyotiweighing.in",
  phone: "+91-9876543210",
};

// Exact Theme extracted from your uploaded Sidebar image (Vibrant Royal Blue to Cyan)
const THEME = {
  bannerFrom: "#2B52F5",
  bannerTo: "#00B5FF",
  pageBg: "#F0F5FF",
};

// Vibrant Blue & Cyan Palette for Pie Charts and Badges
const ELECTRIC_BLUE_PALETTE = [
  "#2B52F5", // Royal Electric Blue (Sidebar Top)
  "#008BF8", // Vibrant Azure Blue
  "#00B5FF", // Cyan / Sky Blue (Sidebar Bottom)
  "#0284C7", // Ocean Blue
  "#38BDF8", // Light Sky Blue
  "#6366F1", // Indigo Accent
];

export default function DynamicReports() {
  const [selectedDept, setSelectedDept] = useState("All");
  const [departmentsList, setDepartmentsList] = useState(["All"]);
  const [loading, setLoading] = useState(true);
  const [staffLoading, setStaffLoading] = useState(false);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedStaff, setSelectedStaff] = useState("ALL");

  const [data, setData] = useState({
    masterStaffList: [],
    summary: {},
    taskStatusSplit: [],
    monthlyTasks: [],
    departmentStats: [],
    staffProgress: [],
    taskList: [],
  });

  // --- API FETCH EFFECT ---
  useEffect(() => {
    const fetchFilteredAnalytics = async () => {
      try {
        if (!loading) setStaffLoading(true);

        const result = await getAnalytics({
          department: selectedDept,
          fromDate,
          toDate,
          staff: selectedStaff,
        });

        if (result?.success) {
          setData(result);

          if (result.masterStaffList && result.masterStaffList.length > 0) {
            const depts = result.masterStaffList
              .map((s) => s.department)
              .filter(Boolean);
            setDepartmentsList(["All", ...new Set(depts)]);
          }
        }
      } catch (err) {
        console.error("Error fetching analytics:", err);
      } finally {
        setLoading(false);
        setStaffLoading(false);
      }
    };

    const timer = setTimeout(fetchFilteredAnalytics, 300);
    return () => clearTimeout(timer);
  }, [selectedDept, fromDate, toDate, selectedStaff]);

  // --- DEPENDENT STAFF DROPDOWN ---
  const availableStaffOptions = useMemo(() => {
    const list = data.masterStaffList || [];
    if (selectedDept === "All") {
      return ["ALL", ...new Set(list.map((s) => s.name))];
    }
    const filteredByDept = list.filter(
      (s) => s.department?.toLowerCase() === selectedDept.toLowerCase(),
    );
    return ["ALL", ...new Set(filteredByDept.map((s) => s.name))];
  }, [data.masterStaffList, selectedDept]);

  const handleDepartmentChange = (dept) => {
    setSelectedDept(dept);
    setSelectedStaff("ALL");
  };

  const hasDataAvailable = data.taskList && data.taskList.length > 0;

  // --- EXCEL DOWNLOAD (Includes Staff Summary Table at Bottom) ---
  const handleDownloadExcel = () => {
    if (!hasDataAvailable) {
      alert("No data available for selected filters!");
      return;
    }

    const workbook = XLSX.utils.book_new();

    // 1. Task List Sheet
    const excelData = data.taskList.map((t, idx) => ({
      "S.No": idx + 1,
      "Task ID": t.taskId,
      "Assigned Staff": t.assignedStaffName || "N/A",
      Department: t.assignedStaffDept || "General",
      "Client Name": t.clientName,
      "Software Type": t.softwareType,
      Installtion: t.softwareDetails,
      "Assigned Date": t.assignedDate,
      "Due Date": t.dueDate,
      "Progress Date": t.progressDate,
      "Bill No": t.billNumber,
      "Bill Date": t.billDate,
      "Po Number": t.poNumber,
      Status: t.status,
      Priority: t.priority,
    }));
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Task Report");

    // 2. Staff Summary Sheet
    if (data.staffProgress && data.staffProgress.length > 0) {
      const staffSummaryData = data.staffProgress.map((s, idx) => ({
        "S.No": idx + 1,
        "Staff Name": s.name,
        Department: s.department || "General",
        "Total Assigned": s.totalAssigned || 0,
        Completed: s.completed || 0,
        Pending: s.pending || 0,
        "In Progress": s.inProgress || 0,
        "Completion Rate (%)": `${s.completionRate || 0}%`,
      }));

      // Grand Totals Calculation
      const totalAssignedSum = data.staffProgress.reduce(
        (acc, curr) => acc + (curr.totalAssigned || 0),
        0,
      );
      const completedSum = data.staffProgress.reduce(
        (acc, curr) => acc + (curr.completed || 0),
        0,
      );
      const pendingSum = data.staffProgress.reduce(
        (acc, curr) => acc + (curr.pending || 0),
        0,
      );
      const inProgressSum = data.staffProgress.reduce(
        (acc, curr) => acc + (curr.inProgress || 0),
        0,
      );

      staffSummaryData.push({
        "S.No": "TOTAL",
        "Staff Name": "GRAND TOTAL",
        Department: "-",
        "Total Assigned": totalAssignedSum,
        Completed: completedSum,
        Pending: pendingSum,
        "In Progress": inProgressSum,
        "Completion Rate (%)":
          totalAssignedSum > 0
            ? `${((completedSum / totalAssignedSum) * 100).toFixed(1)}%`
            : "0%",
      });

      const staffWorksheet = XLSX.utils.json_to_sheet(staffSummaryData);
      XLSX.utils.book_append_sheet(workbook, staffWorksheet, "Staff Summary");
    }

    XLSX.writeFile(
      workbook,
      `Task_Report_${selectedDept}_${selectedStaff}_${new Date().toISOString().slice(0, 10)}.xlsx`,
    );
  };

  // --- PDF DOWNLOAD (Branded Header & Watermark Logo) ---
  // const handleDownloadPDF = () => {
  //   if (!hasDataAvailable) {
  //     alert("No task data available to export PDF.");
  //     return;
  //   }

  //   const doc = new jsPDF("p", "mm", "a4");
  //   const reportTitle = "TASK & STAFF PERFORMANCE REPORT";
  //   const generatedOn = new Date().toLocaleDateString("en-IN", {
  //     day: "2-digit",
  //     month: "short",
  //     year: "numeric",
  //     hour: "2-digit",
  //     minute: "2-digit",
  //   });

  //   const filterText = `Dept: ${selectedDept} | Staff: ${selectedStaff} | Dates: ${fromDate || "All"} to ${toDate || "All"}`;

  //   const pdfBody = data.taskList.map((t) => [
  //     t.taskId || "N/A",
  //     t.assignedStaffName || "N/A",
  //     t.clientName || "N/A",
  //     t.softwareType || "N/A",
  //     t.softwareDetails || "N/A",
  //     t.billDate || "N/A",
  //     t.billNumber || "N/A",
  //     t.poNumber || "N/A",
  //     t.assignedDate || "N/A",
  //     t.dueDate || "N/A",
  //     t.status || "Pending",
  //     t.priority || "Medium",
  //   ]);

  //   autoTable(doc, {
  //     startY: 83,
  //     head: [
  //       [
  //         "Task ID",
  //         "Staff Name",
  //         "Client / Party",
  //         "Software / Type",
  //         "Installation",
  //         "Bill Date",
  //         "Bill No",
  //         "Po No",
  //         "Assigned",
  //         "Due Date",
  //         "Status",
  //         "Priority",
  //       ],
  //     ],
  //     body: pdfBody,
  //     theme: "grid",
  //     headStyles: {
  //       fillColor: [43, 82, 245], // #2B52F5 (Vibrant Royal Blue)
  //       textColor: [255, 255, 255],
  //       fontSize: 8.5,
  //       fontStyle: "bold",
  //       halign: "left",
  //       cellPadding: 3.5,
  //     },
  //     styles: {
  //       fontSize: 7.5,
  //       cellPadding: 3,
  //       textColor: [30, 41, 59],
  //       lineColor: [241, 245, 249],
  //       lineWidth: 0.2,
  //     },
  //     alternateRowStyles: {
  //       fillColor: [248, 250, 252],
  //     },
  //     columnStyles: {
  //       0: { fontStyle: "bold", textColor: [43, 82, 245] },
  //       1: { fontStyle: "bold" },
  //       6: { fontStyle: "bold" },
  //       7: { fontStyle: "bold" },
  //     },
  //     margin: { top: 82, bottom: 20, left: 14, right: 14 },

  //     didParseCell: (dataCell) => {
  //       if (dataCell.section === "body") {
  //         if (dataCell.column.index === 6) {
  //           const status = String(dataCell.cell.raw).toLowerCase();
  //           if (status.includes("completed")) {
  //             dataCell.cell.styles.textColor = [16, 185, 129];
  //           } else if (
  //             status.includes("pending") ||
  //             status.includes("in progress")
  //           ) {
  //             dataCell.cell.styles.textColor = [245, 158, 11];
  //           }
  //         }
  //         if (dataCell.column.index === 7) {
  //           const priority = String(dataCell.cell.raw).toLowerCase();
  //           if (priority.includes("high") || priority.includes("urgent")) {
  //             dataCell.cell.styles.textColor = [239, 68, 68];
  //           } else if (priority.includes("medium")) {
  //             dataCell.cell.styles.textColor = [43, 82, 245];
  //           } else {
  //             dataCell.cell.styles.textColor = [100, 116, 139];
  //           }
  //         }
  //       }
  //     },

  //     didDrawPage: (pageData) => {
  //       const pageSize = doc.internal.pageSize;
  //       const pageWidth = pageSize.width || pageSize.getWidth();
  //       const pageHeight = pageSize.height || pageSize.getHeight();

  //       // Top Branding Accent Line
  //       doc.setFillColor(43, 82, 245);
  //       doc.rect(0, 0, pageWidth, 3.5, "F");

  //       // Background Watermark Logo
  //       doc.saveGraphicsState();
  //       doc.setGState(new doc.GState({ opacity: 0.04 }));
  //       try {
  //         doc.addImage(
  //           Logo,
  //           "PNG",
  //           pageWidth / 2 - 45,
  //           pageHeight / 2 - 45,
  //           90,
  //           90,
  //         );
  //       } catch (e) {}
  //       doc.restoreGraphicsState();

  //       // Centered Header Section
  //       const logoWidth = 32;
  //       const logoHeight = 20;
  //       const logoX = (pageWidth - logoWidth) / 2;
  //       const logoY = 6;

  //       try {
  //         doc.addImage(Logo, "PNG", logoX, logoY, logoWidth, logoHeight);
  //       } catch (e) {}

  //       doc.setFontSize(12);
  //       doc.setFont("helvetica", "bold");
  //       doc.setTextColor(30, 41, 59);
  //       doc.text(COMPANY_INFO.name, pageWidth / 2, 31, { align: "center" });

  //       doc.setFontSize(7.5);
  //       doc.setFont("helvetica", "normal");
  //       doc.setTextColor(100, 116, 139);
  //       doc.text(COMPANY_INFO.tagline, pageWidth / 2, 35.5, {
  //         align: "center",
  //       });
  //       doc.text(COMPANY_INFO.address, pageWidth / 2, 39, { align: "center" });

  //       doc.setTextColor(71, 85, 105);
  //       const contactText = `Email: ${COMPANY_INFO.email} | Phone: ${COMPANY_INFO.phone} | Generated: ${generatedOn}`;
  //       doc.text(contactText, pageWidth / 2, 42.5, { align: "center" });

  //       doc.setDrawColor(226, 232, 240);
  //       doc.setLineWidth(0.5);
  //       doc.line(14, 46, pageWidth - 14, 46);

  //       // Summary Banner Box
  //       const bannerY = 49;
  //       const bannerHeight = 28;

  //       doc.setFillColor(248, 250, 252);
  //       doc.setDrawColor(226, 232, 240);
  //       doc.roundedRect(14, bannerY, pageWidth - 28, bannerHeight, 3, 3, "FD");

  //       doc.setFillColor(43, 82, 245);
  //       doc.roundedRect(14, bannerY, 3, bannerHeight, 1.5, 1.5, "F");

  //       doc.setFontSize(10.5);
  //       doc.setFont("helvetica", "bold");
  //       doc.setTextColor(15, 23, 42);
  //       doc.text(reportTitle, 22, bannerY + 8);

  //       doc.setFontSize(7.5);
  //       doc.setFont("helvetica", "normal");
  //       doc.setTextColor(71, 85, 105);

  //       doc.text(`Staff / Department: `, 22, bannerY + 15);
  //       doc.setFont("helvetica", "bold");
  //       doc.setTextColor(15, 23, 42);
  //       doc.text(`${selectedStaff} (${selectedDept})`, 48, bannerY + 15);

  //       doc.setFont("helvetica", "normal");
  //       doc.setTextColor(71, 85, 105);
  //       doc.text(`Filter Applied: `, 22, bannerY + 21);
  //       doc.setFont("helvetica", "bold");
  //       doc.setTextColor(15, 23, 42);
  //       doc.text(`${filterText}`, 42, bannerY + 21);

  //       const totalRecords = data.taskList.length;
  //       doc.setFillColor(238, 242, 255);
  //       doc.roundedRect(pageWidth - 58, bannerY + 4.5, 40, 19, 2, 2, "F");

  //       doc.setFontSize(6.5);
  //       doc.setFont("helvetica", "bold");
  //       doc.setTextColor(43, 82, 245);
  //       doc.text("TOTAL RECORDS", pageWidth - 38, bannerY + 10.5, {
  //         align: "center",
  //       });

  //       doc.setFontSize(10.5);
  //       doc.text(`${totalRecords}`, pageWidth - 38, bannerY + 18, {
  //         align: "center",
  //       });

  //       // Footer
  //       doc.setDrawColor(226, 232, 240);
  //       doc.line(14, pageHeight - 14, pageWidth - 14, pageHeight - 14);

  //       doc.setFontSize(7.5);
  //       doc.setFont("helvetica", "normal");
  //       doc.setTextColor(148, 163, 184);
  //       doc.text(`CONFIDENTIAL - ${COMPANY_INFO.name}`, 14, pageHeight - 8);

  //       const pageStr = `Page ${pageData.pageNumber} of ${doc.internal.getNumberOfPages()}`;
  //       doc.text(
  //         pageStr,
  //         pageWidth - 14 - doc.getTextWidth(pageStr),
  //         pageHeight - 8,
  //       );
  //     },
  //   });

  //   doc.save(`Task_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
  // };

  const handleDownloadPDF = () => {
  if (!hasDataAvailable) {
    alert("No task data available to export PDF.");
    return;
  }

  // 1. Change orientation to Landscape ("l") for 12 columns
  const doc = new jsPDF("l", "mm", "a4");
  const reportTitle = "TASK & STAFF PERFORMANCE REPORT";
  const totalPagesExp = "{total_pages_count_string}";

  const generatedOn = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const filterText = `Dept: ${selectedDept} | Staff: ${selectedStaff} | Dates: ${fromDate || "All"} to ${toDate || "All"}`;

  // Helper function to format dates cleanly
  const formatDate = (dateStr) => {
    if (!dateStr || dateStr === "N/A") return "N/A";
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? dateStr : date.toLocaleDateString("en-IN");
  };

  const pdfBody = data.taskList.map((t) => [
    t.taskId || "N/A",
    t.assignedStaffName || "N/A",
    t.clientName || "N/A",
    t.softwareType || "N/A",
    t.softwareDetails || "N/A",
    formatDate(t.billDate),
    t.billNumber || "N/A",
    t.poNumber || "N/A",
    formatDate(t.assignedDate),
    formatDate(t.dueDate),
    t.status || "Pending",
    t.priority || "Medium",
  ]);

  autoTable(doc, {
    startY: 68,
    head: [
      [
        "Task ID",
        "Staff Name",
        "Client / Party",
        "Software",
        "Installation",
        "Bill Date",
        "Bill No",
        "PO No",
        "Assigned",
        "Due Date",
        "Status",
        "Priority",
      ],
    ],
    body: pdfBody,
    theme: "grid",
    headStyles: {
      fillColor: [43, 82, 245],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: "bold",
      halign: "left",
      cellPadding: 3,
    },
    styles: {
      fontSize: 7.5,
      cellPadding: 2.5,
      textColor: [30, 41, 59],
      lineColor: [241, 245, 249],
      lineWidth: 0.2,
      overflow: "linebreak",
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { fontStyle: "bold", textColor: [43, 82, 245], cellWidth: 22 },
      1: { fontStyle: "bold", cellWidth: 25 },
      2: { cellWidth: 28 },
      3: { cellWidth: 22 },
      4: { cellWidth: 28 },
      5: { cellWidth: 22 },
      6: { fontStyle: "bold", cellWidth: 22 },
      7: { fontStyle: "bold", cellWidth: 20 },
      8: { cellWidth: 22 },
      9: { cellWidth: 22 },
      10: { cellWidth: 22 },
      11: { cellWidth: 20 },
    },
    margin: { top: 68, bottom: 18, left: 12, right: 12 },

    didParseCell: (dataCell) => {
      if (dataCell.section === "body") {
        // Correct Column Indexes for Status (10) and Priority (11)
        if (dataCell.column.index === 10) {
          const status = String(dataCell.cell.raw).toLowerCase();
          if (status.includes("completed")) {
            dataCell.cell.styles.textColor = [16, 185, 129];
          } else if (
            status.includes("pending") ||
            status.includes("in progress")
          ) {
            dataCell.cell.styles.textColor = [245, 158, 11];
          }
        }
        if (dataCell.column.index === 11) {
          const priority = String(dataCell.cell.raw).toLowerCase();
          if (priority.includes("high") || priority.includes("urgent")) {
            dataCell.cell.styles.textColor = [239, 68, 68];
          } else if (priority.includes("medium")) {
            dataCell.cell.styles.textColor = [43, 82, 245];
          } else {
            dataCell.cell.styles.textColor = [100, 116, 139];
          }
        }
      }
    },

    didDrawPage: (pageData) => {
      const pageSize = doc.internal.pageSize;
      const pageWidth = pageSize.width || pageSize.getWidth();
      const pageHeight = pageSize.height || pageSize.getHeight();

      // Top Branding Accent Line
      doc.setFillColor(43, 82, 245);
      doc.rect(0, 0, pageWidth, 3.5, "F");

      // Watermark Logo
      doc.saveGraphicsState();
      doc.setGState(new doc.GState({ opacity: 0.04 }));
      try {
        doc.addImage(
          Logo,
          "PNG",
          pageWidth / 2 - 40,
          pageHeight / 2 - 40,
          80,
          80
        );
      } catch (e) {}
      doc.restoreGraphicsState();

      // Header Section
      const logoWidth = 26;
      const logoHeight = 16;
      const logoX = 12;
      const logoY = 6;

      try {
        doc.addImage(Logo, "PNG", logoX, logoY, logoWidth, logoHeight);
      } catch (e) {}

      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 41, 59);
      doc.text(COMPANY_INFO.name, 42, 11);

      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 116, 139);
      doc.text(COMPANY_INFO.tagline, 42, 15);
      doc.text(COMPANY_INFO.address, 42, 18.5);

      doc.setTextColor(71, 85, 105);
      const contactText = `Email: ${COMPANY_INFO.email} | Phone: ${COMPANY_INFO.phone} | Generated: ${generatedOn}`;
      doc.text(contactText, pageWidth - 12, 11, { align: "right" });

      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.5);
      doc.line(12, 23, pageWidth - 12, 23);

      // Banner Box
      const bannerY = 26;
      const bannerHeight = 24;

      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(12, bannerY, pageWidth - 24, bannerHeight, 3, 3, "FD");

      doc.setFillColor(43, 82, 245);
      doc.roundedRect(12, bannerY, 3, bannerHeight, 1.5, 1.5, "F");

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text(reportTitle, 20, bannerY + 7);

      doc.setFontSize(7.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(71, 85, 105);

      doc.text(`Staff / Department: `, 20, bannerY + 13);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text(`${selectedStaff} (${selectedDept})`, 46, bannerY + 13);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(71, 85, 105);
      doc.text(`Filter Applied: `, 20, bannerY + 18.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text(`${filterText}`, 40, bannerY + 18.5);

      const totalRecords = data.taskList.length;
      doc.setFillColor(238, 242, 255);
      doc.roundedRect(pageWidth - 52, bannerY + 3.5, 36, 17, 2, 2, "F");

      doc.setFontSize(6);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(43, 82, 245);
      doc.text("TOTAL RECORDS", pageWidth - 34, bannerY + 8.5, {
        align: "center",
      });

      doc.setFontSize(9.5);
      doc.text(`${totalRecords}`, pageWidth - 34, bannerY + 15, {
        align: "center",
      });

      // Footer
      doc.setDrawColor(226, 232, 240);
      doc.line(12, pageHeight - 12, pageWidth - 12, pageHeight - 12);

      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(148, 163, 184);
      doc.text(`CONFIDENTIAL - ${COMPANY_INFO.name}`, 12, pageHeight - 6);

      let pageStr = `Page ${pageData.pageNumber} of ${totalPagesExp}`;
      doc.text(pageStr, pageWidth - 12, pageHeight - 6, { align: "right" });
    },
  });

  if (typeof doc.putTotalPages === "function") {
    doc.putTotalPages(totalPagesExp);
  }

  doc.save(`Task_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
};

  const RenderNoData = () => (
    <div className="h-[270px] flex flex-col items-center justify-center text-slate-400 gap-2 rounded-xl bg-slate-50/50 border border-dashed border-slate-200">
      <FolderX size={36} className="text-slate-300" />
      <span className="text-xs font-semibold text-slate-500">
        No Data Available For Selected Filters
      </span>
    </div>
  );

  if (loading) {
    return (
      <div
        className="min-h-[550px] flex flex-col items-center justify-center gap-4"
        style={{ background: THEME.pageBg }}
      >
        <Loader2 className="animate-spin text-[#2B52F5]" size={40} />
        <p className="text-sm font-bold tracking-widest uppercase text-[#2B52F5]">
          Loading Analytics...
        </p>
      </div>
    );
  }

  const { summary, taskStatusSplit, staffProgress, taskList } = data;

  const summaryCards = [
    {
      label: "Total Tasks",
      value: summary?.totalTasks || 0,
      icon: Inbox,
      badgeBg: "#EEF2FF",
      badgeColor: "#2B52F5",
    },
    {
      label: "Completed",
      value: summary?.completedTasks || 0,
      icon: CheckCircle2,
      badgeBg: "#E6F4EA",
      badgeColor: "#137333",
    },
    {
      label: "Pending",
      value: summary?.pendingTasks || 0,
      icon: Clock,
      badgeBg: "#FEF7E0",
      badgeColor: "#B06000",
    },
    {
      label: "In Progress",
      value: summary?.inProgressTasks || 0,
      icon: Timer,
      badgeBg: "#E0F2FE",
      badgeColor: "#0284C7",
    },
    {
      label: "Completion Rate",
      value: `${summary?.completionPercentage || 0}%`,
      icon: Percent,
      badgeBg: "#E0F7FA",
      badgeColor: "#00B5FF",
    },
  ];

  const cardStyle =
    "rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300";

  return (
    <div className="space-y-6 p-1 min-h-screen">
      <PageHeader
        title="Reports & Analytics"
        subtitle="Real-time task breakdown & staff performance metrics"
      />

      {/* Top Export Banner with Vibrant Electric Blue Gradient */}
      <div
        className="rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl"
        style={{
          background: `linear-gradient(135deg, ${THEME.bannerFrom} 0%, ${THEME.bannerTo} 100%)`,
        }}
      >
        <div>
          <h3 className="text-white text-xl font-black tracking-tight">
            Overview & Export Reports
          </h3>
          <p className="text-blue-100 text-xs sm:text-sm mt-1">
            Filter by date, department or employee to generate specific reports
            with official branding.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadExcel}
            disabled={!hasDataAvailable}
            className={`flex items-center gap-2 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all shadow-md ${hasDataAvailable ? "bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer" : "bg-emerald-300 text-emerald-100 cursor-not-allowed opacity-60"}`}
          >
            <FileSpreadsheet size={18} /> Excel Export
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={!hasDataAvailable}
            className={`flex items-center gap-2 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all shadow-md ${hasDataAvailable ? "bg-white text-[#2B52F5] hover:bg-blue-50 cursor-pointer" : "bg-slate-200 text-slate-400 cursor-not-allowed opacity-60"}`}
          >
            <FileText
              size={18}
              className={hasDataAvailable ? "text-[#2B52F5]" : "text-slate-400"}
            />{" "}
            PDF Export
          </button>
        </div>
      </div>

      {/* Filter Options */}
      <div className={`${cardStyle} p-5`}>
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
            <Filter size={18} className="text-[#2B52F5]" />
            <span>Filter Employee & Performance Data</span>
          </div>
          {!hasDataAvailable && (
            <div className="flex items-center gap-1.5 text-amber-700 bg-amber-50 border border-amber-200 text-xs px-3 py-1 rounded-lg font-bold">
              <AlertCircle size={14} /> No records match filters
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-600 flex items-center gap-1">
              <Calendar size={13} /> From Date
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-[#2B52F5]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-600 flex items-center gap-1">
              <Calendar size={13} /> To Date
            </label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-[#2B52F5]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-600 flex items-center gap-1">
              <User size={13} /> Department
            </label>
            <select
              value={selectedDept}
              onChange={(e) => handleDepartmentChange(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:border-[#2B52F5] cursor-pointer"
            >
              {departmentsList.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-600 flex items-center gap-1">
              <User size={13} /> Staff Member
            </label>
            <select
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:border-[#2B52F5] cursor-pointer"
            >
              {availableStaffOptions.map((staff) => (
                <option key={staff} value={staff}>
                  {staff}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {summaryCards.map((s) => (
          <div key={s.label} className={`${cardStyle} p-5`}>
            <div
              className="p-2.5 w-fit rounded-xl mb-3 shadow-inner"
              style={{ background: s.badgeBg, color: s.badgeColor }}
            >
              <s.icon size={20} />
            </div>
            <p className="text-2xl font-black text-slate-900 tracking-tight">
              {s.value}
            </p>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Dynamic Gradient Charts Matching Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart: Task Status Split */}
        <div className={`${cardStyle} p-6`}>
          <h3 className="font-bold text-slate-800 text-base mb-4 border-b border-slate-100 pb-2">
            Task Status Distribution
          </h3>
          {!hasDataAvailable ? (
            <RenderNoData />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={taskStatusSplit}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={5}
                  cornerRadius={8}
                >
                  {taskStatusSplit?.map((e, i) => (
                    <Cell
                      key={i}
                      fill={
                        ELECTRIC_BLUE_PALETTE[i % ELECTRIC_BLUE_PALETTE.length]
                      }
                    />
                  ))}
                </Pie>
                <Legend
                  wrapperStyle={{
                    fontSize: "12px",
                    fontWeight: 700,
                    paddingTop: "10px",
                  }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "10px",
                    borderColor: "#CBD5E1",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Bar Chart with Sidebar Gradient Themes (#2B52F5 -> #00B5FF) */}
        <div className={`${cardStyle} p-6`}>
          <h3 className="font-bold text-slate-800 text-base mb-4 border-b border-slate-100 pb-2">
            Staff Workload & Performance
          </h3>
          {staffLoading ? (
            <div className="h-[280px] flex items-center justify-center">
              <Loader2 className="animate-spin text-[#2B52F5]" size={28} />
            </div>
          ) : !staffProgress || staffProgress.length === 0 ? (
            <RenderNoData />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={staffProgress} margin={{ left: -15 }}>
                {/* SVG Gradients for Bar Chart Bars */}
                <defs>
                  {/* Primary Gradient: Royal Blue to Bright Cyan (Matching Sidebar) */}
                  <linearGradient
                    id="sidebarGradient1"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#2B52F5" stopOpacity={1} />
                    <stop
                      offset="100%"
                      stopColor="#00B5FF"
                      stopOpacity={0.85}
                    />
                  </linearGradient>

                  {/* Secondary Gradient: Cyan to Soft Sky Blue */}
                  <linearGradient
                    id="sidebarGradient2"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#0284C7" stopOpacity={1} />
                    <stop offset="100%" stopColor="#38BDF8" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fontWeight: 600, fill: "#475569" }}
                />
                <YAxis
                  tick={{ fontSize: 11, fontWeight: 600, fill: "#475569" }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "10px",
                    borderColor: "#CBD5E1",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", fontWeight: 700 }} />
                <Bar
                  dataKey="totalAssigned"
                  fill="url(#sidebarGradient1)"
                  name="Total Tasks"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="completed"
                  fill="url(#sidebarGradient2)"
                  name="Completed"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Detailed Tasks Table */}
      <div className={`${cardStyle} p-6`}>
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <h3 className="font-bold text-slate-800 text-base">
            Detailed Task Records
          </h3>
          <span className="text-xs font-bold px-3 py-1 bg-blue-50 text-[#2B52F5] rounded-lg">
            Total: {taskList?.length || 0}
          </span>
        </div>

        {!hasDataAvailable ? (
          <RenderNoData />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 text-xs uppercase font-bold border-b border-slate-200">
                  <th className="p-3">Task ID</th>
                  <th className="p-3">Assigned Staff</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Client / Party</th>
                  <th className="p-3">Software / Type</th>
                  <th className="p-3">Installation</th>
                  <th className="p-3">Assigned Date</th>
                  <th className="p-3">Due Date</th>
                  <th className="p-3">Progress Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {taskList.map((t, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="p-3 font-bold text-[#2B52F5]">{t.taskId}</td>
                    <td className="p-3 font-semibold text-slate-900">
                      {t.assignedStaffName}
                    </td>
                    <td className="p-3 capitalize text-slate-500">
                      {t.assignedStaffDept}
                    </td>
                    <td className="p-3 font-semibold text-slate-800">
                      {t.clientName}
                    </td>
                    <td className="p-3">{t.softwareType}</td>
                    <td className="p-3">{t.softwareDetails}</td>
                    <td className="p-3">{t.assignedDate}</td>
                    <td className="p-3">{t.dueDate}</td>

                    <td className="p-3">{t.progressDate || t.assignedDate}</td>
                    <td className="p-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          t.status === "Completed"
                            ? "bg-emerald-100 text-emerald-800"
                            : t.status === "Pending"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-red-500">{t.priority}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
