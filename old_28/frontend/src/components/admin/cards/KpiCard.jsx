import { motion } from 'framer-motion'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { cn } from '../../../utils/cn'

export default function KpiCard({ title, value, icon: Icon, trend, trendUp = true, gradient, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ y: -3 }}
      className="card p-5 relative overflow-hidden group"
    >
      <div className={cn('absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-10 blur-xl transition-opacity group-hover:opacity-20', gradient)} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">{title}</p>
          <p className="font-display text-2xl font-bold text-slate-900 mt-1.5">{value}</p>
        </div>
        <div className={cn('h-11 w-11 rounded-xl flex items-center justify-center text-white shadow-sm bg-gradient-to-br', gradient)}>
          <Icon size={20} />
        </div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1 text-xs font-medium">
          {trendUp ? (
            <ArrowUpRight size={14} className="text-emerald-500" />
          ) : (
            <ArrowDownRight size={14} className="text-red-500" />
          )}
          <span className={trendUp ? 'text-emerald-600' : 'text-red-500'}>{trend}</span>
          <span className="text-slate-400">vs last month</span>
        </div>
      )}
    </motion.div>
  )
}
