import { Eye, UserPlus, Pencil, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Badge from '../common/Badge';

export default function QueriesTable({ rows = [] }) {
  const navigate = useNavigate();

  // Safe Helper to Format MongoDB Dates
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const parsedDate = new Date(dateStr);
      if (isNaN(parsedDate.getTime())) return dateStr;

      return parsedDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // Dynamic Status Badge Colors
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'resolved':
      case 'completed':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'pending':
      case 'in progress':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'assigned':
        return 'bg-sky-100 text-sky-700 border-sky-200';
      case 'escalated':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      default:
        return 'bg-indigo-100 text-indigo-700 border-indigo-200';
    }
  };

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
              <th className="px-4 py-3 font-medium">Task ID</th>
              <th className="px-4 py-3 font-medium">Subject</th>
              <th className="px-4 py-3 font-medium">Department</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((q) => {
              // Safe extraction of MongoDB / Task ID
              const id = q._id || q.taskId || q.id;

              // Status Fallback
              const status = q.status || 'New';

              return (
                <tr
                  key={id}
                  className="border-b border-slate-50 last:border-0 hover:bg-slate-50/70 transition-colors"
                >
                  {/* Task ID Link */}
                  <td className="px-4 py-3 font-medium text-indigo-600 whitespace-nowrap">
                    <Link to={`/installation?id=${id}`}>
                      {q.taskId || `#${typeof id === 'string' && id.length > 8 ? id.slice(-6).toUpperCase() : id}`}
                    </Link>
                  </td>

                  {/* Subject */}
                  <td className="px-4 py-3 max-w-[220px] truncate text-slate-600">
                    {q.subject || q.title || 'No Subject'}
                  </td>

                  {/* Department */}
                  <td className="px-4 py-3 whitespace-nowrap text-slate-600">
                    {typeof q.department === 'object' ? q.department?.name : q.department || 'General'}
                  </td>

                  {/* Status Badge */}
                  <td className="px-4 py-3">
                    <Badge className={getStatusStyle(status)}>{status}</Badge>
                  </td>

                  {/* Created Date */}
                  <td className="px-4 py-3 whitespace-nowrap text-slate-500">
                    {formatDate(q.createdAt || q.createdDate)}
                  </td>

                  {/* Action Buttons */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {/* 1. VIEW ICON: Installation page par Detail Card kholega */}
                      <button
                        onClick={() => navigate(`/installation?id=${id}`)}
                        className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                        title="View Detail Card"
                      >
                        <Eye size={15} />
                      </button>

                      {/* 2. USER/ASSIGN ICON: /staff par navigate karega */}
                      <button
                        onClick={() => navigate('/staff')}
                        className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        title="Go to Staff Page"
                      >
                        <UserPlus size={15} />
                      </button>

                      {/* 3. EDIT ICON: Installation page me task detail card par bhejega */}
                      <button
                        onClick={() => navigate(`/installation?id=${id}&action=edit`)}
                        className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                        title="Edit in Installation Page"
                      >
                        <Pencil size={15} />
                      </button>

                      {/* 4. DELETE ICON: Installation page me task detail card par bhejega */}
                      <button
                        onClick={() => navigate(`/installation?id=${id}&action=delete`)}
                        className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="Delete in Installation Page"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {/* Empty State */}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                  No queries match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}