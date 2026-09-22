import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Filter, Plus, Search } from "lucide-react";
import { useQueries } from "../context/QueryContext";
import StatusBadge from "../components/common/StatusBadge";
const fmt = (d) =>
  new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
export default function Queries() {
  const { queries } = useQueries();
  const [s, setS] = useState("");
  const [status, setStatus] = useState("All");
  const list = useMemo(
    () =>
      queries.filter(
        (q) =>
          (status === "All" || q.status === status) &&
          `${q.id} ${q.subject} ${q.category}`
            .toLowerCase()
            .includes(s.toLowerCase()),
      ),
    [queries, s, status],
  );
  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Queries</h1>
          <p className="mt-1 text-sm text-slate-500">
            View and track all queries raised from your account.
          </p>
        </div>
        <Link className="primary" to="/new-query">
          <Plus size={17} />
          Raise Query
        </Link>
      </div>
      <div className="card p-4">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 px-3">
            <Search size={17} className="text-slate-400" />
            <input
              value={s}
              onChange={(e) => setS(e.target.value)}
              placeholder="Search by query ID, subject or category"
              className="w-full py-2.5 text-sm outline-none"
            />
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3">
            <Filter size={16} className="text-slate-400" />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="bg-white py-2.5 text-sm outline-none"
            >
              <option>All</option>
              <option>Open</option>
              <option>Picked</option>
              <option>In Progress</option>
              <option>Resolved</option>
              <option>Closed</option>
            </select>
          </div>
        </div>
      </div>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-50">
              <tr>
                {[
                  "Query ID",
                  "Subject",
                  "Category",
                  "Priority",
                  "Status",
                  "Last Update",
                  "",
                ].map((x) => (
                  <th
                    key={x}
                    className="whitespace-nowrap px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500"
                  >
                    {x}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {list.map((q) => (
                <tr key={q.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4 text-xs font-bold text-sky-600">
                    {q.id}
                  </td>
                  <td className="max-w-sm px-5 py-4">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {q.subject}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">{q.product}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">
                    {q.category}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-xs font-bold ${q.priority === "High" ? "text-rose-600" : q.priority === "Medium" ? "text-amber-600" : "text-slate-500"}`}
                    >
                      {q.priority}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={q.status} />
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-xs text-slate-500">
                    {fmt(q.updatedAt)}
                  </td>
                  <td className="px-5 py-4">
                    <Link
                      to={`/queries/${q.id}`}
                      className="text-xs font-bold text-blue-600"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
              {!list.length && (
                <tr>
                  <td
                    colSpan="7"
                    className="p-12 text-center text-sm text-slate-500"
                  >
                    No queries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
