import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  UserPlus,
  Mail,
  Phone,
  Building2,
  MapPin,
  ReceiptText,
  MessageSquareText,
  ClipboardCheck,
  Loader2,
  UserCheck,
} from "lucide-react";

import AssignStaffModal from "../../../components/admin/modals/AssignStaffModal";
import { getCustomerQueryById } from "../../../services/admin/queryService";
import { useToast } from "../../../context/ToastContext";

const statusStyles = {
  Open: "border-[#CBD9FF] bg-[#EEF3FF] text-[#3158D5]",

  Assigned: "border-[#BDE9FF] bg-[#EAF8FF] text-[#1686CA]",

  Picked: "border-[#BDE9FF] bg-[#EAF8FF] text-[#1686CA]",

  "In Progress": "border-[#FFE0A5] bg-[#FFF7E8] text-[#E58A00]",

  Resolved: "border-[#B9F2DE] bg-[#EDFFF8] text-[#0B9D70]",

  Closed: "border-[#DCE2EA] bg-[#F2F4F8] text-[#65738B]",
};

const priorityStyles = {
  High: "border-[#FFC9D1] bg-[#FFF0F3] text-[#F0445E]",

  Medium: "border-[#FFE0A5] bg-[#FFF7E8] text-[#E58A00]",

  Low: "border-[#B9F2DE] bg-[#EDFFF8] text-[#0B9D70]",
};

