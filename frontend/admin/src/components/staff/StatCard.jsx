export default function StatCard({ label, value, icon: Icon, tone = 'brand', trend }) {
  const tones = {
    brand: 'from-brand-500 to-brand-700 text-brand-600 bg-brand-50 ',
    emerald: 'from-emerald-500 to-emerald-700 text-emerald-600 bg-emerald-50 ',
    amber: 'from-amber-500 to-amber-600 text-amber-600 bg-amber-50 ',
    rose: 'from-rose-500 to-rose-600 text-rose-600 bg-rose-50 ',
    violet: 'from-violet-500 to-violet-600 text-violet-600 bg-violet-50 ',
    slate: 'from-slate-500 to-slate-600 text-slate-600 bg-slate-100 ',
  };
  const toneClasses = tones[tone] || tones.brand;

  return (
    <div className="glass-card group p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow">
      <div className="flex items-center justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${toneClasses.split(' ').slice(2).join(' ')}`}>
          <Icon size={20} className={toneClasses.split(' ')[2]} />
        </div>
        {trend && (
          <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600 ' : 'bg-rose-50 text-rose-600'}`}>
            {trend}
          </span>
        )}
      </div>
      <p className="mt-4 text-2xl font-extrabold text-slate-800 ">{value}</p>
      <p className="mt-0.5 text-sm font-medium text-slate-400">{label}</p>
    </div>
  );
}
