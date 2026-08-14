import { useMemo, useState } from 'react'
import { Search, Filter, Plus } from 'lucide-react'
import PageHeader from '../../../components/admin/common/PageHeader'
import Button from '../../../components/admin/common/Button'
import QueriesTable from '../../../components/admin/tables/QueriesTable'
import AssignStaffModal from '../../../components/admin/modals/AssignStaffModal'
import { queries } from '../../../data/queries'

const statusTabs = ['All', 'New', 'Assigned', 'In Progress', 'Resolved', 'Closed', 'Escalated']

export default function QueriesList() {
  const [tab, setTab] = useState('All')
  const [search, setSearch] = useState('')
  const [priority, setPriority] = useState('All')
  const [assignTarget, setAssignTarget] = useState(null)
  const [list, setList] = useState(queries)

  const filtered = useMemo(() => {
    return list.filter(q => {
      const matchesTab = tab === 'All' || q.status === tab
      const matchesPriority = priority === 'All' || q.priority === priority
      const matchesSearch =
        !search ||
        q.subject.toLowerCase().includes(search.toLowerCase()) ||
        q.customer.name.toLowerCase().includes(search.toLowerCase()) ||
        q.id.toLowerCase().includes(search.toLowerCase())
      return matchesTab && matchesPriority && matchesSearch
    })
  }, [list, tab, priority, search])

  return (
    <div>
      <PageHeader
        title="Queries"
        subtitle={`${filtered.length} of ${list.length} tickets`}
        actions={<Button icon={Plus}>New Query</Button>}
      />

      <div className="card p-2 mb-4 flex flex-wrap gap-1">
        {statusTabs.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
              tab === t ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by ticket, customer or subject…"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm focus:border-indigo-400 focus-ring"
          />
        </div>
        <div className="relative">
          <Filter size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <select
            value={priority}
            onChange={e => setPriority(e.target.value)}
            className="appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-8 text-sm text-slate-600 focus:border-indigo-400 focus-ring"
          >
            <option>All</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>
      </div>

      <QueriesTable
        rows={filtered}
        onAssign={setAssignTarget}
        onDelete={q => setList(prev => prev.filter(item => item.id !== q.id))}
      />

      <AssignStaffModal
        open={!!assignTarget}
        query={assignTarget}
        onClose={() => setAssignTarget(null)}
        onAssigned={s => {
          setList(prev => prev.map(q => q.id === assignTarget.id ? { ...q, assignedStaff: s, status: 'Assigned' } : q))
          setAssignTarget(null)
        }}
      />
    </div>
  )
}