const Info = ({ label, value }) => (
  <div className="min-w-0">
    <p
      className="
        text-[9px]
        font-bold
        uppercase
        tracking-[0.08em]
        text-[#96A2B4]
      "
    >
      {label}
    </p>

    <p
      className="
        mt-1.5
        min-w-0
        break-words
        text-[12px]
        font-semibold
        text-[#42516A]
      "
    >
      {value || "—"}
    </p>
  </div>
);

export default function QueryDetails() {
  const { id } = useParams();

  const navigate = useNavigate();

  const { showToast } = useToast();

  const [query, setQuery] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [assignOpen, setAssignOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError("");

    getCustomerQueryById(id)
      .then((res) => setQuery(res?.data || null))
      .catch((err) =>
        setError(
          err?.response?.data?.message || "Unable to load query details",
        ),
      )
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div
        className="
          flex min-h-[320px]
          w-full max-w-full
          items-center justify-center
          overflow-hidden
          rounded-[25px]
          border border-[#E8EDF5]
          bg-white
          shadow-[0_10px_30px_rgba(20,42,80,0.05)]
        "
      >
        <div className="text-center">
          <Loader2
            size={26}
            className="
              mx-auto animate-spin
              text-[#2781EB]
            "
          />

          <p className="mt-3 text-[13px] font-medium text-[#74829A]">
            Loading query...
          </p>
        </div>
      </div>
    );
  }

  if (error || !query) {
    return (
      <div className="w-full max-w-full overflow-x-hidden">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="
            mb-4
            flex items-center gap-2
            text-[13px]
            font-semibold
            text-[#687892]
            transition
            hover:text-[#3159D5]
          "
        >
          <ArrowLeft size={15} />
          Back
        </button>

        <div
          className="
            rounded-[24px]
            border border-[#FFD1D9]
            bg-white
            p-8
            text-center
            text-[13px]
            font-medium
            text-[#D94059]
          "
        >
          {error || "Query not found"}
        </div>
      </div>
    );
  }

  const party = query.partyDetails || {};

  const customer = query.customer || {};

  const assigned = query.assignedStaff || query.pickedBy;

  return (
    <div className="min-h-full w-full max-w-full overflow-x-hidden bg-[#F6F8FC]">
      {/* ================= BACK ================= */}

      <button
        type="button"
        onClick={() => navigate(-1)}
        className="
          mb-5
          flex items-center gap-2
          text-[12px]
          font-bold
          text-[#718098]
          transition
          hover:text-[#3159D5]
        "
      >
        <span
          className="
            flex h-8 w-8
            items-center justify-center
            rounded-[10px]
            border border-[#E7EDF5]
            bg-white
            shadow-sm
          "
        >
          <ArrowLeft size={15} />
        </span>
        Back to customer queries
      </button>

      {/* ================= HEADER ================= */}

      <div
        className="
          relative mb-6
          w-full max-w-full
          overflow-hidden
          rounded-[25px]
          bg-gradient-to-r
          from-[#3852CE]
          via-[#2778E9]
          to-[#0FBCE1]
          px-5 py-6
          shadow-[0_13px_30px_rgba(38,91,206,0.18)]
          sm:px-6
        "
      >
        <div
          className="
            pointer-events-none
            absolute -right-12
            -top-20
            h-48 w-48
            rounded-full
            bg-white/10
          "
        />

        <div
          className="
            pointer-events-none
            absolute -bottom-24
            right-28
            h-48 w-48
            rounded-full
            bg-white/[0.06]
          "
        />

        <div
          className="
            relative z-10
            flex min-w-0
            flex-col
            justify-between
            gap-5
            lg:flex-row
            lg:items-center
          "
        >
          <div className="min-w-0">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <h1 className="break-words text-[24px] font-bold text-white sm:text-[27px]">
                {query.queryId}
              </h1>

              <span
                className={`
                  rounded-full
                  border
                  px-3 py-1
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-wide
                  ${priorityStyles[query.priority] || priorityStyles.Medium}
                `}
              >
                {query.priority} Priority
              </span>

              <span
                className={`
                  rounded-full
                  border
                  px-3 py-1
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-wide
                  ${statusStyles[query.status] || statusStyles.Open}
                `}
              >
                {query.status}
              </span>
            </div>

            <p className="mt-2 max-w-3xl break-words text-[13px] leading-6 text-white/80">
              {query.subject}
            </p>
          </div>

          {!query.taskId ? (
            <button
              type="button"
              onClick={() => setAssignOpen(true)}
              className="
                inline-flex
                h-[43px]
                w-full
                shrink-0
                items-center
                justify-center
                gap-2
                rounded-[13px]
                bg-white
                px-5
                text-[12px]
                font-bold
                text-[#2861CF]
                shadow-[0_7px_17px_rgba(12,43,111,0.18)]
                transition-all
                hover:-translate-y-[1px]
                sm:w-auto
              "
            >
              <UserPlus size={16} />
              Assign Staff
            </button>
          ) : (
            <div
              className="
                w-full
                rounded-[15px]
                border border-white/25
                bg-white/15
                px-4 py-3
                backdrop-blur-sm
                sm:w-auto
                sm:min-w-[170px]
              "
            >
              <p className="text-[9px] font-bold uppercase tracking-wide text-white/70">
                Task Created
              </p>

              <p className="mt-1 truncate text-[15px] font-bold text-white">
                {query.taskCode}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ================= CONTENT ================= */}

      <div className="grid min-w-0 gap-5 xl:grid-cols-3">
        {/* ================= LEFT ================= */}

        <div className="min-w-0 space-y-5 xl:col-span-2">
          {/* QUERY DETAILS */}

          <div
            className="
              min-w-0
              overflow-hidden
              rounded-[23px]
              border border-[#E7EDF5]
              bg-white
              p-5
              shadow-[0_9px_28px_rgba(18,42,74,0.045)]
              sm:p-6
            "
          >
            <div
              className="
                mb-5
                flex flex-col
                gap-3
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <h3 className="text-[15px] font-bold text-[#17233D]">
                Query Details
              </h3>

              <span
                className="
                  self-start
                  rounded-full
                  bg-[#EEF5FF]
                  px-3 py-1.5
                  text-[10px]
                  font-bold
                  text-[#2E68D5]
                "
              >
                Preferred: {query.preferredContact || "—"}
              </span>
            </div>

            <div
              className="
                min-w-0
                rounded-[17px]
                bg-[#F8FAFD]
                px-4 py-4
                sm:px-5
              "
            >
              <p className="break-words text-[12px] leading-7 text-[#607089]">
                {query.description || "—"}
              </p>
            </div>

            <div
              className="
                mt-5
                grid min-w-0
                gap-5
                border-t
                border-[#EEF1F6]
                pt-5
                sm:grid-cols-2
                lg:grid-cols-3
              "
            >
              <Info label="Category" value={query.category} />

              <Info label="Product" value={query.product} />

              <Info label="Software Type" value={query.softwareType || "—"} />

              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#96A2B4]">Software Features</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {(query.softwareFeature || []).length
                    ? query.softwareFeature.map((feature) => (
                        <span key={feature} className="rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-[10px] font-bold text-violet-700">{feature}</span>
                      ))
                    : <span className="text-[12px] font-semibold text-[#8996AA]">—</span>}
                </div>
              </div>

              <Info
                label="Created"
                value={
                  query.createdAt
                    ? new Date(query.createdAt).toLocaleString("en-IN")
                    : "—"
                }
              />
            </div>

            <div className="mt-5 border-t border-[#EEF1F6] pt-5">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-[#8996AA]">Material</p>
              <div className="flex flex-wrap gap-2">
                {(query.material || []).length ? query.material.map((item, index) => {
                  const material = typeof item === "string" ? { name: item, quantity: 1 } : item;
                  return (
                    <span key={`${material.name}-${index}`} className="rounded-full border border-[#CFE0FF] bg-[#EEF5FF] px-3 py-1 text-[10px] font-bold text-[#2E68D5]">
                      {material.name} × {material.quantity || 1}
                    </span>
                  );
                }) : <span className="text-xs text-[#8996AA]">—</span>}
              </div>
            </div>
          </div>

          {/* PO / BILL / PARTY */}

          <div
            className="
              min-w-0
              overflow-hidden
              rounded-[23px]
              border border-[#E7EDF5]
              bg-white
              p-5
              shadow-[0_9px_28px_rgba(18,42,74,0.045)]
              sm:p-6
            "
          >
            <div className="mb-6 flex min-w-0 items-center gap-3">
              <div
                className="
                  flex h-10 w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-[13px]
                  bg-gradient-to-br
                  from-[#3555D7]
                  to-[#14BDE4]
                  text-white
                "
              >
                <ReceiptText size={18} />
              </div>

              <div className="min-w-0">
                <h3 className="break-words text-[15px] font-bold text-[#17233D]">
                  PO, Bill & Party Information
                </h3>

                <p className="mt-0.5 text-[10px] text-[#8996AA]">
                  Purchase order and billing details
                </p>
              </div>
            </div>

            <div
              className="
                grid min-w-0
                gap-x-7 gap-y-6
                sm:grid-cols-2
                lg:grid-cols-3
              "
            >
              <Info label="PO Number" value={party.poNumber} />

              <Info label="Bill Number" value={party.billNumber} />

              <Info
                label="Bill Date"
                value={
                  party.billDate
                    ? new Date(party.billDate).toLocaleDateString("en-IN")
                    : "—"
                }
              />

              <Info label="Party Name" value={party.partyName} />

              <Info label="Location" value={party.location} />

              <Info label="Contact Person" value={party.contactPerson} />

              <div className="min-w-0 sm:col-span-2 lg:col-span-3">
                <Info label="Address" value={party.address} />
              </div>

              <Info label="Mobile" value={party.mobileNo} />

              <Info label="Email" value={party.email} />

              <Info label="Preferred Contact" value={query.preferredContact} />
            </div>
          </div>

          {/* CONVERSATION */}

          <div
            className="
              min-w-0
              overflow-hidden
              rounded-[23px]
              border border-[#E7EDF5]
              bg-white
              p-5
              shadow-[0_9px_28px_rgba(18,42,74,0.045)]
              sm:p-6
            "
          >
            <div className="mb-5 flex items-center gap-3">
              <div
                className="
                  flex h-10 w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-[13px]
                  bg-[#ECF4FF]
                  text-[#2C70DA]
                "
              >
                <MessageSquareText size={18} />
              </div>

              <h3 className="text-[15px] font-bold text-[#17233D]">
                Conversation
              </h3>
            </div>

            {query.messages?.length ? (
              <div className="min-w-0 space-y-4">
                {query.messages.map((message) => {
                  const isCustomer = message.senderType === "customer";

                  return (
                    <div
                      key={message._id}
                      className={`
                          min-w-0
                          rounded-[17px]
                          border p-4
                          ${
                            isCustomer
                              ? `
                                border-[#E8EDF5]
                                bg-[#F8FAFD]
                              `
                              : `
                                border-[#CFE1FF]
                                bg-[#EFF6FF]
                              `
                          }
                        `}
                    >
                      <div
                        className="
                            flex min-w-0
                            flex-col gap-1
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                          "
                      >
                        <p className="truncate text-[11px] font-bold text-[#35465F]">
                          {message.senderName || message.senderType}
                        </p>

                        <p className="shrink-0 text-[9px] text-[#99A5B6]">
                          {message.createdAt
                            ? new Date(message.createdAt).toLocaleString(
                                "en-IN",
                              )
                            : ""}
                        </p>
                      </div>

                      <p className="mt-2 break-words text-[12px] leading-6 text-[#63728A]">
                        {message.message}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div
                className="
                  rounded-[18px]
                  border border-dashed
                  border-[#D9E0EB]
                  bg-[#FAFBFD]
                  py-10
                  text-center
                "
              >
                <MessageSquareText
                  size={28}
                  className="mx-auto text-[#C5CEDA]"
                />

                <p className="mt-3 text-[12px] text-[#8B98AB]">
                  No messages yet.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ================= RIGHT ================= */}

        <div className="min-w-0 space-y-5">
          {/* CUSTOMER */}

          <div
            className="
              min-w-0
              overflow-hidden
              rounded-[23px]
              border border-[#E7EDF5]
              bg-white
              p-5
              shadow-[0_9px_28px_rgba(18,42,74,0.045)]
            "
          >
            <h3 className="mb-5 text-[15px] font-bold text-[#17233D]">
              Customer
            </h3>

            <div
              className="
                mb-5
                min-w-0
                rounded-[18px]
                bg-gradient-to-r
                from-[#F2F6FF]
                to-[#ECFBFF]
                p-4
              "
            >
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className="
                    flex h-12 w-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-[15px]
                    bg-gradient-to-br
                    from-[#3555D7]
                    to-[#12B9E7]
                    text-lg
                    font-bold
                    text-white
                    shadow-md
                  "
                >
                  {(customer.name || "C")[0]?.toUpperCase()}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-[13px] font-bold text-[#263650]">
                    {customer.name || "—"}
                  </p>

                  <p className="mt-0.5 truncate text-[10px] font-medium text-[#8592A7]">
                    {customer.customerCode ||
                      customer.companyName ||
                      "Customer"}
                  </p>
                </div>
              </div>
            </div>

            <div className="min-w-0 space-y-3.5">
              <div className="flex min-w-0 items-start gap-3 text-[12px] text-[#5F6F87]">
                <Mail size={15} className="mt-0.5 shrink-0 text-[#3D83E8]" />

                <span className="min-w-0 break-all">
                  {customer.email || "—"}
                </span>
              </div>

              <div className="flex min-w-0 items-start gap-3 text-[12px] text-[#5F6F87]">
                <Phone size={15} className="mt-0.5 shrink-0 text-[#3D83E8]" />

                <span className="break-words">{customer.mobile || "—"}</span>
              </div>

              <div className="flex min-w-0 items-start gap-3 text-[12px] text-[#5F6F87]">
                <Building2
                  size={15}
                  className="mt-0.5 shrink-0 text-[#3D83E8]"
                />

                <span className="min-w-0 break-words">
                  {customer.companyName || "—"}
                </span>
              </div>

              <div className="flex min-w-0 items-start gap-3 text-[12px] text-[#5F6F87]">
                <MapPin size={15} className="mt-0.5 shrink-0 text-[#3D83E8]" />

                <span className="min-w-0 break-words">
                  {party.location || "—"}
                </span>
              </div>
            </div>
          </div>

          {/* ASSIGNMENT */}

          <div
            className="
              min-w-0
              overflow-hidden
              rounded-[23px]
              border border-[#E7EDF5]
              bg-white
              p-5
              shadow-[0_9px_28px_rgba(18,42,74,0.045)]
            "
          >
            <div className="mb-5 flex items-center gap-3">
              <div
                className="
                  flex h-10 w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-[13px]
                  bg-[#EDF5FF]
                  text-[#3377DD]
                "
              >
                <ClipboardCheck size={18} />
              </div>

              <h3 className="text-[15px] font-bold text-[#17233D]">
                Assignment
              </h3>
            </div>

            {query.taskId ? (
              <div className="min-w-0 space-y-5">
                <div
                  className="
                    min-w-0
                    rounded-[17px]
                    border border-[#CDEEDC]
                    bg-[#F0FFF8]
                    px-4 py-3
                  "
                >
                  <div className="flex items-center gap-2">
                    <UserCheck size={15} className="text-[#1BA878]" />

                    <p className="text-[9px] font-bold uppercase tracking-wide text-[#24A676]">
                      Task Created
                    </p>
                  </div>

                  <p className="mt-1.5 truncate text-[14px] font-bold text-[#16855E]">
                    {query.taskCode || "—"}
                  </p>
                </div>

                <Info label="Assigned Staff" value={assigned?.name} />

                <Info label="Staff Email" value={assigned?.email} />

                <Info
                  label="Department"
                  value={query.assignedStaff?.department}
                />

                <Info
                  label="Assigned At"
                  value={
                    query.assignedStaff?.assignedAt
                      ? new Date(query.assignedStaff.assignedAt).toLocaleString(
                          "en-IN",
                        )
                      : assigned?.pickedAt
                        ? new Date(assigned.pickedAt).toLocaleString("en-IN")
                        : "—"
                  }
                />
              </div>
            ) : (
              <div
                className="
                  rounded-[19px]
                  border border-dashed
                  border-[#CAD8EA]
                  bg-[#F8FBFF]
                  p-5
                  text-center
                "
              >
                <div
                  className="
                    mx-auto
                    flex h-12 w-12
                    items-center
                    justify-center
                    rounded-[15px]
                    bg-[#EAF3FF]
                    text-[#3779DD]
                  "
                >
                  <UserPlus size={21} />
                </div>

                <p className="mt-3 text-[12px] font-medium text-[#718099]">
                  No staff assigned yet.
                </p>

                {/* THEMED ASSIGN BUTTON */}

                <button
                  type="button"
                  onClick={() => setAssignOpen(true)}
                  className="
                    mt-4
                    inline-flex
                    h-[42px]
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-[13px]
                    bg-gradient-to-r
                    from-[#08B9D8]
                    to-[#2865E9]
                    text-[12px]
                    font-bold
                    text-white
                    shadow-[0_6px_16px_rgba(40,101,233,0.23)]
                    transition-all
                    duration-200
                    hover:-translate-y-[1px]
                    hover:shadow-[0_9px_20px_rgba(40,101,233,0.30)]
                  "
                >
                  <UserPlus size={15} />
                  Assign Staff
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= MODAL ================= */}

      <AssignStaffModal
        open={assignOpen}
        query={query}
        onClose={() => setAssignOpen(false)}
        onAssigned={({ query: updated, task }) => {
          setQuery(updated);

          setAssignOpen(false);

          showToast(
            `Task ${
              task?.taskId || updated.taskCode
            } created and assigned successfully.`,
            "success",
          );
        }}
      />
    </div>
  );
}
