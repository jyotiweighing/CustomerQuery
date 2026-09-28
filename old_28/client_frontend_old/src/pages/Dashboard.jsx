import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  MessageSquarePlus,
  MessagesSquare,
  Plus,
  TimerReset,
} from "lucide-react";
import { useQueries } from "../context/QueryContext";
import StatusBadge from "../components/common/StatusBadge";
import { useAuth } from "../context/AuthContext";
const fmt = (d) =>
  new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
export default function Dashboard() {
  const { queries } = useQueries();
  const { customer } = useAuth();
  const stats = [
    [
      "Total Queries",
      queries.length,
      MessagesSquare,
      "bg-blue-50 text-blue-600",
    ],
    [
      "Open",
      queries.filter((q) => q.status === "Open").length,
      Clock3,
      "bg-sky-50 text-sky-600",
    ],
    [
      "In Progress",
      queries.filter((q) => q.status === "In Progress").length,
      TimerReset,
      "bg-amber-50 text-amber-600",
    ],
    [
      "Resolved",
      queries.filter((q) => ["Resolved", "Closed"].includes(q.status)).length,
      CheckCircle2,
      "bg-emerald-50 text-emerald-600",
    ],
  ];
  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#2563eb] via-[#0284c7] to-[#06b6d4] p-6 text-white shadow-lg shadow-blue-200 sm:p-8">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10" />
        <div className="relative flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold text-blue-100">
              Welcome back, {customer?.name || "Customer"}
            </p>
            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
              How can we help you today?
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-blue-50/90">
              Track existing service requests or raise a new query for
              installation, technical support, calibration and documentation.
            </p>
          </div>
          <Link
            to="/new-query"
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-700 shadow-lg"
          >
            <Plus size={18} />
            Raise New Query
          </Link>
        </div>
      </section>
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {stats.map(([t, v, I, c]) => (
          <div key={t} className="card p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {t}
                </p>
                <p className="mt-3 text-3xl font-extrabold text-slate-800">
                  {v}
                </p>
              </div>
              <div className={`rounded-xl p-3 ${c}`}>
                <I size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.65fr_.85fr]">
        <section className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 p-5">
            <div>
              <h2 className="font-bold text-slate-800">Recent Queries</h2>
              <p className="text-xs text-slate-500">
                Latest support requests from your account
              </p>
            </div>
            <Link
              to="/queries"
              className="flex items-center gap-1 text-xs font-bold text-sky-600"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {queries.slice(0, 4).map((q) => (
              <Link
                to={`/queries/${q.id}`}
                key={q.id}
                className="block p-5 transition hover:bg-slate-50"
              >
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-sky-600">
                        {q.id}
                      </span>
                      <StatusBadge status={q.status} />
                    </div>
                    <p className="mt-2 truncate font-semibold text-slate-800">
                      {q.subject}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {q.category} • {q.product}
                    </p>
                  </div>
                  <p className="shrink-0 text-xs font-medium text-slate-400">
                    {fmt(q.updatedAt)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
        <aside className="space-y-5">
          <div className="card p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
              <MessageSquarePlus />
            </div>
            <h3 className="mt-4 font-bold text-slate-800">
              Quick support request
            </h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Describe the issue, select product and priority, and submit your
              query in a few steps.
            </p>
            <Link to="/new-query" className="primary mt-5 w-full">
              Create Query
            </Link>
          </div>
          <div className="card p-5">
            <h3 className="font-bold text-slate-800">Support Hours</h3>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Mon - Sat</span>
                <b>9:30 AM - 6:30 PM</b>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Sunday</span>
                <b className="text-slate-400">Closed</b>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
