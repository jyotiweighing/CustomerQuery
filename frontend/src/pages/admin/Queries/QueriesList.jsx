
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
} from "lucide-react";

import QueriesTable from "../../../components/admin/tables/QueriesTable";
import AssignStaffModal from "../../../components/admin/modals/AssignStaffModal";
import { getCustomerQueries } from "../../../services/admin/queryService";
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
    </div>
  );
}