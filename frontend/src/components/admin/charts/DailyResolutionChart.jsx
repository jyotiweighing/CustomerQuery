import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { dailyResolution } from '../../../data/analytics'

export default function DailyResolutionChart() {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-slate-800">Daily Resolutions</h3>
        <span className="text-xs text-slate-400">This week</span>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={dailyResolution} margin={{ left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eef1f7" vertical={false} />
          <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #eef1f7', fontSize: 13 }} cursor={{ fill: '#f8fafc' }} />
          <Bar dataKey="resolved" name="Resolved" fill="#4f46e5" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
