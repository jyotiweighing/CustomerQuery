// Central dummy dataset. Swap this file's contents for real API responses
// when the backend is ready — every consumer goes through src/api/api.js.

export const mockStaff = {
  id: 'EMP-2041',
  name: 'Aditi Sharma',
  email: 'aditi.sharma@company.com',
  phone: '+91 98765 43210',
  designation: 'Senior Support Engineer',
  department: 'Installations & Support',
  employeeId: 'EMP-2041',
  joiningDate: '2022-03-14',
  address: 'C-402, Shanti Residency, Bhopal, Madhya Pradesh, 462001',
  avatar: 'https://i.pravatar.cc/150?img=47',
  rating: 4.6,
};

const softwareList = ['TallyPrime', 'Marg ERP', 'Busy Accounting', 'Zoho Books', 'QuickBooks', 'SAP B1', 'GST Suvidha Suite'];
const priorities = ['High', 'Medium', 'Low'];
const statuses = ['Pending', 'In Progress', 'Completed', 'Cancelled'];
const salesPeople = ['Rohit Verma', 'Neha Kapoor', 'Sameer Khan', 'Priya Iyer'];
const cities = ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain'];

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function pick(arr, rnd) {
  return arr[Math.floor(rnd() * arr.length)];
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export const mockTasks = Array.from({ length: 26 }).map((_, i) => {
  const rnd = seededRandom(i * 17 + 3);
  const isQuery = rnd() > 0.6;
  const assigned = addDays('2026-06-20', Math.floor(rnd() * 30));
  const due = addDays(assigned, 3 + Math.floor(rnd() * 10));
  const status = pick(statuses, rnd);
  const progress = status === 'Completed' ? 100 : status === 'In Progress' ? 20 + Math.floor(rnd() * 60) : status === 'Cancelled' ? 0 : 0;

  return {
    id: `TSK-${1000 + i}`,
    title: isQuery ? `Query Resolution - ${pick(softwareList, rnd)}` : `New Installation - ${pick(softwareList, rnd)}`,
    type: isQuery ? 'Query' : 'Installation',
    client: {
      name: `${pick(['Sharma', 'Verma', 'Patel', 'Singh', 'Gupta', 'Malhotra', 'Reddy'], rnd)} ${pick(['Traders', 'Enterprises', 'Industries', 'Solutions', 'Retail Hub'], rnd)}`,
      contact: `${pick(['Rakesh', 'Anita', 'Vikram', 'Sunita', 'Manoj'], rnd)} ${pick(['Jain', 'Yadav', 'Chauhan', 'Bhatia'], rnd)}`,
      mobile: `+91 9${Math.floor(100000000 + rnd() * 899999999)}`,
      alternate: `+91 8${Math.floor(100000000 + rnd() * 899999999)}`,
      email: `client${i}@business.com`,
      address: `${Math.floor(rnd() * 200) + 1}, MG Road, ${pick(cities, rnd)}`,
      location: pick(cities, rnd),
    },
    software: {
      name: pick(softwareList, rnd),
      type: pick(['New License', 'Renewal', 'Upgrade', 'Migration'], rnd),
      amount: (5000 + Math.floor(rnd() * 45000)),
    },
    poNumber: `PO-${20240 + i}`,
    billNumber: `BILL-${5500 + i}`,
    billDate: assigned,
    installationDate: due,
    assignedDate: assigned,
    dueDate: due,
    priority: pick(priorities, rnd),
    status,
    progress,
    description: isQuery
      ? 'Client reported issue while generating GST reports. Needs diagnosis and resolution on priority.'
      : 'Fresh installation and configuration required at client premises, including data migration and staff training.',
    salesPerson: pick(salesPeople, rnd),
    estimatedTime: `${2 + Math.floor(rnd() * 6)} hrs`,
    remarks: [
      { id: 1, date: assigned, author: mockStaff.name, note: 'Task assigned and reviewed. Contacted client to confirm schedule.' },
    ],
    statusHistory: [
      { id: 1, status: 'Pending', date: assigned, note: 'Task created and assigned to staff.' },
      ...(status !== 'Pending' ? [{ id: 2, status: 'In Progress', date: addDays(assigned, 1), note: 'Work started at client site.' }] : []),
      ...(status === 'Completed' ? [{ id: 3, status: 'Completed', date: due, note: 'Installation completed and verified with client.' }] : []),
      ...(status === 'Cancelled' ? [{ id: 3, status: 'Cancelled', date: due, note: 'Task cancelled as per client request.' }] : []),
    ],
    attachments: [],
  };
});

export const mockNotifications = [
  { id: 1, type: 'assigned', title: 'New Task Assigned', message: 'You have been assigned a new TallyPrime installation for Sharma Traders.', time: '10 min ago', read: false },
  { id: 2, type: 'due', title: 'Due Today', message: 'Task TSK-1004 (Marg ERP query) is due today by 6:00 PM.', time: '1 hr ago', read: false },
  { id: 3, type: 'overdue', title: 'Overdue Task', message: 'Task TSK-1011 crossed its due date. Please update status.', time: '3 hrs ago', read: false },
  { id: 4, type: 'status', title: 'Status Updated', message: 'Admin marked TSK-1002 as verified after your completion.', time: 'Yesterday', read: true },
  { id: 5, type: 'admin', title: 'Message from Admin', message: 'Please carry signed copies of the AMC renewal forms for tomorrow\u2019s visits.', time: '2 days ago', read: true },
  { id: 6, type: 'assigned', title: 'New Task Assigned', message: 'QuickBooks upgrade task assigned for Reddy Enterprises.', time: '2 days ago', read: true },
];

export const mockMonthlyPerformance = [
  { month: 'Feb', completed: 18, assigned: 22 },
  { month: 'Mar', completed: 24, assigned: 27 },
  { month: 'Apr', completed: 21, assigned: 25 },
  { month: 'May', completed: 29, assigned: 31 },
  { month: 'Jun', completed: 26, assigned: 28 },
  { month: 'Jul', completed: 14, assigned: 20 },
];

export const mockWeeklyActivity = [
  { day: 'Mon', tasks: 5 },
  { day: 'Tue', tasks: 7 },
  { day: 'Wed', tasks: 4 },
  { day: 'Thu', tasks: 8 },
  { day: 'Fri', tasks: 6 },
  { day: 'Sat', tasks: 3 },
  { day: 'Sun', tasks: 1 },
];

export const mockCalendarEvents = [
  { id: 1, date: '2026-07-11', title: 'Installation - Malhotra Industries', type: 'installation' },
  { id: 2, date: '2026-07-13', title: 'Deadline - TSK-1006', type: 'deadline' },
  { id: 3, date: '2026-07-14', title: 'Team Sync Meeting', type: 'meeting' },
  { id: 4, date: '2026-07-17', title: 'Muharram (Holiday)', type: 'holiday' },
  { id: 5, date: '2026-07-20', title: 'Installation - Gupta Retail Hub', type: 'installation' },
  { id: 6, date: '2026-07-22', title: 'Deadline - TSK-1013', type: 'deadline' },
];

export const mockReports = {
  monthlyCompleted: mockMonthlyPerformance,
  installationReports: mockTasks.filter((t) => t.type === 'Installation').slice(0, 8),
  queryReports: mockTasks.filter((t) => t.type === 'Query').slice(0, 8),
};
