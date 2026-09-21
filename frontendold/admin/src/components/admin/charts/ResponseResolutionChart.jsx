import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { responseVsResolutionTime } from '../../../data/analytics'

export default function ResponseResolutionChart() {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-slate-800">Response vs Resolution Time</h3>
        <span className="text-xs text-slate-400">In hours</span>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={responseVsResolutionTime} margin={{ left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eef1f7" />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #eef1f7', fontSize: 13 }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line type="monotone" dataKey="response" name="Avg Response Time" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="resolution" name="Avg Resolution Time" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
