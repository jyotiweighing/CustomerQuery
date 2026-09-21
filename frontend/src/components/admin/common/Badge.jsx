import { cn } from '../../../utils/cn'

export default function Badge({ children, className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset whitespace-nowrap',
        className
      )}
    >
      {children}
    </span>
  )
}
