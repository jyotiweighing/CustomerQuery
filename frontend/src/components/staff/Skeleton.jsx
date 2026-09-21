export function CardSkeleton() {
  return (
    <div className="glass-card p-5">
      <div className="skeleton h-11 w-11 rounded-xl" />
      <div className="skeleton mt-4 h-6 w-20 rounded-md" />
      <div className="skeleton mt-2 h-4 w-28 rounded-md" />
    </div>
  );
}

export function TaskCardSkeleton() {
  return (
    <div className="glass-card p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="skeleton h-5 w-40 rounded-md" />
        <div className="skeleton h-6 w-20 rounded-full" />
      </div>
      <div className="skeleton h-4 w-full rounded-md" />
      <div className="skeleton h-4 w-3/4 rounded-md" />
      <div className="flex gap-2 pt-2">
        <div className="skeleton h-8 w-24 rounded-lg" />
        <div className="skeleton h-8 w-24 rounded-lg" />
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr>
      {Array.from({ length: 6 }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="skeleton h-4 w-full rounded-md" />
        </td>
      ))}
    </tr>
  );
}

export function ChartSkeleton() {
  return <div className="skeleton h-72 w-full rounded-xl" />;
}
