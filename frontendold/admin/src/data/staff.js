export const departments = [
  { id: 'd1', name: 'Technical Support' },
  { id: 'd2', name: 'Billing' },
  { id: 'd3', name: 'Onboarding' },
  { id: 'd4', name: 'Product' },
  { id: 'd5', name: 'General Enquiries' },
]

const names = [
  'Ava Sinclair', 'Marcus Chen', 'Priya Nair', 'Diego Torres', 'Sofia Kowalski',
  'Ethan Brooks', 'Leila Haddad', 'Noah Kim', 'Grace Okafor', 'Liam Fischer',
  'Maya Patel', 'Jonas Bergström',
]

export const staff = names.map((name, i) => {
  const dept = departments[i % departments.length]
  const assigned = 4 + ((i * 7) % 18)
  const resolved = 30 + ((i * 13) % 120)
  return {
    id: `S${1000 + i}`,
    name,
    email: `${name.toLowerCase().replace(' ', '.')}@deskflow.io`,
    phone: `+1 (415) 555-${(1000 + i * 37) % 9000 + 100}`,
    department: dept.name,
    departmentId: dept.id,
    designation: i % 3 === 0 ? 'Senior Support Agent' : i % 3 === 1 ? 'Support Agent' : 'Support Lead',
    status: i % 5 === 0 ? 'On Leave' : 'Active',
    avatar: `https://i.pravatar.cc/150?img=${(i % 70) + 1}`,
    assignedQueries: assigned,
    resolvedQueries: resolved,
    performance: 70 + ((i * 5) % 30),
    availability: i % 5 === 0 ? 'Unavailable' : assigned > 15 ? 'Busy' : 'Available',
    workload: Math.min(100, Math.round((assigned / 20) * 100)),
  }
})

const companies = ['Northwind Traders', 'Contoso Ltd', 'Globex Corp', 'Initech', 'Umbrella Co', 'Wayne Enterprises', 'Stark Industries', 'Hooli', 'Soylent Corp', 'Aperture Labs']
const customerNames = ['James Whitfield', 'Amara Bello', 'Lucas Meyer', 'Chen Wei', 'Isabella Rossi', 'Omar Farouk', 'Nadia Petrova', 'Ben Carter', 'Yuki Tanaka', 'Sara Lindqvist', 'Ravi Kapoor', 'Elena Vasquez', 'Tom Whitaker', 'Fatima Zahra', 'Carlos Mendoza']

export const customers = customerNames.map((name, i) => {
  const total = 3 + ((i * 11) % 20)
  const resolved = Math.round(total * 0.7)
  const open = total - resolved
  return {
    id: `C${2000 + i}`,
    name,
    company: companies[i % companies.length],
    email: `${name.toLowerCase().replace(' ', '.')}@${companies[i % companies.length].toLowerCase().replace(/[^a-z]/g, '')}.com`,
    phone: `+1 (628) 555-${(2000 + i * 41) % 9000 + 100}`,
    totalQueries: total,
    openQueries: open,
    resolvedQueries: resolved,
    lastActivity: `2026-0${((i % 6) + 1)}-${String((i * 3) % 27 + 1).padStart(2, '0')}`,
    avatar: `https://i.pravatar.cc/150?img=${((i + 20) % 70) + 1}`,
  }
})
