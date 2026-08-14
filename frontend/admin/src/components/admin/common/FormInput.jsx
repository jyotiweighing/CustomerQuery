import { cn } from '../../../utils/cn'

export default function FormInput({ label, error, icon: Icon, className, ...props }) {
  return (
    <label className="block">
      {label && <span className="text-sm font-medium text-slate-700 mb-1.5 block">{label}</span>}
      <div className="relative">
        {Icon && <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />}
        <input
          className={cn(
            'w-full rounded-xl border border-slate-200 bg-white py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus-ring transition-colors',
            Icon ? 'pl-10 pr-3.5' : 'px-3.5',
            error && 'border-red-300',
            className
          )}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-red-500 mt-1 block">{error}</span>}
    </label>
  )
}
