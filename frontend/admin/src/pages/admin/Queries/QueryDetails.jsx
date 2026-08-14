import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Paperclip, Send, UserPlus, CheckCircle2, AlertTriangle,
  Clock, Mail, Phone, Building2,
} from 'lucide-react'
import { queries, priorityColors, statusColors } from '../../../data/queries'
import Badge from '../../../components/admin/common/Badge'
import Button from '../../../components/admin/common/Button'
import AssignStaffModal from '../../../components/admin/modals/AssignStaffModal'

const timelineIcon = {
  created: Clock,
  assigned: UserPlus,
  resolved: CheckCircle2,
  escalated: AlertTriangle,
}

export default function QueryDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const initial = queries.find(q => q.id === id) || queries[0]
  const [query, setQuery] = useState(initial)
  const [note, setNote] = useState('')
  const [assignOpen, setAssignOpen] = useState(false)

  const addNote = () => {
    if (!note.trim()) return
    setQuery(prev => ({
      ...prev,
      notes: [...prev.notes, { author: 'Aiden Cole', text: note, time: 'Just now' }],
    }))
    setNote('')
  }

  return (
    <div>
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-4">
        <ArrowLeft size={15} /> Back to queries
      </button>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="font-display text-2xl font-bold text-slate-900">{query.id}</h1>
            <Badge className={priorityColors[query.priority]}>{query.priority} Priority</Badge>
            <Badge className={statusColors[query.status]}>{query.status}</Badge>
          </div>
          <p className="text-slate-500 mt-1">{query.subject}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" icon={UserPlus} onClick={() => setAssignOpen(true)}>Assign Staff</Button>
          <Button icon={CheckCircle2} onClick={() => setQuery(prev => ({ ...prev, status: 'Resolved' }))}>Mark Resolved</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <div className="card p-5">
            <h3 className="font-display font-semibold text-slate-800 mb-3">Description</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{query.description}</p>
            {query.attachments.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {query.attachments.map((a, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-600">
                    <Paperclip size={13} /> {a.name} <span className="text-slate-400">· {a.size}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card p-5">
            <h3 className="font-display font-semibold text-slate-800 mb-4">Activity Timeline</h3>
            <div className="space-y-5">
              {query.timeline.map((t, i) => {
                const Icon = timelineIcon[t.type] || Clock
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex gap-3"
                  >
                    <div className="h-8 w-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <Icon size={15} />
                    </div>
                    <div>
                      <p className="text-sm text-slate-700">{t.text}</p>
                      <p className="text-xs text-slate-400">{t.date} · {t.time}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-display font-semibold text-slate-800 mb-4">Notes</h3>
            <div className="space-y-3 mb-4">
              {query.notes.map((n, i) => (
                <div key={i} className="rounded-xl bg-slate-50 p-3">
                  <p className="text-sm text-slate-700">{n.text}</p>
                  <p className="text-xs text-slate-400 mt-1">{n.author} · {n.time}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                value={note}
                onChange={e => setNote(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addNote()}
                placeholder="Add an internal note…"
                className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-indigo-400 focus-ring"
              />
              <Button icon={Send} onClick={addNote}>Send</Button>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="card p-5">
            <h3 className="font-display font-semibold text-slate-800 mb-4">Customer</h3>
            <div className="flex items-center gap-3 mb-4">
              <img src={query.customer.avatar} alt="" className="h-12 w-12 rounded-full object-cover" />
              <div>
                <p className="text-sm font-semibold text-slate-800">{query.customer.name}</p>
                <p className="text-xs text-slate-500">{query.customer.company}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex items-center gap-2"><Mail size={14} className="text-slate-400" /> {query.customer.email}</div>
              <div className="flex items-center gap-2"><Phone size={14} className="text-slate-400" /> {query.customer.phone}</div>
              <div className="flex items-center gap-2"><Building2 size={14} className="text-slate-400" /> {query.department}</div>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-display font-semibold text-slate-800 mb-4">Assigned Staff</h3>
            {query.assignedStaff ? (
              <div className="flex items-center gap-3">
                <img src={query.assignedStaff.avatar} alt="" className="h-11 w-11 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-semibold text-slate-800">{query.assignedStaff.name}</p>
                  <p className="text-xs text-slate-500">{query.assignedStaff.department}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-400 mb-3">No one is assigned yet.</p>
            )}
            <Button variant="secondary" icon={UserPlus} className="w-full justify-center mt-4" onClick={() => setAssignOpen(true)}>
              {query.assignedStaff ? 'Reassign' : 'Assign Staff'}
            </Button>
          </div>

          <div className="card p-5">
            <h3 className="font-display font-semibold text-slate-800 mb-3">Details</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-slate-400">Created</dt><dd className="text-slate-700">{query.createdDate}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-400">Department</dt><dd className="text-slate-700">{query.department}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-400">Priority</dt><dd className="text-slate-700">{query.priority}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-400">Status</dt><dd className="text-slate-700">{query.status}</dd></div>
            </dl>
          </div>
        </div>
      </div>

      <AssignStaffModal
        open={assignOpen}
        query={query}
        onClose={() => setAssignOpen(false)}
        onAssigned={s => {
          setQuery(prev => ({ ...prev, assignedStaff: s, status: 'Assigned' }))
          setAssignOpen(false)
        }}
      />
    </div>
  )
}
