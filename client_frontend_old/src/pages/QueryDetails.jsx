import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, Send, UserRound } from "lucide-react";
import { useQueries } from "../context/QueryContext";
import StatusBadge from "../components/common/StatusBadge";
const fmt = (d) =>
  new Date(d).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
export default function QueryDetails() {
  const { id } = useParams();
  const { queries, addMessage } = useQueries();
  const q = queries.find((x) => x.id === id);
  const [text, setText] = useState("");
  if (!q) return <div className="card p-12 text-center">Query not found.</div>;
  const send = () => {
    if (text.trim()) {
      addMessage(q.id, text.trim());
      setText("");
    }
  };
  return (
    <div className="space-y-5">
      <Link
        to="/queries"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600"
      >
        <ArrowLeft size={17} />
        Back to My Queries
      </Link>
      <div className="grid gap-5 xl:grid-cols-[1.65fr_.75fr]">
        <div className="space-y-5">
          <section className="card p-5 sm:p-6">
            <div className="flex flex-col justify-between gap-3 sm:flex-row">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-sky-600">{q.id}</span>
                  <StatusBadge status={q.status} />
                </div>
                <h1 className="mt-3 text-xl font-bold text-slate-900 sm:text-2xl">
                  {q.subject}
                </h1>
                <p className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                  <CalendarDays size={14} />
                  Raised {fmt(q.createdAt)}
                </p>
              </div>
              <span
                className={`h-fit rounded-lg px-3 py-1.5 text-xs font-bold ${q.priority === "High" ? "bg-rose-50 text-rose-600" : q.priority === "Medium" ? "bg-amber-50 text-amber-600" : "bg-slate-100 text-slate-600"}`}
              >
                {q.priority} Priority
              </span>
            </div>
            <div className="mt-6 rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Description
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                {q.description}
              </p>
            </div>
          </section>
          <section className="card overflow-hidden">
            <div className="border-b border-slate-100 p-5">
              <h2 className="font-bold text-slate-800">Conversation</h2>
              <p className="text-xs text-slate-500">
                Reply to the support team from here
              </p>
            </div>
            <div className="max-h-[420px] space-y-4 overflow-y-auto bg-slate-50/60 p-5">
              {!q.messages?.length && (
                <div className="py-10 text-center text-sm text-slate-400">
                  No replies yet. Our team will update you here.
                </div>
              )}
              {q.messages?.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.from === "customer" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[82%] rounded-2xl p-4 ${m.from === "customer" ? "bg-blue-600 text-white" : "border border-slate-100 bg-white text-slate-700"}`}
                  >
                    <p
                      className={`text-[11px] font-bold ${m.from === "customer" ? "text-blue-100" : "text-sky-600"}`}
                    >
                      {m.name}
                    </p>
                    <p className="mt-1 text-sm leading-6">{m.text}</p>
                    <p
                      className={`mt-2 text-[10px] ${m.from === "customer" ? "text-blue-100" : "text-slate-400"}`}
                    >
                      {m.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 border-t border-slate-100 p-4">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                className="field"
                placeholder="Type your reply..."
              />
              <button onClick={send} className="primary px-4">
                <Send size={17} />
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
          </section>
        </div>
        <aside className="space-y-5">
          <div className="card p-5">
            <h3 className="font-bold text-slate-800">Query Details</h3>
            <div className="mt-4 space-y-4 text-sm">
              {[
                ["Category", q.category],
                ["Product", q.product],
                ["Software Type", q.softwareType || "-"],
                ["Material", (q.material || []).join(", ") || "-"],
                ["Priority", q.priority],
                ["Preferred Contact", q.preferredContact || "-"],
                ["PO Number", q.partyDetails?.poNumber || "-"],
                ["Bill Number", q.partyDetails?.billNumber || "-"],
                [
                  "Bill Date",
                  q.partyDetails?.billDate ? fmt(q.partyDetails.billDate) : "-",
                ],
                ["Party Name", q.partyDetails?.partyName || "-"],
                ["Location", q.partyDetails?.location || "-"],
                ["Contact Person", q.partyDetails?.contactPerson || "-"],
                ["Mobile No.", q.partyDetails?.mobileNo || "-"],
                ["Email", q.partyDetails?.email || "-"],
                ["Last Updated", fmt(q.updatedAt)],
              ].map(([a, b]) => (
                <div key={a}>
                  <p className="text-xs text-slate-400">{a}</p>
                  <p className="mt-1 font-semibold text-slate-700">{b}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="card p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
              <UserRound size={19} />
            </div>
            <p className="mt-3 text-xs text-slate-400">Assigned To</p>
            <p className="mt-1 font-bold text-slate-800">{q.assignedTo}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
