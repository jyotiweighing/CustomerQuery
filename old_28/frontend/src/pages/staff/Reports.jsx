import { useEffect, useState } from 'react';
import { Download, FileBarChart2, Wrench, HelpCircle } from 'lucide-react';
import Layout from '../../components/staff/Layout';
import { StatusBadge, PriorityBadge } from '../../components/staff/Badge';
import MonthlyBarChart from '../../components/staff/charts/MonthlyBarChart';
import { ChartSkeleton, TableRowSkeleton } from '../../components/staff/Skeleton';
import { fetchReports } from '../../api/api';
import { useToast } from '../../context/ToastContext';

function ReportTable({ rows }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400 dark:border-slate-800">
            <th className="px-3 py-2.5">Task ID</th>
            <th className="px-3 py-2.5">Client</th>
            <th className="px-3 py-2.5">Software</th>
            <th className="px-3 py-2.5">Status</th>
            <th className="px-3 py-2.5">Priority</th>
            <th className="px-3 py-2.5">Due Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {rows.map((t) => (
            <tr key={t.id} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40">
              <td className="px-3 py-2.5 font-semibold text-brand-600">{t.id}</td>
              <td className="px-3 py-2.5 text-slate-600 dark:text-slate-300">{t.client.name}</td>
              <td className="px-3 py-2.5 text-slate-600 dark:text-slate-300">{t.software.name}</td>
              <td className="px-3 py-2.5"><StatusBadge status={t.status} /></td>
              <td className="px-3 py-2.5"><PriorityBadge priority={t.priority} /></td>
              <td className="px-3 py-2.5 text-slate-500">{t.dueDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Reports() {
  const [reports, setReports] = useState(null);
  const [tab, setTab] = useState('installation');
  const { showToast } = useToast();

  useEffect(() => { fetchReports().then(setReports); }, []);

  const handleDownload = () => {
    showToast('Preparing PDF — use your browser\u2019s print dialog to save.', 'info');
    setTimeout(() => window.print(), 400);
  };

  return (
    <Layout title="Reports" subtitle="Review monthly performance and export reports.">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-900">
          <button onClick={() => setTab('installation')} className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${tab === 'installation' ? 'bg-white text-brand-700 shadow-sm dark:bg-slate-800 dark:text-brand-400' : 'text-slate-500'}`}>
            <Wrench size={14} /> Installations
          </button>
          <button onClick={() => setTab('query')} className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${tab === 'query' ? 'bg-white text-brand-700 shadow-sm dark:bg-slate-800 dark:text-brand-400' : 'text-slate-500'}`}>
            <HelpCircle size={14} /> Queries
          </button>
        </div>
        <button onClick={handleDownload} className="btn-primary">
          <Download size={15} /> Download PDF Report
        </button>
      </div>

      <div className="glass-card mb-6 p-5 sm:p-6">
        <div className="mb-3 flex items-center gap-2">
          <FileBarChart2 size={18} className="text-brand-600" />
          <h3 className="text-base font-bold text-slate-800 dark:text-white">Monthly Completed vs Pending</h3>
        </div>
        {reports ? <MonthlyBarChart data={reports.monthlyCompleted} /> : <ChartSkeleton />}
      </div>

      <div className="glass-card p-5 sm:p-6">
        <h3 className="mb-4 text-base font-bold text-slate-800 dark:text-white">
          {tab === 'installation' ? 'Installation Reports' : 'Query Reports'}
        </h3>
        {!reports ? (
          <table className="w-full"><tbody>{Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} />)}</tbody></table>
        ) : (
          <ReportTable rows={tab === 'installation' ? reports.installationReports : reports.queryReports} />
        )}
      </div>
    </Layout>
  );
}
