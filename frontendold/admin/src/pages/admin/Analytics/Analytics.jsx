import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  AreaChart, Area, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from 'recharts'
import PageHeader from '../../../components/admin/common/PageHeader'
import {
  responseVsResolutionTime, peakHours, departmentComparison, staffPerformanceRadar, monthlyQueries,
} from '../../../data/analytics'

export default function Analytics() {
  return (
    <div>
      <PageHeader title="Analytics" subtitle="Deep-dive into support desk performance trends" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <div className="card p-5">
          <h3 className="font-display font-semibold text-slate-800 mb-4">Response Time vs Resolution Time</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={responseVsResolutionTime} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef1f7" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #eef1f7', fontSize: 13 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="response" name="Response (hrs)" stroke="#f59e0b" strokeWidth={2.5} />
              <Line type="monotone" dataKey="resolution" name="Resolution (hrs)" stroke="#10b981" strokeWidth={2.5} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="font-display font-semibold text-slate-800 mb-4">Query Trends</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={monthlyQueries} margin={{ left: -20 }}>
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef1f7" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #eef1f7', fontSize: 13 }} />
              <Area type="monotone" dataKey="queries" stroke="#4f46e5" strokeWidth={2.5} fill="url(#trendGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <div className="card p-5">
          <h3 className="font-display font-semibold text-slate-800 mb-4">Peak Hours</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={peakHours} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef1f7" vertical={false} />
              <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #eef1f7', fontSize: 13 }} cursor={{ fill: '#f8fafc' }} />
              <Bar dataKey="volume" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="font-display font-semibold text-slate-800 mb-4">Department Comparison</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={departmentComparison} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef1f7" vertical={false} />
              <XAxis dataKey="department" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #eef1f7', fontSize: 13 }} cursor={{ fill: '#f8fafc' }} />
              <Bar dataKey="queries" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="card p-5">
          <h3 className="font-display font-semibold text-slate-800 mb-4">Staff Performance</h3>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={staffPerformanceRadar}>
              <PolarGrid stroke="#eef1f7" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12, fill: '#64748b' }} />
              <PolarRadiusAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <Radar dataKey="value" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.25} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5 flex flex-col justify-center gap-4">
          <h3 className="font-display font-semibold text-slate-800">Customer Satisfaction</h3>
          {departmentComparison.map(d => (
            <div key={d.department}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600">{d.department}</span>
                <span className="font-semibold text-slate-800">{d.satisfaction} / 5</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400" style={{ width: `${(d.satisfaction / 5) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
