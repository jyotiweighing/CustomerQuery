import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { weeklyPerformance } from '../../../data/analytics'

export default function WeeklyPerformanceChart() {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-slate-800">Weekly Performance</h3>
        <span className="text-xs text-slate-400">Team score</span>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={weeklyPerformance} margin={{ left: -20 }}>
          <defs>
            <linearGradient id="perfGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#eef1f7" vertical={false} />
          <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #eef1f7', fontSize: 13 }} />
          <Area type="monotone" dataKey="performance" stroke="#3b82f6" strokeWidth={2.5} fill="url(#perfGradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
