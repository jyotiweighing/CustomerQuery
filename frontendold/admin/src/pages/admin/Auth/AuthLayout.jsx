import { motion } from 'framer-motion'
import { MessagesSquare, ShieldCheck, Sparkles, BarChart3 } from 'lucide-react'

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen flex bg-slate-50">
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-600">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-blue-300 blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
              <MessagesSquare size={20} />
            </div>
            <span className="font-display text-xl font-bold">DeskFlow</span>
          </div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h2 className="font-display text-3xl font-bold leading-tight max-w-md">
              Every customer query, resolved faster and tracked in one place.
            </h2>
            <p className="text-indigo-100 mt-4 max-w-sm text-sm">
              DeskFlow gives your support team a single, calm view of tickets, staff workload, and customer health.
            </p>
            <div className="mt-8 space-y-3">
              {[
                { icon: ShieldCheck, text: 'Enterprise-grade roles & permissions' },
                { icon: BarChart3, text: 'Live analytics on response & resolution time' },
                { icon: Sparkles, text: 'Smart assignment across support staff' },
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-indigo-50">
                  <f.icon size={16} />
                  {f.text}
                </div>
              ))}
            </div>
          </motion.div>

          <p className="text-xs text-indigo-200">© 2026 DeskFlow Inc. All rights reserved.</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-sm"
        >
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <MessagesSquare size={18} className="text-white" />
            </div>
            <span className="font-display text-lg font-bold text-slate-900">DeskFlow</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-slate-900">{title}</h1>
          {subtitle && <p className="text-sm text-slate-500 mt-1.5">{subtitle}</p>}
          <div className="mt-8">{children}</div>
        </motion.div>
      </div>
    </div>
  )
}
