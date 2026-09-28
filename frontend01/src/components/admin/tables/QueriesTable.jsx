import { Eye, ClipboardCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Badge from "../common/Badge";

const statusStyle = {
  Open: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  Assigned: "bg-sky-50 text-sky-700 ring-sky-200",
  Picked: "bg-sky-50 text-sky-700 ring-sky-200",
  "In Progress": "bg-amber-50 text-amber-700 ring-amber-200",
  Resolved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Closed: "bg-slate-100 text-slate-600 ring-slate-200",
};

const priorityStyle = {
  High: "bg-rose-50 text-rose-700 ring-rose-200",
  Medium: "bg-amber-50 text-amber-700 ring-amber-200",
  Low: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

export default function QueriesTable({ rows = [], onAssign }) {
  const navigate = useNavigate();

  const formatDate = (value) =>
    value
      ? new Date(value).toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—";

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px] text-sm">
          <thead className="bg-slate-50/80">
            <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
              <th className="px-3 py-3 font-semibold">Query</th>
              <th className="px-3 py-3 font-semibold">Customer / Party</th>
              <th className="px-3 py-3 font-semibold">Priority</th>
              <th className="px-3 py-3 font-semibold">Status</th>
              <th className="px-3 py-3 font-semibold">Task</th>
              <th className="px-3 py-3 font-semibold">Created</th>
              <th className="px-3 py-3 text-right font-semibold">Action</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((q) => {
              const queryCode = q.queryId || "Query";
              const partyName =
                q.partyDetails?.partyName ||
                q.customer?.companyName ||
                q.customer?.name ||
                "—";
              const contactName =
                q.customer?.name || q.partyDetails?.contactPerson || "";
              const taskCode = q.taskCode || "";

              return (
                <tr
                  key={q._id || q.queryId}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70"
                >
                  <td className="px-3 py-3">
                    <button
                      type="button"
                      onClick={() => navigate(`/queries/${q.queryId || q._id}`)}
                      className="font-bold text-[#09B9D7] hover:text-[#2865E9]"
                    >
                      {queryCode}
                    </button>
                    <p className="mt-1 max-w-[230px] truncate text-slate-700">
                      {q.subject || "—"}
                    </p>
                    <p className="mt-0.5 max-w-[230px] truncate text-xs text-slate-400">
                      {[q.category, q.product].filter(Boolean).join(" · ") || "Customer Query"}
                    </p>
                  </td>

                  <td className="px-3 py-3">
                    <p className="max-w-[190px] truncate font-semibold text-slate-700">
                      {partyName}
                    </p>
                    {contactName && (
                      <p className="mt-1 max-w-[190px] truncate text-xs text-slate-500">
                        {contactName}
                      </p>
                    )}
                  </td>

                  <td className="px-3 py-3">
                    <Badge className={priorityStyle[q.priority] || priorityStyle.Medium}>
                      {q.priority || "Medium"}
                    </Badge>
                  </td>

                  <td className="px-3 py-3">
                    <Badge className={statusStyle[q.status] || statusStyle.Open}>
                      {q.status || "Open"}
                    </Badge>
                  </td>

                  <td className="px-3 py-3">
                    {taskCode ? (
                      <div>
                        <p className="font-bold text-emerald-700">{taskCode}</p>
                        <p className="mt-0.5 text-xs text-slate-400">
                          {q.assignedStaff?.name || q.pickedBy?.name || "Assigned"}
                        </p>
                      </div>
                    ) : (
                      <span className="text-slate-400">Not created</span>
                    )}
                  </td>

                  <td className="px-3 py-3 whitespace-nowrap text-slate-500">
                    {formatDate(q.createdAt)}
                  </td>

                  <td className="px-3 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        title="View query"
                        onClick={() => navigate(`/queries/${q.queryId || q._id}`)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-600"
                      >
                        <Eye size={16} />
                      </button>

                      {onAssign && !q.taskId && q.status !== "Closed" && (
                        <button
                          type="button"
                          title="Assign query"
                          onClick={() => onAssign(q)}
                          className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-slate-200 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-300"
                        >
                          <ClipboardCheck size={15} />
                          Assign
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}

            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-16 text-center text-slate-400">
                  No customer queries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
