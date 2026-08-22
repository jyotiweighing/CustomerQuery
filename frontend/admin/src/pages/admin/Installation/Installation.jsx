import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Building2,
  HardDrive,
  ArrowRight,
  X,
  MapPin,
  Receipt,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Search,
  Flag,
  Calendar,
  ClipboardList,
  Paperclip,
  MessageSquare,
  History,
  RotateCcw,
  Download,
  Clock,
  AlertTriangle,
  SlidersHorizontal,
  Sparkles,
  Laptop,
  Phone,
  Mail,
  Tag,
  User,
  Pencil,
  Save,
  Loader2,
} from "lucide-react";

import { getStaffList } from "../../../services/admin/staffService";
import {
  createinstall,
  getinstall,
  updateinstall,
} from "../../../services/admin/installService";
import { getTasks } from "../../../services/admin/taskService";
import Swal from "sweetalert2";

const ITEMS_PER_PAGE = 10;
const GLASS_PANEL =
  "bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(15,23,42,0.06)]";
const GLASS_INPUT =
  "bg-white/60 backdrop-blur-md border border-white/70 focus:bg-white/90";
const EDIT_INPUT_CLASS =
  "w-full px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-extrabold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400";

// export default function Installation() {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedDetails, setSelectedDetails] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [priorityFilter, setPriorityFilter] = useState("All");
//   const [staffFilter, setStaffFilter] = useState("All");
//   const [productFilter, setProductFilter] = useState("All");
//   const [dueDateFilter, setDueDateFilter] = useState("");
//   const [assignedDateFilter, setAssignedDateFilter] = useState("");
//   const [staffList, setStaffList] = useState([]);
//   const [installations, setInstallations] = useState([]);
//   const [tasks, setTasks] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [loading, setLoading] = useState(true);
//   const [showFilters, setShowFilters] = useState(false);

//   const initialFormState = {
//     poNumber: "",
//     billNumber: "",
//     billDate: "",
//     partyName: "",
//     address: "",
//     location: "",
//     contactPerson: "",
//     mobileNo: "",
//     alternateNo: "",
//     email: "",
//     amount: "",
//     installationDate: "",
//     softwareDetails: "",
//     softwareType: "Desktop",
//     assignedStaff: null,
//     salesPersonName: "",
//     status: "Pending",
//   priority: "Medium",
//   };

//   const [formData, setFormData] = useState(initialFormState);

