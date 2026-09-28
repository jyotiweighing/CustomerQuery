
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  RefreshCw,
  Inbox,
  UserPlus,
  Clock3,
  CheckCircle2,
  ChevronDown,
  Plus,
  X,
  Phone,
  Mail,
} from "lucide-react";

import QueriesTable from "../../../components/admin/tables/QueriesTable";
import AssignStaffModal from "../../../components/admin/modals/AssignStaffModal";
import { getCustomerQueries, createAdminQuery } from "../../../services/admin/queryService";
import { useToast } from "../../../context/ToastContext";

const statusTabs = [
  "All",
  "Open",
  "Assigned",
  "In Progress",
  "Resolved",
  "Closed",
];

export default function QueriesList() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [tab, setTab] = useState("All");
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("All");

  const [assignTarget, setAssignTarget] = useState(null);

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState({
    customerName: "",
    customerCode: "",
    companyName: "",
    subject: "",
    category: "Technical Support",
    product: "Electronic Weighbridge",
    softwareType: "Standard Software",
    softwareFeature: [],
    material: [],
    priority: "Medium",
    description: "",
    preferredContact: "Call",
    mobileNo: "",
    email: "",
    partyName: "",
    contactPerson: "",
    address: "",
    location: "",
    alternateNo: "",
    poNumber: "",
    billNumber: "",
    billDate: "",
    salesPersonName: "",
  });

  const loadQueries = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getCustomerQueries();

      setList(Array.isArray(result?.data) ? result.data : []);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Unable to load customer queries"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueries();
  }, []);

  const filtered = useMemo(() => {
    return list.filter((q) => {
      const normalizedStatus =
        q.status === "Picked" ? "Assigned" : q.status;

      const matchesTab =
        tab === "All" || normalizedStatus === tab;

      const matchesPriority =
        priority === "All" || q.priority === priority;

      const term = search.trim().toLowerCase();

      const matchesSearch =
        !term ||
        [
          q.queryId,
          q.subject,
          q.customer?.name,
          q.customer?.companyName,
          q.customer?.email,
          q.partyDetails?.partyName,
          q.partyDetails?.poNumber,
          q.partyDetails?.billNumber,
          q.partyDetails?.location,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(term)
          );

      return (
        matchesTab &&
        matchesPriority &&
        matchesSearch
      );
    });
  }, [list, tab, priority, search]);

  const stats = useMemo(
    () => ({
      total: list.length,

      open: list.filter(
        (q) => q.status === "Open"
      ).length,

      assigned: list.filter((q) =>
        ["Assigned", "Picked", "In Progress"].includes(
          q.status
        )
      ).length,

      resolved: list.filter((q) =>
        ["Resolved", "Closed"].includes(q.status)
      ).length,
    }),
    [list]
  );

  const statCards = [
    {
      label: "Total Queries",
      value: stats.total,
      Icon: Inbox,
      iconGradient:
        "from-[#3555D8] to-[#2872EC]",
      softBg: "bg-[#EEF3FF]",
    },
    {
      label: "Open",
      value: stats.open,
      Icon: Clock3,
      iconGradient:
        "from-[#FFB52A] to-[#FF8A00]",
      softBg: "bg-[#FFF7E8]",
    },
    {
      label: "Assigned / Active",
      value: stats.assigned,
      Icon: UserPlus,
      iconGradient:
        "from-[#2589F4] to-[#10BDE6]",
      softBg: "bg-[#ECF9FF]",
    },
    {
      label: "Resolved",
      value: stats.resolved,
      Icon: CheckCircle2,
      iconGradient:
        "from-[#18B77D] to-[#10D29A]",
      softBg: "bg-[#ECFFF8]",
    },
  ];

  const openCreate = () => {
    // Admin-created queries are entered manually.
    // No customer list/API call is required.
    setCreateForm({
      customerName: "",
      customerCode: "",
      companyName: "",
      subject: "",
      category: "Technical Support",
      product: "Electronic Weighbridge",
      softwareType: "Standard Software",
      softwareFeature: [],
      material: [],
      priority: "Medium",
      description: "",
      preferredContact: "Call",
      mobileNo: "",
      email: "",
      partyName: "",
      contactPerson: "",
      address: "",
      location: "",
      alternateNo: "",
      poNumber: "",
      billNumber: "",
      billDate: "",
      salesPersonName: "",
    });
    setShowCreate(true);
  };

  const updateCreateForm = (key, value) => {
    setCreateForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const toggleSoftwareFeature = (feature) => {
    setCreateForm((current) => ({
      ...current,
      softwareFeature: current.softwareFeature.includes(feature)
        ? current.softwareFeature.filter((item) => item !== feature)
        : [...current.softwareFeature, feature],
    }));
  };

  const addMaterial = () => {
    setCreateForm((current) => ({
      ...current,
      material: [
        ...current.material,
        { name: "IP Camera", quantity: 1 },
      ],
    }));
  };

  const updateMaterial = (index, key, value) => {
    setCreateForm((current) => ({
      ...current,
      material: current.material.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [key]:
                key === "quantity"
                  ? Math.max(1, Number(value) || 1)
                  : value,
            }
          : item,
      ),
    }));
  };

  const removeMaterial = (index) => {
    setCreateForm((current) => ({
      ...current,
      material: current.material.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const submitCreate = async (e) => {
    e.preventDefault();

    if (!createForm.customerName.trim()) {
      showToast("Customer name is required", "error");
      return;
    }

    if (
      createForm.preferredContact === "Call" &&
      !createForm.mobileNo.trim()
    ) {
      showToast("Mobile number is required for Call", "error");
      return;
    }

    if (
      createForm.preferredContact === "Email" &&
      !createForm.email.trim()
    ) {
      showToast("Email is required for Email", "error");
      return;
    }

    setCreating(true);

    try {
      await createAdminQuery({
        customerName: createForm.customerName,
        customerCode: createForm.customerCode,
        companyName: createForm.companyName,
        subject: createForm.subject,
        category: createForm.category,
        product: createForm.product,
        softwareType: createForm.softwareType,
        softwareFeature: createForm.softwareFeature,
        material: createForm.material,
        priority: createForm.priority,
        description: createForm.description,
        preferredContact: createForm.preferredContact,
        partyDetails: {
          poNumber: createForm.poNumber,
          billNumber: createForm.billNumber,
          billDate: createForm.billDate || null,
          partyName: createForm.partyName || createForm.companyName || createForm.customerName,
          address: createForm.address,
          location: createForm.location,
          contactPerson: createForm.contactPerson || createForm.customerName,
          mobileNo: createForm.mobileNo,
          email: createForm.email,
          alternateNo: createForm.alternateNo,
          salesPersonName: createForm.salesPersonName,
        },
      });

      setShowCreate(false);
      await loadQueries();
      showToast("Customer query created successfully", "success");
    } catch (err) {
      showToast(
        err?.response?.data?.message || "Unable to create query",
        "error",
      );
    } finally {
      setCreating(false);
    }
  };

  const handleViewQuery = (row) => {
    if (!row?._id) return;
    navigate(String(row._id));
  };

  return (
    <div className="min-h-full w-full max-w-full overflow-x-hidden bg-[#F6F8FC]">
      {/* ================= HEADER ================= */}

      <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <h1 className="text-[27px] font-bold tracking-[-0.5px] text-[#15213A] sm:text-[30px]">
            Customer Queries
          </h1>

          <p className="mt-1 text-[13px] text-[#66758D] sm:text-[14px]">
            Review customer requests, assign support
            staff and create tasks.
          </p>
        </div>

        <div className="flex gap-2 self-start lg:self-auto">
        <button type="button" onClick={openCreate} className="inline-flex h-[42px] items-center justify-center gap-2 rounded-[14px] bg-[#15213A] px-5 text-[13px] font-bold text-white shadow-sm hover:bg-[#243452]"><Plus size={16}/> Add Query</button>
        <button
          type="button"
          onClick={loadQueries}
          disabled={loading}
          className="
            inline-flex h-[42px]
            shrink-0 items-center justify-center gap-2
            self-start rounded-[14px]
            bg-gradient-to-r
            from-[#09B9D7]
            to-[#2865E9]
            px-5
            text-[13px] font-bold
            text-white
            shadow-[0_7px_18px_rgba(40,101,233,0.23)]
            transition-all duration-200
            hover:-translate-y-[1px]
            hover:shadow-[0_10px_22px_rgba(40,101,233,0.30)]
            disabled:cursor-not-allowed
            disabled:opacity-60
            lg:self-auto
          "
        >
          <RefreshCw
            size={16}
            strokeWidth={2.2}
            className={loading ? "animate-spin" : ""}
          />

          Refresh
        </button>
        </div>
      </div>

      {/* ================= STATS ================= */}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map(
          ({
            label,
            value,
            Icon,
            iconGradient,
            softBg,
          }) => (
            <div
              key={label}
              className="
                rounded-[22px]
                border border-[#E8EDF5]
                bg-white
                p-5
                shadow-[0_8px_27px_rgba(20,41,78,0.05)]
                transition-all duration-200
                hover:-translate-y-[2px]
                hover:shadow-[0_12px_32px_rgba(20,41,78,0.08)]
              "
            >
              <div className="flex items-center gap-4">
                <div
                  className={`
                    flex h-[52px] w-[52px]
                    shrink-0 items-center justify-center
                    rounded-[16px]
                    ${softBg}
                  `}
                >
                  <div
                    className={`
                      flex h-[39px] w-[39px]
                      items-center justify-center
                      rounded-[12px]
                      bg-gradient-to-br
                      ${iconGradient}
                      text-white
                      shadow-sm
                    `}
                  >
                    <Icon
                      size={19}
                      strokeWidth={2}
                    />
                  </div>
                </div>

                <div className="min-w-0">
                  <p className="text-[26px] font-bold leading-none text-[#18243B]">
                    {value}
                  </p>

                  <p className="mt-2 truncate text-[11px] font-semibold uppercase tracking-[0.02em] text-[#8290A6]">
                    {label}
                  </p>
                </div>
              </div>
            </div>
          )
        )}
      </div>

      {/* ================= FILTER AREA ================= */}

      <div
        className="
          mb-5
          rounded-[23px]
          border border-[#E9EEF5]
          bg-white
          p-4
          shadow-[0_8px_28px_rgba(18,42,74,0.045)]
        "
      >
        <div className="flex flex-col gap-3 lg:flex-row">
          {/* SEARCH */}

          <div className="relative min-w-0 flex-1">
            <Search
              size={17}
              className="
                absolute left-4 top-1/2
                -translate-y-1/2
                text-[#A2AEC0]
              "
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search Query ID, customer, party, PO or bill number..."
              className="
                h-[46px] w-full min-w-0
                rounded-[15px]
                border border-transparent
                bg-[#F8FAFD]
                pl-11 pr-4
                text-[13px]
                font-medium text-[#35445D]
                outline-none
                transition-all
                placeholder:font-normal
                placeholder:text-[#A7B1C1]
                hover:bg-[#F5F8FC]
                focus:border-[#54A9EF]
                focus:bg-white
                focus:ring-4
                focus:ring-[#2587F4]/10
              "
            />
          </div>

          {/* PRIORITY FILTER */}

          <div className="relative w-full lg:w-[190px]">
            <Filter
              size={16}
              className="
                pointer-events-none
                absolute left-4 top-1/2
                -translate-y-1/2
                text-[#71839C]
              "
            />

            <select
              value={priority}
              onChange={(e) =>
                setPriority(e.target.value)
              }
              className="
                h-[46px] w-full
                appearance-none
                rounded-[15px]
                border border-transparent
                bg-[#F8FAFD]
                pl-11 pr-10
                text-[13px]
                font-semibold
                text-[#4C5C74]
                outline-none
                transition-all
                focus:border-[#54A9EF]
                focus:bg-white
                focus:ring-4
                focus:ring-[#2587F4]/10
              "
            >
              <option value="All">
                All Priority
              </option>

              <option value="High">
                High
              </option>

              <option value="Medium">
                Medium
              </option>

              <option value="Low">
                Low
              </option>
            </select>

            <ChevronDown
              size={15}
              className="
                pointer-events-none
                absolute right-4 top-1/2
                -translate-y-1/2
                text-[#8B98AA]
              "
            />
          </div>
        </div>
      </div>

      {/* ================= STATUS TABS ================= */}

      <div
        className="
          mb-5 flex max-w-full
          flex-wrap gap-2
          rounded-[20px]
          border border-[#E8EDF5]
          bg-white
          p-2
          shadow-[0_7px_23px_rgba(18,42,74,0.04)]
        "
      >
        {statusTabs.map((item) => {
          const active = tab === item;

          return (
            <button
              key={item}
              type="button"
              onClick={() => setTab(item)}
              className={`
                rounded-[12px]
                px-4 py-2.5
                text-[12px]
                font-bold
                transition-all duration-200
                ${
                  active
                    ? `
                      bg-gradient-to-r
                      from-[#3554D6]
                      to-[#2687F2]
                      text-white
                      shadow-[0_5px_14px_rgba(43,104,223,0.24)]
                    `
                    : `
                      text-[#728198]
                      hover:bg-[#F2F7FD]
                      hover:text-[#2D63D1]
                    `
                }
              `}
            >
              {item}
            </button>
          );
        })}
      </div>

      {/* ================= ERROR ================= */}

      {error && (
        <div
          className="
            mb-5
            rounded-[16px]
            border border-[#FFD1D9]
            bg-[#FFF3F5]
            px-4 py-3
            text-[13px]
            font-medium
            text-[#D83F58]
          "
        >
          {error}
        </div>
      )}

      {/* ================= TABLE ================= */}

      <div
        className="
          w-full max-w-full
          overflow-hidden
          rounded-[25px]
          border border-[#E8EDF5]
          bg-white
          shadow-[0_11px_32px_rgba(18,42,74,0.05)]
        "
      >
        {loading ? (
          <div className="flex min-h-[270px] items-center justify-center">
            <div className="text-center">
              <RefreshCw
                size={25}
                className="mx-auto animate-spin text-[#2A7CE9]"
              />

              <p className="mt-3 text-[13px] font-medium text-[#74829A]">
                Loading customer queries...
              </p>
            </div>
          </div>
        ) : (
          <QueriesTable
            rows={filtered}
            onAssign={setAssignTarget}
            onView={handleViewQuery}
          />
        )}
      </div>

      {/* ================= ASSIGN MODAL ================= */}

      <AssignStaffModal
        open={!!assignTarget}
        query={assignTarget}
        onClose={() =>
          setAssignTarget(null)
        }
        onAssigned={({ query, task }) => {
          setList((prev) =>
            prev.map((item) =>
              item._id === query._id
                ? query
                : item
            )
          );

          setAssignTarget(null);

          showToast(
            `Assigned successfully. Task ${
              task?.taskId ||
              query?.taskCode ||
              ""
            } created.`,
            "success"
          );
        }}
      />
      {showCreate && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowCreate(false);
            }
          }}
        >
          <div className="max-h-[94vh] w-full max-w-6xl overflow-y-auto rounded-[28px] border border-white/80 bg-gradient-to-br from-[#d8e6ff] via-[#f0f5ff] to-[#d8f6ff] shadow-2xl">
            <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/70 bg-[#edf5ff]/95 px-6 py-5 backdrop-blur">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Create Customer Query Profile
                </h2>
                <p className="text-xs text-slate-500">
                  Enter customer information and raise a query.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="rounded-xl p-2 hover:bg-slate-100"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={submitCreate} className="space-y-7 p-6 [&_input]:rounded-xl [&_select]:rounded-xl [&_textarea]:rounded-xl [&_section]:rounded-2xl [&_section]:border [&_section]:border-white/80 [&_section]:bg-white/55 [&_section]:p-4">
              {/* Customer Details */}
              <section>
                <h3 className="mb-3 text-sm font-bold text-slate-800">
                  Customer Details
                </h3>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <label className="text-xs font-bold text-slate-600">
                    Customer Name *
                    <input
                      required
                      value={createForm.customerName}
                      onChange={(e) => updateCreateForm("customerName", e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm"
                      placeholder="Customer name"
                    />
                  </label>

                  <label className="text-xs font-bold text-slate-600">
                    Customer Code
                    <input
                      value={createForm.customerCode}
                      onChange={(e) => updateCreateForm("customerCode", e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm"
                      placeholder="Customer code"
                    />
                  </label>

                  <label className="text-xs font-bold text-slate-600 lg:col-span-2">
                    Company Name
                    <input
                      value={createForm.companyName}
                      onChange={(e) => updateCreateForm("companyName", e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm"
                      placeholder="Company / organisation"
                    />
                  </label>

                  <label className="text-xs font-bold text-slate-600">
                    Contact Person *
                    <input
                      required
                      value={createForm.contactPerson}
                      onChange={(e) => updateCreateForm("contactPerson", e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm"
                      placeholder="Contact person"
                    />
                  </label>

                  <label className="text-xs font-bold text-slate-600">
                    Mobile
                    <input
                      type="tel"
                      value={createForm.mobileNo}
                      onChange={(e) => updateCreateForm("mobileNo", e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm"
                      placeholder="Mobile number"
                    />
                  </label>

                  <label className="text-xs font-bold text-slate-600">
                    Email
                    <input
                      type="email"
                      required={createForm.preferredContact === "Email"}
                      value={createForm.email}
                      onChange={(e) => updateCreateForm("email", e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm"
                      placeholder="Email address"
                    />
                  </label>

                  <label className="text-xs font-bold text-slate-600">
                    Alternate No.
                    <input
                      type="tel"
                      value={createForm.alternateNo}
                      onChange={(e) => updateCreateForm("alternateNo", e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm"
                      placeholder="Alternate number"
                    />
                  </label>

                  <label className="text-xs font-bold text-slate-600 lg:col-span-2">
                    Address
                    <input
                      value={createForm.address}
                      onChange={(e) => updateCreateForm("address", e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm"
                      placeholder="Complete address"
                    />
                  </label>

                  <label className="text-xs font-bold text-slate-600">
                    Location
                    <input
                      value={createForm.location}
                      onChange={(e) => updateCreateForm("location", e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm"
                      placeholder="City / location"
                    />
                  </label>
                </div>
              </section>

              {/* Query Details */}
              <section className="border-t pt-6">
                <h3 className="mb-3 text-sm font-bold text-slate-800">
                  Query Details
                </h3>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <label className="text-xs font-bold text-slate-600 lg:col-span-2">
                    Subject *
                    <input
                      required
                      value={createForm.subject}
                      onChange={(e) => updateCreateForm("subject", e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm"
                      placeholder="Briefly describe the issue"
                    />
                  </label>

                  <label className="text-xs font-bold text-slate-600">
                    Category *
                    <select
                      required
                      value={createForm.category}
                      onChange={(e) => updateCreateForm("category", e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 p-3"
                    >
                      <option>Technical Support</option>
                      <option>Installation</option>
                      <option>Calibration</option>
                      <option>Documentation</option>
                      <option>Billing</option>
                      <option>General Enquiry</option>
                    </select>
                  </label>

                  <label className="text-xs font-bold text-slate-600">
                    Product
                    <select
                      value={createForm.product}
                      onChange={(e) => updateCreateForm("product", e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 p-3"
                    >
                      <option>Electronic Weighbridge</option>
                      <option>Platform Scale</option>
                      <option>Industrial Scale</option>
                      <option>Weighbridge Printer</option>
                      <option>Software / Indicator</option>
                      <option>Other</option>
                    </select>
                  </label>

                  <label className="text-xs font-bold text-slate-600">
                    Software Type
                    <select
                      value={createForm.softwareType}
                      onChange={(e) => updateCreateForm("softwareType", e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 p-3"
                    >
                      <option>Standard Software</option>
                      <option>Photo Capturing</option>
                      <option>Master Slave</option>
                      <option>Unmaned Software</option>
                    </select>
                  </label>

                  <label className="text-xs font-bold text-slate-600">
                    Priority
                    <select
                      value={createForm.priority}
                      onChange={(e) => updateCreateForm("priority", e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 p-3"
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </label>
                </div>

                <div className="mt-5">
                  <p className="mb-2 text-xs font-bold text-slate-600">
                    Software Features
                  </p>

                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {["Email", "SMS", "Cloud", "Whatsapp"].map((feature) => (
                      <label
                        key={feature}
                        className="rounded-xl border border-slate-200 p-3 text-xs font-semibold"
                      >
                        <input
                          type="checkbox"
                          checked={createForm.softwareFeature.includes(feature)}
                          onChange={() => toggleSoftwareFeature(feature)}
                          className="mr-2 accent-blue-600"
                        />
                        {feature}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-600">
                      Material & Quantity
                    </p>

                    <button
                      type="button"
                      onClick={addMaterial}
                      className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100"
                    >
                      + Add Material
                    </button>
                  </div>

                  {createForm.material.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 p-4 text-center text-xs text-slate-500">
                      No material added.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {createForm.material.map((item, index) => (
                        <div
                          key={`${index}-${item.name}`}
                          className="grid gap-2 sm:grid-cols-[1fr_150px_auto]"
                        >
                          <select
                            value={item.name}
                            onChange={(e) => updateMaterial(index, "name", e.target.value)}
                            className="rounded-xl border border-slate-200 p-3 text-sm"
                          >
                            {[
                              "IP Camera",
                              "Traffic Light",
                              "ANPR Camera",
                              "Vehicle Position Sensor (VPS)",
                              "VHF Reader",
                              "VHF Tag",
                              "Boom Barrier",
                              "I/O Controller",
                              "Pole",
                              "Computer",
                              "Printer",
                            ].map((material) => (
                              <option key={material}>{material}</option>
                            ))}
                          </select>

                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateMaterial(index, "quantity", e.target.value)}
                            className="rounded-xl border border-slate-200 p-3 text-sm"
                            placeholder="Quantity"
                          />

                          <button
                            type="button"
                            onClick={() => removeMaterial(index)}
                            className="rounded-xl border border-red-200 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-5">
                  <div className="mb-2 text-xs font-bold text-slate-600">
                    Preferred Contact *
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      ["Call", Phone],
                      ["Email", Mail],
                    ].map(([type, Icon]) => (
                      <button
                        type="button"
                        key={type}
                        onClick={() => updateCreateForm("preferredContact", type)}
                        className={`rounded-xl border p-3 text-left font-bold ${
                          createForm.preferredContact === type
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-slate-200"
                        }`}
                      >
                        <Icon size={17} className="mr-2 inline" />
                        {type}
                      </button>
                    ))}
                  </div>

                  <p className="mt-2 text-[11px] text-slate-500">
                    {createForm.preferredContact === "Call"
                      ? "Mobile number is required."
                      : "Email address is required."}
                  </p>
                </div>

                <label className="mt-5 block text-xs font-bold text-slate-600">
                  Detailed Description *
                  <textarea
                    required
                    rows={5}
                    value={createForm.description}
                    onChange={(e) => updateCreateForm("description", e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm"
                    placeholder="Enter complete query details..."
                  />
                </label>
              </section>

              {/* Party / Billing Details */}
              <section className="border-t pt-6">
                <h3 className="mb-3 text-sm font-bold text-slate-800">
                  Party & Billing Details
                </h3>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <label className="text-xs font-bold text-slate-600">
                    Party Name
                    <input
                      value={createForm.partyName}
                      onChange={(e) => updateCreateForm("partyName", e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm"
                      placeholder="Party name"
                    />
                  </label>

                  <label className="text-xs font-bold text-slate-600">
                    PO Number
                    <input
                      value={createForm.poNumber}
                      onChange={(e) => updateCreateForm("poNumber", e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm"
                      placeholder="PO number"
                    />
                  </label>

                  <label className="text-xs font-bold text-slate-600">
                    Bill Number
                    <input
                      value={createForm.billNumber}
                      onChange={(e) => updateCreateForm("billNumber", e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm"
                      placeholder="Bill number"
                    />
                  </label>

                  <label className="text-xs font-bold text-slate-600">
                    Bill Date
                    <input
                      type="date"
                      value={createForm.billDate}
                      onChange={(e) => updateCreateForm("billDate", e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm"
                    />
                  </label>

                  <label className="text-xs font-bold text-slate-600">
                    Sales Person
                    <input
                      value={createForm.salesPersonName}
                      onChange={(e) => updateCreateForm("salesPersonName", e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm"
                      placeholder="Sales person"
                    />
                  </label>
                </div>
              </section>

              <div className="flex justify-end gap-3 border-t pt-5">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="rounded-xl border px-5 py-3 font-bold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={creating}
                  className="rounded-xl bg-blue-600 px-5 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {creating ? "Creating..." : "Create Query"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}