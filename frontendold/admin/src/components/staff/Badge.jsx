const statusStyles = {
  Pending: 'bg-amber-50 text-amber-600 ring-amber-200',
  'In Progress': 'bg-brand-50 text-brand-600 ring-brand-200 ',
  Completed: 'bg-emerald-50 text-emerald-600 ring-emerald-200 ',
  Cancelled: 'bg-rose-50 text-rose-600 ring-rose-200 ',
};

const priorityStyles = {
  High: 'bg-rose-50 text-rose-600 ring-rose-200 ',
  Medium: 'bg-amber-50 text-amber-600 ring-amber-200 ',
  Low: 'bg-slate-100 text-slate-600 ring-slate-200',
};

export function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyles[status] || statusStyles.Pending}`}>
      {status}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${priorityStyles[priority] || priorityStyles.Low}`}>
      {priority} Priority
    </span>
  );
}
