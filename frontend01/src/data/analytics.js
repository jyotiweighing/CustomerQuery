export const monthlyQueries = [
  { month: 'Jan', queries: 320, resolved: 290 },
  { month: 'Feb', queries: 380, resolved: 340 },
  { month: 'Mar', queries: 410, resolved: 360 },
  { month: 'Apr', queries: 390, resolved: 355 },
  { month: 'May', queries: 460, resolved: 410 },
  { month: 'Jun', queries: 512, resolved: 470 },
  { month: 'Jul', queries: 486, resolved: 452 },
]

export const queryStatusSplit = [
  { name: 'New', value: 84, color: '#3b82f6' },
  { name: 'Assigned', value: 62, color: '#6366f1' },
  { name: 'In Progress', value: 98, color: '#f59e0b' },
  { name: 'Resolved', value: 214, color: '#10b981' },
  { name: 'Closed', value: 76, color: '#94a3b8' },
  { name: 'Escalated', value: 22, color: '#f43f5e' },
]

export const dailyResolution = [
  { day: 'Mon', resolved: 38 },
  { day: 'Tue', resolved: 45 },
  { day: 'Wed', resolved: 41 },
  { day: 'Thu', resolved: 52 },
  { day: 'Fri', resolved: 48 },
  { day: 'Sat', resolved: 21 },
  { day: 'Sun', resolved: 15 },
]

export const weeklyPerformance = [
  { week: 'W1', performance: 72 },
  { week: 'W2', performance: 78 },
  { week: 'W3', performance: 75 },
  { week: 'W4', performance: 84 },
  { week: 'W5', performance: 88 },
  { week: 'W6', performance: 91 },
]

export const responseVsResolutionTime = [
  { month: 'Jan', response: 18, resolution: 6.2 },
  { month: 'Feb', response: 16, resolution: 5.8 },
  { month: 'Mar', response: 15, resolution: 5.5 },
  { month: 'Apr', response: 14, resolution: 5.1 },
  { month: 'May', response: 12, resolution: 4.6 },
  { month: 'Jun', response: 11, resolution: 4.2 },
  { month: 'Jul', response: 10, resolution: 4.0 },
]

export const peakHours = [
  { hour: '8am', volume: 22 }, { hour: '9am', volume: 41 }, { hour: '10am', volume: 58 },
  { hour: '11am', volume: 64 }, { hour: '12pm', volume: 48 }, { hour: '1pm', volume: 39 },
  { hour: '2pm', volume: 55 }, { hour: '3pm', volume: 61 }, { hour: '4pm', volume: 47 },
  { hour: '5pm', volume: 30 },
]

export const departmentComparison = [
  { department: 'Technical', queries: 210, satisfaction: 4.3 },
  { department: 'Billing', queries: 140, satisfaction: 4.1 },
  { department: 'Onboarding', queries: 95, satisfaction: 4.6 },
  { department: 'Product', queries: 120, satisfaction: 4.2 },
  { department: 'General', queries: 88, satisfaction: 4.4 },
]

export const staffPerformanceRadar = [
  { metric: 'Speed', value: 82 },
  { metric: 'Quality', value: 88 },
  { metric: 'Volume', value: 74 },
  { metric: 'CSAT', value: 91 },
  { metric: 'Consistency', value: 79 },
]

export const notifications = [
  { id: 1, type: 'new', title: 'New query received', desc: 'TKT-5012 from Isabella Rossi', time: '2m ago', unread: true },
  { id: 2, type: 'assigned', title: 'Query assigned to you', desc: 'TKT-5008 assigned to Priya Nair', time: '18m ago', unread: true },
  { id: 3, type: 'resolved', title: 'Query resolved', desc: 'TKT-4998 marked resolved by Marcus Chen', time: '1h ago', unread: true },
  { id: 4, type: 'escalated', title: 'Query escalated', desc: 'TKT-4991 escalated — billing dispute', time: '3h ago', unread: false },
  { id: 5, type: 'new', title: 'New query received', desc: 'TKT-4985 from Ben Carter', time: '5h ago', unread: false },
  { id: 6, type: 'resolved', title: 'Query resolved', desc: 'TKT-4972 marked resolved by Ava Sinclair', time: 'Yesterday', unread: false },
]
