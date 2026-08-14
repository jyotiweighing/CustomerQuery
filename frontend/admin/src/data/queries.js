import { staff, customers, departments } from './staff'

const subjects = [
  'Unable to reset account password',
  'Invoice amount does not match plan',
  'Feature request: dark mode for reports',
  'App crashes when exporting CSV',
  'Onboarding checklist stuck at step 3',
  'API rate limit reached unexpectedly',
  'Refund request for duplicate charge',
  'SSO login redirect loop',
  'Data not syncing across devices',
  'Question about enterprise pricing tiers',
  'Attachment upload failing silently',
  'Need help migrating from legacy plan',
  'Dashboard widgets not loading',
  'Two-factor authentication not sending codes',
  'Report export missing recent week',
  'Team seat allocation incorrect',
  'Slow response times during peak hours',
  'Cannot change billing contact email',
  'Webhook events arriving out of order',
  'Request for custom department setup',
]

const priorities = ['High', 'Medium', 'Low']
const statuses = ['New', 'Assigned', 'In Progress', 'Resolved', 'Closed', 'Escalated']

function seedRand(seed) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

export const queries = subjects.concat(subjects.map(s => s + ' (follow-up)')).map((subject, i) => {
  const rnd = seedRand(i * 97 + 13)
  const customer = customers[i % customers.length]
  const dept = departments[i % departments.length]
  const assignedStaff = staff[(i * 3) % staff.length]
  const priority = priorities[Math.floor(rnd() * priorities.length)]
  const status = statuses[Math.floor(rnd() * statuses.length)]
  const day = (i % 27) + 1
  const month = (i % 6) + 1
  return {
    id: `TKT-${5000 + i}`,
    customer,
    subject,
    description: `${customer.name} from ${customer.company} reported: "${subject}". Awaiting triage and resolution steps from the ${dept.name} team.`,
    priority,
    department: dept.name,
    assignedStaff: status === 'New' ? null : assignedStaff,
    status,
    createdDate: `2026-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    attachments: i % 4 === 0 ? [{ name: 'screenshot.png', size: '214 KB' }] : [],
    notes: [
      { author: 'System', text: 'Ticket created from customer email.', time: '09:12 AM' },
    ],
    timeline: [
      { type: 'created', text: 'Query received from customer', time: '09:12 AM', date: `2026-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}` },
      ...(status !== 'New' ? [{ type: 'assigned', text: `Assigned to ${assignedStaff.name}`, time: '10:04 AM', date: `2026-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}` }] : []),
      ...(status === 'Resolved' || status === 'Closed' ? [{ type: 'resolved', text: 'Marked as resolved', time: '02:41 PM', date: `2026-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}` }] : []),
      ...(status === 'Escalated' ? [{ type: 'escalated', text: 'Escalated to senior support lead', time: '11:30 AM', date: `2026-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}` }] : []),
    ],
  }
})

export const priorityColors = {
  High: 'bg-red-50 text-red-600 ring-red-200',
  Medium: 'bg-orange-50 text-orange-600 ring-orange-200',
  Low: 'bg-emerald-50 text-emerald-600 ring-emerald-200',
}

export const statusColors = {
  New: 'bg-blue-50 text-blue-600 ring-blue-200',
  Assigned: 'bg-indigo-50 text-indigo-600 ring-indigo-200',
  'In Progress': 'bg-amber-50 text-amber-600 ring-amber-200',
  Resolved: 'bg-emerald-50 text-emerald-600 ring-emerald-200',
  Closed: 'bg-slate-100 text-slate-600 ring-slate-200',
  Escalated: 'bg-rose-50 text-rose-600 ring-rose-200',
}
