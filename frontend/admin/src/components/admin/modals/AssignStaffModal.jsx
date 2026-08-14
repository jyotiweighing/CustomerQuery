import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle2 } from 'lucide-react'
import { staff } from '../../../data/staff'
import Badge from '../common/Badge'
import Button from '../common/Button'

const availabilityColor = {
  Available: 'bg-emerald-50 text-emerald-600 ring-emerald-200',
  Busy: 'bg-amber-50 text-amber-600 ring-amber-200',
  Unavailable: 'bg-slate-100 text-slate-500 ring-slate-200',
}

export default function AssignStaffModal({ open, query, onClose, onAssigned }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.18 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
              <div>
                <h3 className="font-display font-semibold text-slate-900">Assign Support Staff</h3>
                {query && <p className="text-xs text-slate-500 mt-0.5">For {query.id} — {query.subject}</p>}
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 grid gap-4 sm:grid-cols-2">
              {staff.map(s => (
                <div key={s.id} className="card p-4 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <img src={s.avatar} alt={s.name} className="h-11 w-11 rounded-full object-cover" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{s.name}</p>
                      <p className="text-xs text-slate-500 truncate">{s.department}</p>
                    </div>
                    <Badge className={`${availabilityColor[s.availability]} ml-auto`}>{s.availability}</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="rounded-lg bg-slate-50 py-1.5">
                      <p className="font-semibold text-slate-800">{s.assignedQueries}</p>
                      <p className="text-slate-400">Active</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 py-1.5">
                      <p className="font-semibold text-slate-800">{s.resolvedQueries}</p>
                      <p className="text-slate-400">Resolved</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 py-1.5">
                      <p className="font-semibold text-slate-800">{s.workload}%</p>
                      <p className="text-slate-400">Workload</p>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    className="w-full justify-center"
                    icon={CheckCircle2}
                    onClick={() => onAssigned?.(s)}
                  >
                    Assign
                  </Button>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