//   useEffect(() => {
//     fetchAll();
//   }, []);

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [
//     searchTerm,
//     statusFilter,
//     priorityFilter,
//     staffFilter,
//     productFilter,
//     dueDateFilter,
//     assignedDateFilter,
//   ]);

//   const fetchAll = async () => {
//     setLoading(true);
//     await Promise.all([fetchStaff(), fetchInstallations(), fetchTasks()]);
//     setLoading(false);
//   };

//   const fetchStaff = async () => {
//     try {
//       const response = await getStaffList();
//       if (response?.success) {
//         setStaffList(response.staff || []);
//       } else if (Array.isArray(response)) {
//         setStaffList(response);
//       }
//     } catch (error) {
//       console.error("Error fetching staff:", error);
//     }
//   };

//   const fetchInstallations = async () => {
//     try {
//       const response = await getinstall();
//       if (response?.success) {
//         setInstallations(response.data || response.installations || []);
//       } else if (Array.isArray(response)) {
//         setInstallations(response);
//       }
//     } catch (error) {
//       console.error("Error fetching installations:", error);
//     }
//   };

//   const fetchTasks = async () => {
//     try {
//       const response = await getTasks();
//       if (response?.success) {
//         setTasks(response.data || response.tasks || []);
//       } else if (Array.isArray(response)) {
//         setTasks(response);
//       }
//     } catch (error) {
//       console.error("Error fetching tasks:", error);
//     }
//   };

//   const tasksByInstallation = useMemo(() => {
//     const map = {};
//     tasks.forEach((t) => {
//       const key = String(t.installationId || "");
//       if (!key) return;
//       const existing = map[key];
//       if (
//         !existing ||
//         new Date(t.updatedAt || 0).getTime() >
//           new Date(existing.updatedAt || 0).getTime()
//       ) {
//         map[key] = t;
//       }
//     });
//     return map;
//   }, [tasks]);

//   const getTaskFor = (installation) =>
//     tasksByInstallation[String(installation._id)] || null;

//   // Unique product/software names for the Product filter dropdown.
//   const uniqueProducts = useMemo(() => {
//     const set = new Set(
//       installations
//         .map((i) => (i.softwareDetails || "").trim())
//         .filter(Boolean),
//     );
//     return Array.from(set).sort((a, b) => a.localeCompare(b));
//   }, [installations]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleStaffSelect = (e) => {
//     const selectedId = e.target.value;
//     const selectedStaffObj = staffList.find((s) => s._id === selectedId);

//     if (selectedStaffObj) {
//       setFormData({
//         ...formData,
//         assignedStaff: {
//           staffId: selectedStaffObj._id,
//           fullName: selectedStaffObj.fullName || selectedStaffObj.name,
//           phone: selectedStaffObj.phone || selectedStaffObj.mobile || "",
//           email: selectedStaffObj.email || "",
//           designation:
//             selectedStaffObj.designation || selectedStaffObj.role || "",
//         },
//       });
//     } else {
//       setFormData({ ...formData, assignedStaff: null });
//     }
//   };

//   // On create: BILL NO, BILL DATE, INSTALLATION DATE, ASSIGN STAFF and
//   // SALES PERSON NAME are optional. We strip empty-string values (and a
//   // null assignedStaff) so the backend only receives fields that were
//   // actually filled in — these can be added later from the Edit modal.
//   const buildCreatePayload = (data) => {
//     const payload = { ...data };
//     ["billNumber", "billDate", "installationDate", "salesPersonName"].forEach(
//       (key) => {
//         if (!payload[key]) delete payload[key];
//       },
//     );
//     if (!payload.assignedStaff || !payload.assignedStaff.staffId) {
//       delete payload.assignedStaff;
//     }
//     return payload;
//   };

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   try {
//   //     const payload = buildCreatePayload(formData);
//   //     const response = await createinstall(payload);
//   //     if (response?.success) {
//   //       await fetchInstallations();
//   //       setIsModalOpen(false);
//   //       setFormData(initialFormState);
//   //       setCurrentPage(1);
//   //     } else {
//   //       console.error(
//   //         "Create failed:",
//   //         response?.message || response?.error || response,
//   //       );
//   //     }
//   //   } catch (error) {
//   //     console.error("Error saving installation:", error);
//   //   }
//   // };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const payload = buildCreatePayload(formData);
//       const response = await createinstall(payload);
//       if (response?.success) {
//         setIsModalOpen(false);
//         setFormData(initialFormState);

//         // Page ko refresh karne ke liye:
//         window.location.reload();
//       } else {
//         console.error(
//           "Create failed:",
//           response?.message || response?.error || response,
//         );
//       }
//     } catch (error) {
//       console.error("Error saving installation:", error);
//     }
//   };

//   // On edit: an empty Date/Number string ("") sent to the backend makes
//   // Mongoose throw a CastError, which fails the whole update. Strip those
//   // out instead of sending empty strings for date/number fields.
//   const buildUpdatePayload = (data) => {
//     const payload = { ...data };
//     ["billDate", "installationDate"].forEach((key) => {
//       if (payload[key] === "") delete payload[key];
//     });
//     if (payload.amount === "") delete payload.amount;
//     if (!payload.assignedStaff || !payload.assignedStaff.staffId) {
//       delete payload.assignedStaff;
//     }
//     return payload;
//   };

//   // Used by the details modal's "Edit" mode to save changes to an
//   // installation. Assumes `updateinstall(id, data)` exists in
//   // services/admin/installService (same shape as createinstall).
//   const handleUpdateInstallation = async (id, updatedData) => {
//     try {
//       const payload = buildUpdatePayload(updatedData);
//       const response = await updateinstall(id, payload);
//       // IMPORTANT: only treat this as success when the backend explicitly
//       // says so. `response?.success || response` used to be true for ANY
//       // truthy response object — including `{ success: false, ... }` — so
//       // failed updates (e.g. a validation/cast error) silently looked like
//       // they worked in the UI while nothing was actually saved.
//       if (response?.success) {
//         await fetchInstallations();
//         const updatedItem = response?.data ||
//           response?.installation || { ...payload, _id: id };
//         setSelectedDetails(updatedItem);
//         return true;
//       }
//       console.error(
//         "Update failed:",
//         response?.message || response?.error || response,
//       );
//       return false;
//     } catch (error) {
//       console.error("Error updating installation:", error);
//       return false;
//     }
//   };

//   const getStaffDetails = (staff) => {
//     if (!staff)
//       return {
//         name: "Not Assigned",
//         designation: "TECHNICAL",
//         phone: null,
//         email: null,
//       };

//     if (typeof staff === "object" && (staff.fullName || staff.name)) {
//       return {
//         name: staff.fullName || staff.name,
//         designation: staff.designation || staff.role || "SUPPORT AGENT",
//         phone: staff.phone || staff.mobile || null,
//         email: staff.email || null,
//       };
//     }

//     if (typeof staff === "object" && staff.staffId) {
//       return {
//         name: staff.fullName || "Not Assigned",
//         designation: staff.designation || "SUPPORT AGENT",
//         phone: staff.phone || null,
//         email: staff.email || null,
//       };
//     }

//     return {
//       name: "Not Assigned",
//       designation: "TECHNICAL",
//       phone: null,
//       email: null,
//     };
//   };

//   // Helper function to format date cleanly
//   const formatDate = (dateStr) => {
//     if (!dateStr) return "-";
//     try {
//       const d = new Date(dateStr);
//       if (Number.isNaN(d.getTime())) return dateStr.split?.("T")[0] || "-";
//       return d.toLocaleDateString("en-IN", {
//         day: "2-digit",
//         month: "short",
//         year: "numeric",
//       });
//     } catch {
//       return dateStr;
//     }
//   };

//   const isOverdue = (dueDate, taskStatus) => {
//     if (!dueDate) return false;
//     if (taskStatus === "Completed" || taskStatus === "Done") return false;
//     return new Date(dueDate).getTime() < Date.now();
//   };

//   // Newest-first ordering. Prefers createdAt/installationDate timestamps;
//   // falls back to comparing Mongo ObjectId strings (their first bytes encode
//   // creation time, so they sort chronologically) if no timestamp is present.
//   const sortedInstallations = [...installations].sort((a, b) => {
//     const aTime = new Date(a.createdAt || a.installationDate || 0).getTime();
//     const bTime = new Date(b.createdAt || b.installationDate || 0).getTime();
//     if (aTime !== bTime && !Number.isNaN(aTime) && !Number.isNaN(bTime)) {
//       return bTime - aTime;
//     }
//     if (a._id && b._id) return b._id.localeCompare(a._id);
//     return 0;
//   });

//   const filteredData = sortedInstallations.filter((item) => {
//     const task = getTaskFor(item);

//     const term = searchTerm.trim().toLowerCase();
//     const matchesSearch =
//       !term ||
//       String(item.partyName || "")
//         .toLowerCase()
//         .includes(term) ||
//       String(item.poNumber || "")
//         .toLowerCase()
//         .includes(term) ||
//       String(item.softwareDetails || "")
//         .toLowerCase()
//         .includes(term);

//     const matchesStatus =
//       statusFilter === "All" || item.status === statusFilter;

//     const matchesPriority =
//       priorityFilter === "All" || (task?.priority || "—") === priorityFilter;

//     const staffId = item.assignedStaff?.staffId || task?.assignedStaff?.staffId;
//     const matchesStaff = staffFilter === "All" || staffId === staffFilter;

//     const matchesProduct =
//       productFilter === "All" || item.softwareDetails === productFilter;

//     const dueDate = task?.dueDate || item.installationDate;
//     const matchesDueDate =
//       !dueDateFilter ||
//       (dueDate && new Date(dueDate) <= new Date(dueDateFilter + "T23:59:59"));

//     const assignedDate = task?.createdAt || item.installationDate;
//     const matchesAssignedDate =
//       !assignedDateFilter ||
//       (assignedDate &&
//         new Date(assignedDate) <= new Date(assignedDateFilter + "T23:59:59"));

//     return (
//       matchesSearch &&
//       matchesStatus &&
//       matchesPriority &&
//       matchesStaff &&
//       matchesProduct &&
//       matchesDueDate &&
//       matchesAssignedDate
//     );
//   });

//   const totalPages = Math.max(
//     1,
//     Math.ceil(filteredData.length / ITEMS_PER_PAGE),
//   );
//   const safePage = Math.min(currentPage, totalPages);
//   const paginatedData = filteredData.slice(
//     (safePage - 1) * ITEMS_PER_PAGE,
//     safePage * ITEMS_PER_PAGE,
//   );

//   const goToPage = (page) => {
//     const clamped = Math.min(Math.max(1, page), totalPages);
//     setCurrentPage(clamped);
//   };

//   const resetFilters = () => {
//     setSearchTerm("");
//     setStatusFilter("All");
//     setPriorityFilter("All");
//     setStaffFilter("All");
//     setProductFilter("All");
//     setDueDateFilter("");
//     setAssignedDateFilter("");
//   };

//   const hasActiveFilters =
//     searchTerm ||
//     statusFilter !== "All" ||
//     priorityFilter !== "All" ||
//     staffFilter !== "All" ||
//     productFilter !== "All" ||
//     dueDateFilter ||
//     assignedDateFilter;

//   const activeFilterCount = [
//     statusFilter !== "All",
//     priorityFilter !== "All",
//     staffFilter !== "All",
//     productFilter !== "All",
//     !!dueDateFilter,
//     !!assignedDateFilter,
//   ].filter(Boolean).length;

//   const statusStyles = {
//     pending:
//       "bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-600 border-amber-200",
//     active:
//       "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-600 border-emerald-200",
//     completed:
//       "bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-600 border-blue-200",
//   };
//   const getStatusClasses = (status) =>
//     statusStyles[status?.toLowerCase()] ||
//     "bg-slate-50 text-slate-600 border-slate-200";

//   const taskStatusStyles = {
//     pending:
//       "bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-600 border-amber-200",
//     "in progress":
//       "bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-600 border-blue-200",
//     "in-progress":
//       "bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-600 border-blue-200",
//     completed:
//       "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-600 border-emerald-200",
//     done: "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-600 border-emerald-200",
//     blocked:
//       "bg-gradient-to-r from-rose-50 to-red-50 text-rose-600 border-rose-200",
//   };
//   const getTaskStatusClasses = (status) =>
//     taskStatusStyles[status?.toLowerCase()] ||
//     "bg-slate-50 text-slate-600 border-slate-200";

//   const priorityStyles = {
//     low: "bg-slate-50 text-slate-500 border-slate-200",
//     medium:
//       "bg-gradient-to-r from-amber-50 to-orange-50 text-amber-600 border-amber-200",
//     high: "bg-gradient-to-r from-rose-50 to-red-50 text-rose-600 border-rose-200",
//   };
//   const getPriorityClasses = (priority) =>
//     priorityStyles[priority?.toLowerCase()] ||
//     "bg-slate-50 text-slate-500 border-slate-200";

export default function Installation() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [staffFilter, setStaffFilter] = useState("All");
  const [productFilter, setProductFilter] = useState("All");
  const [dueDateFilter, setDueDateFilter] = useState("");
  const [assignedDateFilter, setAssignedDateFilter] = useState("");
  const [staffList, setStaffList] = useState([]);
  const [installations, setInstallations] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

const ITEMS_PER_PAGE = 10;

  const initialFormState = {
    poNumber: "",
    billNumber: "",
    billDate: "",
    partyName: "",
    address: "",
    location: "",
    contactPerson: "",
    mobileNo: "",
    alternateNo: "",
    email: "",
    amount: "",
    installationDate: "",
    softwareDetails: "",
    softwareType: "Desktop",
    assignedStaff: null,
    salesPersonName: "",
    status: "Pending",
    priority: "Medium",
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    statusFilter,
    priorityFilter,
    staffFilter,
    productFilter,
    dueDateFilter,
    assignedDateFilter,
  ]);

  const fetchAll = async () => {
    setLoading(true);
    await Promise.all([fetchStaff(), fetchInstallations(), fetchTasks()]);
    setLoading(false);
  };

  const fetchStaff = async () => {
    try {
      const response = await getStaffList();
      if (response?.success) {
        setStaffList(response.staff || []);
      } else if (Array.isArray(response)) {
        setStaffList(response);
      }
    } catch (error) {
      console.error("Error fetching staff:", error);
    }
  };

  const fetchInstallations = async () => {
    try {
      const response = await getinstall();
      if (response?.success) {
        setInstallations(response.data || response.installations || []);
      } else if (Array.isArray(response)) {
        setInstallations(response);
      }
    } catch (error) {
      console.error("Error fetching installations:", error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await getTasks();
      if (response?.success) {
        setTasks(response.data || response.tasks || []);
      } else if (Array.isArray(response)) {
        setTasks(response);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const tasksByInstallation = useMemo(() => {
    const map = {};
    tasks.forEach((t) => {
      const key = String(t.installationId || "");
      if (!key) return;
      const existing = map[key];
      if (
        !existing ||
        new Date(t.updatedAt || 0).getTime() >
          new Date(existing.updatedAt || 0).getTime()
      ) {
        map[key] = t;
      }
    });
    return map;
  }, [tasks]);

  const getTaskFor = (installation) =>
    tasksByInstallation[String(installation._id)] || null;

  const uniqueProducts = useMemo(() => {
    const set = new Set(
      installations
        .map((i) => (i.softwareDetails || "").trim())
        .filter(Boolean)
    );
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [installations]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleStaffSelect = (e) => {
    const selectedId = e.target.value;
    const selectedStaffObj = staffList.find((s) => s._id === selectedId);

    if (selectedStaffObj) {
      setFormData({
        ...formData,
        assignedStaff: {
          staffId: selectedStaffObj._id,
          fullName: selectedStaffObj.fullName || selectedStaffObj.name,
          phone: selectedStaffObj.phone || selectedStaffObj.mobile || "",
          email: selectedStaffObj.email || "",
          designation:
            selectedStaffObj.designation || selectedStaffObj.role || "",
        },
      });
    } else {
      setFormData({ ...formData, assignedStaff: null });
    }
  };

  const buildCreatePayload = (data) => {
    const payload = { ...data };
    ["billNumber", "billDate", "installationDate", "salesPersonName"].forEach(
      (key) => {
        if (!payload[key]) delete payload[key];
      }
    );
    if (!payload.assignedStaff || !payload.assignedStaff.staffId) {
      delete payload.assignedStaff;
    }
    return payload;
  };

  // --------------------------------------------------
  // CREATE INSTALLATION WITH SWEETALERT
  // --------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = buildCreatePayload(formData);
      const response = await createinstall(payload);

      if (response?.success) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Installation created successfully.",
          timer: 1800,
          showConfirmButton: false,
        });

        setIsModalOpen(false);
        setFormData(initialFormState);
        await fetchAll();
      } else {
        const errorMsg =
        response?.error ||
          response?.message ||
          "Could not create installation.";
        Swal.fire({
          icon: "error",
          title: "Creation Failed",
          text: errorMsg,
        });
      }
    } catch (error) {
      console.error("Error saving installation:", error);
      const backendError =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Something went wrong while saving installation.";

      Swal.fire({
        icon: "error",
        title: "Error",
        text: backendError,
      });
    }
  };

  const buildUpdatePayload = (data) => {
    const payload = { ...data };
    ["billDate", "installationDate"].forEach((key) => {
      if (payload[key] === "") delete payload[key];
    });
    if (payload.amount === "") delete payload.amount;
    if (!payload.assignedStaff || !payload.assignedStaff.staffId) {
      delete payload.assignedStaff;
    }
    return payload;
  };

  // --------------------------------------------------
  // UPDATE INSTALLATION WITH SWEETALERT
  // --------------------------------------------------
  const handleUpdateInstallation = async (id, updatedData) => {
    try {
      const payload = buildUpdatePayload(updatedData);
      const response = await updateinstall(id, payload);

      if (response?.success) {
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Installation record updated successfully.",
          timer: 1500,
          showConfirmButton: false,
        });

        await fetchInstallations();
        const updatedItem =
          response?.data ||
          response?.installation || { ...payload, _id: id };
        setSelectedDetails(updatedItem);
        return true;
      }

      const errorMsg =
        response?.message ||
        response?.error ||
        "Could not update installation.";
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: errorMsg,
      });
      return false;
    } catch (error) {
      console.error("Error updating installation:", error);
      const backendError =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Something went wrong while updating.";

      Swal.fire({
        icon: "error",
        title: "Error",
        text: backendError,
      });
      return false;
    }
  };

  const getStaffDetails = (staff) => {
    if (!staff)
      return {
        name: "Not Assigned",
        designation: "TECHNICAL",
        phone: null,
        email: null,
      };

    if (typeof staff === "object" && (staff.fullName || staff.name)) {
      return {
        name: staff.fullName || staff.name,
        designation: staff.designation || staff.role || "SUPPORT AGENT",
        phone: staff.phone || staff.mobile || null,
        email: staff.email || null,
      };
    }

    if (typeof staff === "object" && staff.staffId) {
      return {
        name: staff.fullName || "Not Assigned",
        designation: staff.designation || "SUPPORT AGENT",
        phone: staff.phone || null,
        email: staff.email || null,
      };
    }

    return {
      name: "Not Assigned",
      designation: "TECHNICAL",
      phone: null,
      email: null,
    };
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      if (Number.isNaN(d.getTime())) return dateStr.split?.("T")[0] || "-";
      return d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const isOverdue = (dueDate, taskStatus) => {
    if (!dueDate) return false;
    if (taskStatus === "Completed" || taskStatus === "Done") return false;
    return new Date(dueDate).getTime() < Date.now();
  };

  const sortedInstallations = [...installations].sort((a, b) => {
    const aTime = new Date(a.createdAt || a.installationDate || 0).getTime();
    const bTime = new Date(b.createdAt || b.installationDate || 0).getTime();
    if (aTime !== bTime && !Number.isNaN(aTime) && !Number.isNaN(bTime)) {
      return bTime - aTime;
    }
    if (a._id && b._id) return b._id.localeCompare(a._id);
    return 0;
  });

  const filteredData = sortedInstallations.filter((item) => {
    const task = getTaskFor(item);

    const term = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !term ||
      String(item.partyName || "")
        .toLowerCase()
        .includes(term) ||
      String(item.poNumber || "")
        .toLowerCase()
        .includes(term) ||
      String(item.softwareDetails || "")
        .toLowerCase()
        .includes(term);

    const matchesStatus =
      statusFilter === "All" || item.status === statusFilter;

    const matchesPriority =
      priorityFilter === "All" || (task?.priority || "—") === priorityFilter;

    const staffId = item.assignedStaff?.staffId || task?.assignedStaff?.staffId;
    const matchesStaff = staffFilter === "All" || staffId === staffFilter;

    const matchesProduct =
      productFilter === "All" || item.softwareDetails === productFilter;

    const dueDate = task?.dueDate || item.installationDate;
    const matchesDueDate =
      !dueDateFilter ||
      (dueDate && new Date(dueDate) <= new Date(dueDateFilter + "T23:59:59"));

    const assignedDate = task?.createdAt || item.installationDate;
    const matchesAssignedDate =
      !assignedDateFilter ||
      (assignedDate &&
        new Date(assignedDate) <= new Date(assignedDateFilter + "T23:59:59"));

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority &&
      matchesStaff &&
      matchesProduct &&
      matchesDueDate &&
      matchesAssignedDate
    );
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredData.length / ITEMS_PER_PAGE)
  );
  const safePage = Math.min(currentPage, totalPages);
  const paginatedData = filteredData.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  const goToPage = (page) => {
    const clamped = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(clamped);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setPriorityFilter("All");
    setStaffFilter("All");
    setProductFilter("All");
    setDueDateFilter("");
    setAssignedDateFilter("");
  };

  const hasActiveFilters =
    searchTerm ||
    statusFilter !== "All" ||
    priorityFilter !== "All" ||
    staffFilter !== "All" ||
    productFilter !== "All" ||
    dueDateFilter ||
    assignedDateFilter;

  const activeFilterCount = [
    statusFilter !== "All",
    priorityFilter !== "All",
    staffFilter !== "All",
    productFilter !== "All",
    !!dueDateFilter,
    !!assignedDateFilter,
  ].filter(Boolean).length;

  const statusStyles = {
    pending:
      "bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-600 border-amber-200",
    active:
      "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-600 border-emerald-200",
    completed:
      "bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-600 border-blue-200",
  };
  const getStatusClasses = (status) =>
    statusStyles[status?.toLowerCase()] ||
    "bg-slate-50 text-slate-600 border-slate-200";

  const taskStatusStyles = {
    pending:
      "bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-600 border-amber-200",
    "in progress":
      "bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-600 border-blue-200",
    "in-progress":
      "bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-600 border-blue-200",
    completed:
      "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-600 border-emerald-200",
    done:
      "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-600 border-emerald-200",
    blocked:
      "bg-gradient-to-r from-rose-50 to-red-50 text-rose-600 border-rose-200",
  };
  const getTaskStatusClasses = (status) =>
    taskStatusStyles[status?.toLowerCase()] ||
    "bg-slate-50 text-slate-600 border-slate-200";

  const priorityStyles = {
    low: "bg-slate-50 text-slate-500 border-slate-200",
    medium:
      "bg-gradient-to-r from-amber-50 to-orange-50 text-amber-600 border-amber-200",
    high:
      "bg-gradient-to-r from-rose-50 to-red-50 text-rose-600 border-rose-200",
  };
  const getPriorityClasses = (priority) =>
    priorityStyles[priority?.toLowerCase()] ||
    "bg-slate-50 text-slate-500 border-slate-200";

  return (
    <div className="relative min-h-screen text-slate-800 font-sans overflow-hidden">
      {/* Ambient gradient background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-50 via-blue-50/40 to-cyan-50/30" />
      <div className="fixed -top-40 -left-32 w-[28rem] h-[28rem] bg-gradient-to-br from-cyan-300/30 to-blue-400/20 rounded-full blur-3xl -z-10" />
      <div className="fixed top-1/3 -right-40 w-[26rem] h-[26rem] bg-gradient-to-br from-blue-300/20 to-indigo-300/20 rounded-full blur-3xl -z-10" />
      <div className="fixed bottom-0 left-1/3 w-[24rem] h-[24rem] bg-gradient-to-br from-emerald-200/20 to-cyan-200/20 rounded-full blur-3xl -z-10" />

      <div className="p-6 md:p-1">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 bg-clip-text text-transparent">
              Installations
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Organize your software setups, party orders, and staff assignments
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-5 py-2.5 rounded-2xl shadow-lg shadow-blue-500/25 text-sm transition-all duration-200 active:scale-95 ring-1 ring-white/40"
            >
              <Plus className="w-4 h-4 stroke-[3]" /> Add Installation
            </button>
          </div>
        </div>

        {/* Search + Filter Toolbar (glass) */}
        <div className={`${GLASS_PANEL} rounded-[24px] p-4 mb-6`}>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search party, PO, software..."
                className={`w-full pl-9 pr-4 py-2.5 ${GLASS_INPUT} rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors`}
              />
            </div>
            <button
              onClick={() => setShowFilters((v) => !v)}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all shrink-0 ${
                showFilters
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 border-transparent text-white shadow-md shadow-blue-500/20"
                  : `${GLASS_INPUT} text-slate-600 hover:bg-white/90`
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filters
              {activeFilterCount > 0 && (
                <span
                  className={`w-4.5 h-4.5 flex items-center justify-center rounded-full text-[10px] font-extrabold ${
                    showFilters
                      ? "bg-white/90 text-blue-600"
                      : "bg-blue-600 text-white"
                  }`}
                >
                  {activeFilterCount}
                </span>
              )}
            </button>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-white/60 transition-colors shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            )}
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 mt-4 pt-4 border-t border-white/60">
              <div>
                <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={`w-full px-3 py-2 ${GLASS_INPUT} rounded-xl text-xs font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer`}
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Active">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">
                  Priority
                </label>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className={`w-full px-3 py-2 ${GLASS_INPUT} rounded-xl text-xs font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer`}
                >
                  <option value="All">All Priority</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">
                  Staff
                </label>
                <select
                  value={staffFilter}
                  onChange={(e) => setStaffFilter(e.target.value)}
                  className={`w-full px-3 py-2 ${GLASS_INPUT} rounded-xl text-xs font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer`}
                >
                  <option value="All">All Staff</option>
                  {staffList.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.fullName || s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">
                  Product
                </label>
                <select
                  value={productFilter}
                  onChange={(e) => setProductFilter(e.target.value)}
                  className={`w-full px-3 py-2 ${GLASS_INPUT} rounded-xl text-xs font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer`}
                >
                  <option value="All">All Products</option>
                  {uniqueProducts.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">
                  Due On / Before
                </label>
                <input
                  type="date"
                  value={dueDateFilter}
                  onChange={(e) => setDueDateFilter(e.target.value)}
                  className={`w-full px-3 py-2 ${GLASS_INPUT} rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400`}
                />
              </div>

              <div>
                <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">
                  Assigned On / Before
                </label>
                <input
                  type="date"
                  value={assignedDateFilter}
                  onChange={(e) => setAssignedDateFilter(e.target.value)}
                  className={`w-full px-3 py-2 ${GLASS_INPUT} rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400`}
                />
              </div>
            </div>
          )}
        </div>

        {/* Table Display (glass) */}
        <div className={`${GLASS_PANEL} rounded-[28px] overflow-hidden`}>
          <div className="overflow-x-auto [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300/60 [&::-webkit-scrollbar-thumb]:rounded-full">
            <table className="w-full text-left border-collapse min-w-[980px]">
              <thead>
                <tr className="bg-gradient-to-r from-slate-50/80 via-blue-50/50 to-slate-50/80 border-b border-white/70">
                  <th className="px-6 py-3.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    Party
                  </th>
                  <th className="px-4 py-3.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    Assigned Staff
                  </th>
                  <th className="px-4 py-3.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-4 py-3.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    Assigned Date
                  </th>
                  <th className="px-4 py-3.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-4 py-3.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-4 py-3.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider text-right">
                    Amount
                  </th>
                  <th className="px-4 py-3.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-16 text-slate-400 text-sm font-medium"
                    >
                      Loading installations...
                    </td>
                  </tr>
                )}

                {!loading &&
                  paginatedData.map((item) => {
                    const staffInfo = getStaffDetails(item.assignedStaff);
                    const task = getTaskFor(item);
                    const overdue = isOverdue(task?.dueDate, task?.status);
                    const progressDate = task?.progressDate || task?.updatedAt;
                    const assignedDate = task?.createdAt || task?.createdAt;
                    return (
                      <tr
                        key={item._id}
                        onClick={() => setSelectedDetails(item)}
                        className="border-b border-white/70 last:border-b-0 hover:bg-gradient-to-r hover:from-blue-50/60 hover:to-cyan-50/40 cursor-pointer transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white flex items-center justify-center  shrink-0 shadow-sm">
                              <Building2 className="w-4.5 h-4.5" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-900 text-sm truncate max-w-[160px]">
                                {item.partyName || "-"}
                              </p>
                              <p className="text-[10px] font-semibold text-slate-400 truncate max-w-[160px] flex items-center gap-1">
                                <HardDrive className="w-2.5 h-2.5" />
                                {item.softwareDetails || "N/A"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-xs font-bold text-slate-700 truncate max-w-[140px] block">
                            {staffInfo.name}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                            {staffInfo.designation}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          {task?.priority ? (
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${getPriorityClasses(
                                task.priority,
                              )}`}
                            >
                              <Flag className="w-3 h-3" /> {task.priority}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-300 font-semibold">
                              —
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          {progressDate ? (
                            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                              <History className="w-3.5 h-3.5 text-slate-400" />
                              {formatDate(assignedDate)}
                            </div>
                          ) : (
                            <span className="text-xs text-slate-300 font-semibold">
                              —
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          {task?.dueDate ? (
                            <div
                              className={`flex items-center gap-1.5 text-xs font-semibold ${
                                overdue ? "text-rose-600" : "text-slate-600"
                              }`}
                            >
                              {overdue ? (
                                <AlertTriangle className="w-3.5 h-3.5" />
                              ) : (
                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              )}
                              {formatDate(task.dueDate)}
                            </div>
                          ) : (
                            <span className="text-xs text-slate-300 font-semibold">
                              —
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          {progressDate ? (
                            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                              <History className="w-3.5 h-3.5 text-slate-400" />
                              {formatDate(progressDate)}
                            </div>
                          ) : (
                            <span className="text-xs text-slate-300 font-semibold">
                              —
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-right text-sm font-extrabold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                          ₹{item.amount || "0"}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col gap-1 items-start">
                            {task?.status && (
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${getTaskStatusClasses(
                                  task.status,
                                )}`}
                              >
                                Task: {task.status}
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                {!loading && paginatedData.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-16 text-slate-400 text-sm font-medium"
                    >
                      No installations found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Controls */}
        {filteredData.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
            <p className="text-xs font-semibold text-slate-500">
              Showing{" "}
              <span className="text-slate-800">
                {(safePage - 1) * ITEMS_PER_PAGE + 1}
                {"–"}
                {Math.min(safePage * ITEMS_PER_PAGE, filteredData.length)}
              </span>{" "}
              of <span className="text-slate-800">{filteredData.length}</span>
            </p>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => goToPage(safePage - 1)}
                disabled={safePage === 1}
                className={`w-9 h-9 flex items-center justify-center rounded-xl ${GLASS_INPUT} text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/90 transition-colors`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-bold transition-colors ${
                      page === safePage
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-blue-500/25"
                        : `${GLASS_INPUT} text-slate-600 hover:bg-white/90`
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                onClick={() => goToPage(safePage + 1)}
                disabled={safePage === totalPages}
                className={`w-9 h-9 flex items-center justify-center rounded-xl ${GLASS_INPUT} text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/90 transition-colors`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* VIEW DETAILS POPUP MODAL (shown on row click) */}
        {selectedDetails && (
          <DetailModal
            item={selectedDetails}
            task={getTaskFor(selectedDetails)}
            onClose={() => setSelectedDetails(null)}
            getStaffDetails={getStaffDetails}
            formatDate={formatDate}
            getStatusClasses={getStatusClasses}
            getTaskStatusClasses={getTaskStatusClasses}
            getPriorityClasses={getPriorityClasses}
            isOverdue={isOverdue}
            onUpdate={handleUpdateInstallation}
            staffList={staffList}
          />
        )}

        {/* CREATE INSTALLATION MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
            {/* CSS Utility for hiding scrollbar visually */}
            <style>{`
      .no-scrollbar::-webkit-scrollbar { display: none; }
      .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    `}</style>

            {/* Main Modal Card */}
            <div className="bg-slate-50/90 backdrop-blur-2xl rounded-3xl shadow-2xl w-full max-w-4xl p-5 sm:p-7 border border-white/80 relative overflow-hidden flex flex-col max-h-[92vh]">
              {/* Background Ambient Glows */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

              {/* Header */}
              <div className="text-center mb-4 shrink-0">
                {/* <span className="text-[10px] font-extrabold tracking-widest uppercase text-blue-600 bg-blue-100/80 border border-blue-200 px-3 py-1 rounded-full inline-flex items-center gap-1.5 shadow-sm">
                  <Sparkles className="w-3 h-3 text-blue-500" /> New Entry
                </span> */}
                <h2 className="text-2xl font-black text-slate-900 mt-1.5 tracking-tight">
                  Create Installation Profile
                </h2>
                <p className="text-[11px] text-slate-400 font-semibold mt-1">
                  Bill No, Bill Date, Installation Date, Assigned Staff &amp;
                  Sales Person are optional — add them later from Edit.
                </p>
              </div>

              {/* Form Area - Auto Scrollbar Hidden */}
              <form
                onSubmit={handleSubmit}
                className="overflow-y-auto no-scrollbar space-y-3 pr-0.5"
              >
                {/* Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      PO NUMBER
                    </label>
                    <input
                      required
                      type="text"
                      name="poNumber"
                      value={formData.poNumber}
                      onChange={handleInputChange}
                      placeholder="e.g. PO-9921"
                      className={`w-full px-3 py-2 ${GLASS_INPUT} rounded-xl text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/70 border border-slate-200/80`}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      BILL NO{" "}
                      <span className="text-slate-400 normal-case font-medium">
                        (optional)
                      </span>
                    </label>
                    <input
                      type="text"
                      name="billNumber"
                      value={formData.billNumber}
                      onChange={handleInputChange}
                      placeholder="e.g. INV-1001"
                      className={`w-full px-3 py-2 ${GLASS_INPUT} rounded-xl text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/70 border border-slate-200/80`}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      BILL DATE{" "}
                      <span className="text-slate-400 normal-case font-medium">
                        (optional)
                      </span>
                    </label>
                    <input
                      type="date"
                      name="billDate"
                      value={formData.billDate}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 ${GLASS_INPUT} rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/70 border border-slate-200/80`}
                    />
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      PARTY NAME
                    </label>
                    <input
                      required
                      type="text"
                      name="partyName"
                      value={formData.partyName}
                      onChange={handleInputChange}
                      placeholder="Company Name"
                      className={`w-full px-3 py-2 ${GLASS_INPUT} rounded-xl text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/70 border border-slate-200/80`}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      LOCATION
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="City Name"
                      className={`w-full px-3 py-2 ${GLASS_INPUT} rounded-xl text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/70 border border-slate-200/80`}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      ADDRESS
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Street, Area..."
                      className={`w-full px-3 py-2 ${GLASS_INPUT} rounded-xl text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/70 border border-slate-200/80`}
                    />
                  </div>
                </div>

                {/* Row 3 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      CONTACT PERSON
                    </label>
                    <input
                      type="text"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleInputChange}
                      placeholder="Person Name"
                      className={`w-full px-3 py-2 ${GLASS_INPUT} rounded-xl text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/70 border border-slate-200/80`}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      MOBILE NO
                    </label>
                    <input
                      required
                      type="tel"
                      name="mobileNo"
                      value={formData.mobileNo}
                      onChange={handleInputChange}
                      placeholder="Primary Mobile"
                      className={`w-full px-3 py-2 ${GLASS_INPUT} rounded-xl text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/70 border border-slate-200/80`}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      ALTERNATE NO
                    </label>
                    <input
                      type="tel"
                      name="alternateNo"
                      value={formData.alternateNo}
                      onChange={handleInputChange}
                      placeholder="Secondary Mobile"
                      className={`w-full px-3 py-2 ${GLASS_INPUT} rounded-xl text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/70 border border-slate-200/80`}
                    />
                  </div>
                </div>

                {/* Row 4 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      EMAIL
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="email@domain.com"
                      className={`w-full px-3 py-2 ${GLASS_INPUT} rounded-xl text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/70 border border-slate-200/80`}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      AMOUNT (₹)
                    </label>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      className={`w-full px-3 py-2 ${GLASS_INPUT} rounded-xl text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/70 border border-slate-200/80`}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      INSTALLATION DATE{" "}
                      <span className="text-slate-400 normal-case font-medium">
                        (optional)
                      </span>
                    </label>
                    <input
                      type="date"
                      name="installationDate"
                      value={formData.installationDate}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 ${GLASS_INPUT} rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/70 border border-slate-200/80`}
                    />
                  </div>
                </div>

                {/* Row 5 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      SOFTWARE DETAILS
                    </label>
                    <input
                      type="text"
                      name="softwareDetails"
                      value={formData.softwareDetails}
                      onChange={handleInputChange}
                      placeholder="Software Name/Ver"
                      className={`w-full px-3 py-2 ${GLASS_INPUT} rounded-xl text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/70 border border-slate-200/80`}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      SOFTWARE TYPE
                    </label>
                    <select
                      name="softwareType"
                      value={formData.softwareType}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 ${GLASS_INPUT} rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer bg-white/70 border border-slate-200/80`}
                    >
                      <option value="Desktop">Desktop Application</option>
                      <option value="Web App">Web Application</option>
                      <option value="Cloud ERP">Cloud ERP</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      ASSIGN STAFF{" "}
                      <span className="text-slate-400 normal-case font-medium">
                        (optional)
                      </span>
                    </label>
                    <select
                      name="assignedStaff"
                      value={formData.assignedStaff?.staffId || ""}
                      onChange={handleStaffSelect}
                      className={`w-full px-3 py-2 ${GLASS_INPUT} rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer bg-white/70 border border-slate-200/80`}
                    >
                      <option value="">Select Staff Member</option>
                      {staffList.map((staff) => (
                        <option key={staff._id} value={staff._id}>
                          {staff.fullName || staff.name} (
                          {staff.designation || "Staff"})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>


                {/* Row 6 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
      Priority
    </label>
    <select
      name="priority"
      value={formData.priority}
      onChange={handleInputChange}
      className={`w-full px-3 py-2.5 ${GLASS_INPUT} rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer`}
    >
      <option value="Low">Low</option>
      <option value="Medium">Medium</option>
      <option value="High">High</option>
    </select>
  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      STATUS
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 ${GLASS_INPUT} rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer bg-white/70 border border-slate-200/80`}
                    >
                      <option value="Pending">Active</option>
                      <option value="Pending">InActive</option>
                      {/* <option value="In Progress">In Progress</option> */}
                      {/* <option value="Completed">Completed</option> */}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      SALES PERSON NAME{" "}
                      <span className="text-slate-400 normal-case font-medium">
                        (optional)
                      </span>
                    </label>
                    <input
                      type="text"
                      name="salesPersonName"
                      value={formData.salesPersonName}
                      onChange={handleInputChange}
                      placeholder="Sales Agent Name"
                      className={`w-full px-3 py-2 ${GLASS_INPUT} rounded-xl text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/70 border border-slate-200/80`}
                    />
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="flex justify-end gap-3 pt-3 border-t border-slate-200/60 mt-4 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-xl font-bold text-xs transition-all shadow-sm active:scale-95"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 active:scale-95"
                  >
                    Create Now <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function buildEditState(item) {
  return {
    partyName: item?.partyName || "",
    poNumber: item?.poNumber || "",
    billNumber: item?.billNumber || "",
    billDate: item?.billDate ? String(item.billDate).split("T")[0] : "",
    address: item?.address || "",
    location: item?.location || "",
    contactPerson: item?.contactPerson || "",
    mobileNo: item?.mobileNo || "",
    alternateNo: item?.alternateNo || "",
    email: item?.email || "",
    amount: item?.amount || "",
    installationDate: item?.installationDate
      ? String(item.installationDate).split("T")[0]
      : "",
    softwareDetails: item?.softwareDetails || "",
    softwareType: item?.softwareType || "Desktop",
    assignedStaff: item?.assignedStaff || null,
    salesPersonName: item?.salesPersonName || "",
    status: item?.status || "Pending",
  };
}

function DetailModal({
  item,
  task,
  onClose,
  getStaffDetails,
  formatDate,
  getStatusClasses,
  getTaskStatusClasses,
  getPriorityClasses,
  isOverdue,
  onUpdate,
  staffList = [],
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState(() => buildEditState(item));

  // Keep the edit form in sync whenever a different installation is opened.
  useEffect(() => {
    setEditData(buildEditState(item));
    setIsEditing(false);
  }, [item]);

  if (!item) return null;

  const staffInfo = getStaffDetails(
    isEditing ? editData.assignedStaff : item.assignedStaff,
  );
  const overdue = isOverdue?.(task?.dueDate, task?.status);
  const progressDate = task?.progressDate || task?.updatedAt;
  const expiryDate =item?.expiryDate || "";

  const rawStatusHistory =
    task?.statusHistory || task?.history || task?.statusLogs || [];
  const statusHistory = (
    Array.isArray(rawStatusHistory) && rawStatusHistory.length > 0
      ? rawStatusHistory
      : task?.status
        ? [
            {
              status: task.status,
              date: task?.progressDate || task?.updatedAt || task?.createdAt,
            },
          ]
        : []
  )
    .map((h) => ({
      status: h.status || h.taskStatus || h.stage || "-",
      date: h.date || h.updatedAt || h.changedAt || h.createdAt,
    }))
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditStaffSelect = (e) => {
    const selectedId = e.target.value;
    const selectedStaffObj = staffList.find((s) => s._id === selectedId);
    if (selectedStaffObj) {
      setEditData((prev) => ({
        ...prev,
        assignedStaff: {
          staffId: selectedStaffObj._id,
          fullName: selectedStaffObj.fullName || selectedStaffObj.name,
          phone: selectedStaffObj.phone || selectedStaffObj.mobile || "",
          email: selectedStaffObj.email || "",
          designation:
            selectedStaffObj.designation || selectedStaffObj.role || "",
        },
      }));
    } else {
      setEditData((prev) => ({ ...prev, assignedStaff: null }));
    }
  };

  const handleCancelEdit = () => {
    setEditData(buildEditState(item));
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    if (!onUpdate) {
      setIsEditing(false);
      return;
    }
    setSaving(true);
    const ok = await onUpdate(item._id, editData);
    setSaving(false);
    if (ok) setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      {/* Scrollbar Hide CSS Utility */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Main Container Card - Extended Width (max-w-6xl) */}
      <div className="bg-slate-50/95 backdrop-blur-2xl rounded-3xl shadow-2xl w-full max-w-4xl border border-white/80 relative overflow-hidden flex flex-col">
        {/* Glow Effects */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="px-5 py-3.5 sm:px-6 border-b border-slate-200/80 flex items-center justify-between shrink-0 bg-white/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 shrink-0 shadow-sm">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-4">
                {isEditing ? (
                  <input
                    type="text"
                    name="partyName"
                    value={editData.partyName}
                    onChange={handleEditChange}
                    className={`${EDIT_INPUT_CLASS} text-lg font-extrabold max-w-[220px]`}
                  />
                ) : (
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                    {item.partyName}
                  </h2>
                )}

                {/* Status Badges */}
                {isEditing && (
                  <select
                    name="status"
                    value={editData.status}
                    onChange={handleEditChange}
                    className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider border bg-white text-slate-600 cursor-pointer"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                )}

                {task?.status && (
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider border ${getTaskStatusClasses(task.status)}`}
                  >
                    Task: {task.status}
                  </span>
                )}

                {task?.priority && (
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider border ${getPriorityClasses(task.priority)}`}
                  >
                    <Flag className="w-2.5 h-2.5" /> {task.priority}
                  </span>
                )}
              </div>
              <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                PO No:{" "}
                {isEditing ? (
                  <input
                    type="text"
                    name="poNumber"
                    value={editData.poNumber}
                    onChange={handleEditChange}
                    className={`${EDIT_INPUT_CLASS} inline-block w-28 py-0.5`}
                  />
                ) : (
                  <span className="font-semibold text-slate-700">
                    {item.poNumber || "-"}
                  </span>
                )}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Compact Grid, No Scrollbar */}
        <div className="p-4 sm:p-5 space-y-3.5 no-scrollbar max-h-[70vh] overflow-y-auto">
          {/* Task Timeline: Due Date + Progress Date */}
          {(task?.dueDate || progressDate) && (
            <div className="bg-white/80 rounded-2xl p-3.5 border border-slate-200/80 shadow-sm">
              <div className="flex items-center gap-1.5 text-amber-600 mb-2.5 font-bold text-[10px] uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5" />
                <span>Task Timeline</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    Due Date
                  </p>
                  <p
                    className={`text-xs font-extrabold mt-0.5 flex items-center gap-1 ${overdue ? "text-rose-600" : "text-slate-800"}`}
                  >
                    {overdue ? (
                      <AlertTriangle className="w-3 h-3" />
                    ) : (
                      <Calendar className="w-3 h-3 text-slate-400" />
                    )}
                    {formatDate(task?.dueDate)}
                  </p>
                </div>
                <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    Progress Date
                  </p>
                  <p className="text-xs font-extrabold text-slate-800 mt-0.5 flex items-center gap-1">
                    <History className="w-3 h-3 text-slate-400" />
                    {formatDate(progressDate)}
                  </p>
                </div>
                  <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    Expiry Date
                  </p>
                  <p className="text-xs font-extrabold text-slate-800 mt-0.5 flex items-center gap-1">
                    <History className="w-3 h-3 text-slate-400" />
                    {formatDate(expiryDate)}
                  </p>
                </div>
              </div>

              {/* Status History: date + status trail */}
              {statusHistory.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Status History
                  </p>
                  <div className="space-y-1.5">
                    {statusHistory.map((entry, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-slate-50/80 px-2.5 py-1.5 rounded-lg border border-slate-100"
                      >
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${getTaskStatusClasses(
                            entry.status,
                          )}`}
                        >
                          {entry.status}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-500">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {formatDate(entry.date)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Top Section: Software & Staff Info in Horizontal Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Software Info */}
            <div className="bg-white/80 rounded-2xl p-3 border border-slate-200/80 shadow-sm flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-blue-600 mb-1 font-bold text-[10px] uppercase tracking-wider">
                  <Laptop className="w-3.5 h-3.5" />
                  <span>Software Info</span>
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    name="softwareDetails"
                    value={editData.softwareDetails}
                    onChange={handleEditChange}
                    className={`${EDIT_INPUT_CLASS} text-base`}
                  />
                ) : (
                  <h3 className="text-base font-bold text-slate-900 capitalize">
                    {item.softwareDetails || "N/A"}
                  </h3>
                )}
              </div>
              <div className="text-right ml-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Type
                </span>
                {isEditing ? (
                  <select
                    name="softwareType"
                    value={editData.softwareType}
                    onChange={handleEditChange}
                    className="text-xs text-slate-800 font-extrabold bg-white border border-slate-200 px-2 py-0.5 rounded-md mt-0.5 cursor-pointer"
                  >
                    <option value="Desktop">Desktop</option>
                    <option value="Web App">Web App</option>
                    <option value="Cloud ERP">Cloud ERP</option>
                  </select>
                ) : (
                  <span className="text-xs text-slate-800 font-extrabold bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-md inline-block mt-0.5">
                    {item.softwareType || "Desktop"}
                  </span>
                )}
              </div>
            </div>

            {/* Assigned Staff */}
            <div className="bg-white/80 rounded-2xl p-3.5 border border-slate-200/80 shadow-sm flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-1.5 text-indigo-600 mb-1 font-bold text-[10px] uppercase tracking-wider">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Assigned Staff</span>
                </div>
                {isEditing ? (
                  <select
                    value={editData.assignedStaff?.staffId || ""}
                    onChange={handleEditStaffSelect}
                    className={`${EDIT_INPUT_CLASS} cursor-pointer`}
                  >
                    <option value="">Select Staff Member</option>
                    {staffList.map((staff) => (
                      <option key={staff._id} value={staff._id}>
                        {staff.fullName || staff.name} (
                        {staff.designation || "Staff"})
                      </option>
                    ))}
                  </select>
                ) : (
                  <>
                    <h3 className="text-base font-bold text-slate-900">
                      {staffInfo.name}
                    </h3>
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                      {staffInfo.designation}
                    </p>
                  </>
                )}
              </div>

              {!isEditing && (
                <div className="space-y-0.5 text-right text-xs mt-3">
                  {staffInfo.phone && (
                    <p className="flex items-center justify-end gap-1.5 text-slate-600 font-medium text-[11px]">
                      <Phone className="w-3 h-3 text-slate-400" />{" "}
                      {staffInfo.phone}
                    </p>
                  )}
                  {staffInfo.email && (
                    <p className="flex items-center justify-end gap-1.5 text-slate-600 font-medium text-[11px] truncate">
                      <Mail className="w-3 h-3 text-slate-400" />{" "}
                      {staffInfo.email}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Billing & Order Details Grid (Wide 6 Columns) */}
          <div className="bg-white/80 rounded-2xl p-3.5 border border-slate-200/80 shadow-sm">
            <div className="flex items-center gap-1.5 text-emerald-600 mb-2.5 font-bold text-[10px] uppercase tracking-wider">
              <Receipt className="w-3.5 h-3.5" />
              <span>Billing & Order Details</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  PO Number
                </p>
                {isEditing ? (
                  <input
                    type="text"
                    name="poNumber"
                    value={editData.poNumber}
                    onChange={handleEditChange}
                    className={`${EDIT_INPUT_CLASS} mt-0.5`}
                  />
                ) : (
                  <p className="text-xs font-extrabold text-slate-800 mt-0.5">
                    {item.poNumber || "-"}
                  </p>
                )}
              </div>

              <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  Bill Number
                </p>
                {isEditing ? (
                  <input
                    type="text"
                    name="billNumber"
                    value={editData.billNumber}
                    onChange={handleEditChange}
                    className={`${EDIT_INPUT_CLASS} mt-0.5`}
                  />
                ) : (
                  <p className="text-xs font-extrabold text-slate-800 mt-0.5">
                    {item.billNumber || "-"}
                  </p>
                )}
              </div>

              <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  Bill Date
                </p>
                {isEditing ? (
                  <input
                    type="date"
                    name="billDate"
                    value={editData.billDate}
                    onChange={handleEditChange}
                    className={`${EDIT_INPUT_CLASS} mt-0.5`}
                  />
                ) : (
                  <p className="text-xs font-extrabold text-slate-800 mt-0.5">
                    {formatDate(item.billDate)}
                  </p>
                )}
              </div>

              <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  Install Date
                </p>
                {isEditing ? (
                  <input
                    type="date"
                    name="installationDate"
                    value={editData.installationDate}
                    onChange={handleEditChange}
                    className={`${EDIT_INPUT_CLASS} mt-0.5`}
                  />
                ) : (
                  <p className="text-xs font-extrabold text-slate-800 mt-0.5">
                    {formatDate(item.installationDate)}
                  </p>
                )}
              </div>

              <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  Amount
                </p>
                {isEditing ? (
                  <input
                    type="number"
                    name="amount"
                    value={editData.amount}
                    onChange={handleEditChange}
                    className={`${EDIT_INPUT_CLASS} mt-0.5`}
                  />
                ) : (
                  <p className="text-xs font-black text-blue-600 mt-0.5">
                    ₹{Number(item.amount || 0).toLocaleString("en-IN")}
                  </p>
                )}
              </div>

              <div className="bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  Sales Person
                </p>
                {isEditing ? (
                  <input
                    type="text"
                    name="salesPersonName"
                    value={editData.salesPersonName}
                    onChange={handleEditChange}
                    className={`${EDIT_INPUT_CLASS} mt-0.5`}
                  />
                ) : (
                  <p className="text-xs font-extrabold text-slate-800 mt-0.5 truncate">
                    {item.salesPersonName || "-"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Location & Contact (Horizontal split 2 columns) */}
          <div className="bg-white/80 rounded-2xl p-3.5 border border-slate-200/80 shadow-sm">
            <div className="flex items-center gap-1.5 text-rose-600 mb-2.5 font-bold text-[10px] uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5" />
              <span>Location & Contact Details</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Contact Person */}
              <div className="flex items-center justify-between bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 gap-3">
                <div className="flex-1">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    Contact Person
                  </p>
                  {isEditing ? (
                    <input
                      type="text"
                      name="contactPerson"
                      value={editData.contactPerson}
                      onChange={handleEditChange}
                      className={`${EDIT_INPUT_CLASS} mt-0.5`}
                    />
                  ) : (
                    <p className="text-xs font-bold text-slate-900 mt-0.5">
                      {item.contactPerson || "-"}
                    </p>
                  )}
                </div>

                {isEditing ? (
                  <div className="flex-1 space-y-1">
                    <input
                      type="tel"
                      name="mobileNo"
                      value={editData.mobileNo}
                      onChange={handleEditChange}
                      placeholder="Mobile No"
                      className={EDIT_INPUT_CLASS}
                    />
                    <input
                      type="tel"
                      name="alternateNo"
                      value={editData.alternateNo}
                      onChange={handleEditChange}
                      placeholder="Alternate No"
                      className={EDIT_INPUT_CLASS}
                    />
                    <input
                      type="email"
                      name="email"
                      value={editData.email}
                      onChange={handleEditChange}
                      placeholder="Email"
                      className={EDIT_INPUT_CLASS}
                    />
                  </div>
                ) : (
                  <div className="space-y-0.5 text-right text-xs">
                    {(item.mobileNo || item.alternateNo) && (
                      <p className="flex items-center justify-end gap-1 text-slate-600 font-semibold text-[11px]">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {[item.mobileNo, item.alternateNo]
                          .filter(Boolean)
                          .join(" / ")}
                      </p>
                    )}
                    {item.email && (
                      <p className="flex items-center justify-end gap-1 text-slate-600 font-semibold text-[11px] truncate">
                        <Mail className="w-3 h-3 text-slate-400" /> {item.email}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Address */}
              <div className="flex items-center justify-between bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 gap-3">
                <div className="flex-1">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    Address
                  </p>
                  {isEditing ? (
                    <input
                      type="text"
                      name="address"
                      value={editData.address}
                      onChange={handleEditChange}
                      className={`${EDIT_INPUT_CLASS} mt-0.5`}
                    />
                  ) : (
                    <p className="text-xs font-bold text-slate-900 mt-0.5 truncate">
                      {item.address || "-"}
                    </p>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    Location
                  </p>
                  {isEditing ? (
                    <input
                      type="text"
                      name="location"
                      value={editData.location}
                      onChange={handleEditChange}
                      className={`${EDIT_INPUT_CLASS} mt-0.5`}
                    />
                  ) : (
                    <p className="text-xs font-extrabold text-slate-700 mt-0.5">
                      {item.location || "-"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-white/80 border-t border-slate-200/80 flex justify-end gap-2 shrink-0">
          {isEditing ? (
            <>
              <button
                onClick={handleCancelEdit}
                disabled={saving}
                className="px-5 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl shadow-sm transition-all active:scale-95 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={saving}
                className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5 disabled:opacity-70"
              >
                {saving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-5 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
              >
                <Pencil className="w-3.5 h-3.5" /> Edit
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white  text-xs font-bold rounded-xl shadow-md transition-all active:scale-95"
              >
                Close Details
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}