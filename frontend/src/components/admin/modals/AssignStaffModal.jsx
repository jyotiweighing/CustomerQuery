import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, Search, Users, Loader2 } from "lucide-react";
import Badge from "../common/Badge";
import Button from "../common/Button";
import { getStaffList } from "../../../services/admin/staffService";
import { assignCustomerQueryToStaff } from "../../../services/admin/queryService";

export default function AssignStaffModal({ open, query, onClose, onAssigned }) {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    let mounted = true;
    setLoading(true);
    setError("");
    getStaffList()
      .then((res) => {
        if (!mounted) return;
        const list = res?.staff || res?.data || [];
        setStaff(Array.isArray(list) ? list : []);
      })
      .catch(
        (err) =>
          mounted &&
          setError(
            err?.response?.data?.message || "Unable to load staff members",
          ),
      )
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [open]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return staff.filter((s) => {
      if (!term) return true;
      return [s.name, s.email, s.designation, s.departmentname]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(term));
    });
  }, [staff, search]);

  const handleAssign = async (member) => {
    if (!query) return;
    try {
      setAssigning(member._id);
      setError("");
      const id = query.queryId || query._id;
      const result = await assignCustomerQueryToStaff(id, member._id);
      onAssigned?.(result?.data || result);
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to assign this query");
    } finally {
      setAssigning("");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
                  Customer Query Assignment
                </p>
                <h3 className="mt-1 text-xl font-bold text-slate-900">
                  Assign support staff
                </h3>
                {query && (
                  <p className="mt-1 text-sm text-slate-500">
                    {query.queryId} · {query.subject}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="relative mb-4">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search staff by name, department or email…"
                  className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                />
              </div>

              {error && (
                <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              )}

              <div className="max-h-[55vh] overflow-y-auto pr-1">
                {loading ? (
                  <div className="flex items-center justify-center gap-2 py-14 text-slate-500">
                    <Loader2 className="animate-spin" size={20} /> Loading
                    staff…
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="py-14 text-center text-slate-500">
                    <Users className="mx-auto mb-3 text-slate-300" size={34} />
                    <p>No staff found.</p>
                  </div>
                ) : (
                  <div className="grid gap-3 md:grid-cols-2">
                    {filtered.map((s) => {
                      const active = s.status === "Active";
                      return (
                        <div
                          key={s._id}
                          className="rounded-2xl border border-slate-200 p-4 transition hover:border-indigo-200 hover:bg-indigo-50/30"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 font-bold text-white">
                              {(s.name || "S").slice(0, 1).toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <p className="truncate text-sm font-bold text-slate-800">
                                  {s.name}
                                </p>
                                <Badge
                                  className={
                                    active
                                      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                                      : "bg-slate-100 text-slate-500 ring-slate-200"
                                  }
                                >
                                  {s.status || "Active"}
                                </Badge>
                              </div>
                              <p className="mt-0.5 truncate text-xs text-slate-500">
                                {s.designation || "Support Agent"} ·{" "}
                                {s.departmentname || "General"}
                              </p>
                              <p className="mt-1 truncate text-xs text-slate-400">
                                {s.email}
                              </p>
                            </div>
                          </div>
                          <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs">
                            <div className="rounded-xl bg-slate-50 py-2">
                              <p className="font-bold text-slate-800">
                                {s.assignedQueries || 0}
                              </p>
                              <p className="text-slate-400">Assigned</p>
                            </div>
                            <div className="rounded-xl bg-slate-50 py-2">
                              <p className="font-bold text-slate-800">
                                {s.resolvedQueries || 0}
                              </p>
                              <p className="text-slate-400">Resolved</p>
                            </div>
                          </div>
                          <Button
                            disabled={!active || assigning === s._id}
                            variant="secondary"
                            className="mt-4 w-full"
                            icon={assigning === s._id ? Loader2 : CheckCircle2}
                            onClick={() => handleAssign(s)}
                          >
                            {assigning === s._id
                              ? "Creating Task…"
                              : active
                                ? "Assign & Create Task"
                                : "Unavailable"}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
