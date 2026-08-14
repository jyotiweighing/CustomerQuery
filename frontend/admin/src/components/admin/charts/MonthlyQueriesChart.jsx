import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { monthlyQueries } from '../../../data/analytics'

export default function MonthlyQueriesChart() {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-slate-800">Monthly Queries</h3>
        <span className="text-xs text-slate-400">Last 7 months</span>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={monthlyQueries} margin={{ left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eef1f7" />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #eef1f7', fontSize: 13 }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line type="monotone" dataKey="queries" name="Total Queries" stroke="#4f46e5" strokeWidth={2.5} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="resolved" name="Resolved" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
