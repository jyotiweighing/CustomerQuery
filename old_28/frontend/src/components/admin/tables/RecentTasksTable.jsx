import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Badge from "../common/Badge";

const statusStyle = {
  Pending: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  "In Progress": "bg-amber-50 text-amber-700 ring-amber-200",
  Completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Resolved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

const priorityStyle = {
  High: "bg-rose-50 text-rose-700 ring-rose-200",
  Medium: "bg-amber-50 text-amber-700 ring-amber-200",
  Low: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

export default function RecentTasksTable({ rows = [] }) {
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
        <table className="w-full min-w-[980px] text-sm">
          <thead className="bg-slate-50/80">
            <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
              <th className="px-2 py-3 font-semibold">Query</th>
              <th className="px-2 py-3 font-semibold">Customer / Party</th>
              <th className="px-2 py-3 font-semibold">Priority</th>
              <th className="px-2 py-3 font-semibold">Status</th>
              <th className="px-2 py-3 font-semibold">Task</th>
              <th className="px-2 py-3 font-semibold">Created</th>
              <th className="px-2 py-3 text-right font-semibold">Action</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((task) => {
              const queryCode = task.sourceQueryCode || task.queryId || "—";
              const taskCode = task.taskId || task.taskCode || task._id || "—";
              const hasQuery = queryCode !== "—";
              const hasTask = taskCode !== "—";
              const partyName =
                task.partyName ||
                task.partyDetails?.partyName ||
                task.partyDetails?.contactPerson ||
                "—";

              return (
                <tr
                  key={task._id || task.taskId}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70"
                >
                  <td className="px-2 py-3">
                    {hasQuery ? (
                      <button
                        type="button"
                        onClick={() => navigate(`/queries/${queryCode}`)}
                        className="font-bold text-[#09B9D7] hover:text-[#2865E9]"
                      >
                        {queryCode}
                      </button>
                    ) : hasTask ? (
                      <button
                        type="button"
                        onClick={() => navigate(`/installation?taskId=${encodeURIComponent(taskCode)}`)}
                        className="font-bold text-emerald-700 hover:text-emerald-800"
                        title="View installation task"
                      >
                        {taskCode}
                      </button>
                    ) : (
                      <span className="font-bold text-slate-400">No Query</span>
                    )}
                    <p className="mt-1 max-w-[230px] truncate text-slate-600">
                      {task.title || "—"}
                    </p>
                  </td>

                  <td className="px-2 py-3">
                    <p className="max-w-[190px] truncate font-semibold text-slate-700">
                      {partyName}
                    </p>
                    {task.assignedStaff?.name || task.assignedStaffName ? (
                      <p className="mt-1 text-xs text-slate-400">
                        {task.assignedStaff?.name || task.assignedStaffName}
                      </p>
                    ) : null}
                  </td>

                  <td className="px-2 py-3">
                    <Badge className={priorityStyle[task.priority] || priorityStyle.Medium}>
                      {task.priority || "Medium"}
                    </Badge>
                  </td>

                  <td className="px-2 py-3">
                    <Badge className={statusStyle[task.status] || statusStyle.Pending}>
                      {task.status || "Pending"}
                    </Badge>
                  </td>

                  <td className="px-2 py-3">
                    <button
                      type="button"
                      onClick={() =>
                        hasQuery
                          ? navigate(`/queries/${queryCode}`)
                          : hasTask
                            ? navigate(`/installation?taskId=${encodeURIComponent(taskCode)}`)
                            : undefined
                      }
                      className="font-bold text-emerald-700 hover:text-emerald-800"
                    >
                      {taskCode}
                    </button>
                  </td>

                  <td className="px-2 py-3 whitespace-nowrap text-slate-500">
                    {formatDate(task.createdAt)}
                  </td>

                  <td className="px-2 py-3 text-right">
                    <button
                      type="button"
                      title="View query/task"
                      onClick={() =>
                        hasQuery
                          ? navigate(`/queries/${queryCode}`)
                          : hasTask
                            ? navigate(`/installation?taskId=${encodeURIComponent(taskCode)}`)
                            : undefined
                      }
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-600"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}

            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-16 text-center text-slate-400">
                  No recent tasks found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
