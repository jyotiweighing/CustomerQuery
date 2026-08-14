import axios from 'axios';
import {
  mockStaff,
  mockTasks,
  mockNotifications,
  mockMonthlyPerformance,
  mockWeeklyActivity,
  mockCalendarEvents,
  mockReports,
} from '../data/mockData';

// ---------------------------------------------------------------------------
// Axios instance — point baseURL at the real backend when it's ready.
// Every function below is written as if it hits a real endpoint, so swapping
// the mock implementation for `return api.get('/tasks')` etc. is a 1-line change.
// ---------------------------------------------------------------------------
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sp_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const delay = (ms = 500) => new Promise((res) => setTimeout(res, ms));
let taskStore = JSON.parse(JSON.stringify(mockTasks));

// ------------------------------- AUTH ---------------------------------------
export async function loginRequest({ email, password }) {
  await delay(700);
  if (!email || !password) throw new Error('Email and password are required.');
  if (password.length < 4) throw new Error('Invalid credentials. Please try again.');
  const token = 'demo-token-' + Date.now();
  return { token, staff: mockStaff };
}

export async function forgotPasswordRequest({ email }) {
  await delay(800);
  if (!email) throw new Error('Please enter your registered email.');
  return { message: `Password reset link sent to ${email}` };
}

// ------------------------------- STAFF ---------------------------------------
export async function fetchProfile() {
  await delay(400);
  return mockStaff;
}

export async function updateProfile(updates) {
  await delay(600);
  return { ...mockStaff, ...updates };
}

// ------------------------------- TASKS ---------------------------------------
export async function fetchTasks() {
  await delay(500);
  return taskStore;
}

export async function fetchTaskById(id) {
  await delay(400);
  const task = taskStore.find((t) => t.id === id);
  if (!task) throw new Error('Task not found');
  return task;
}

export async function updateTaskStatus(id, status) {
  await delay(500);
  taskStore = taskStore.map((t) =>
    t.id === id
      ? {
          ...t,
          status,
          progress: status === 'Completed' ? 100 : status === 'Cancelled' ? 0 : t.progress || 10,
          statusHistory: [
            ...t.statusHistory,
            { id: t.statusHistory.length + 1, status, date: new Date().toISOString().slice(0, 10), note: `Status changed to ${status}` },
          ],
        }
      : t
  );
  return taskStore.find((t) => t.id === id);
}

export async function updateTaskProgress(id, progress) {
  await delay(400);
  taskStore = taskStore.map((t) => (t.id === id ? { ...t, progress } : t));
  return taskStore.find((t) => t.id === id);
}

export async function addTaskRemark(id, note) {
  await delay(400);
  taskStore = taskStore.map((t) =>
    t.id === id
      ? { ...t, remarks: [...t.remarks, { id: t.remarks.length + 1, date: new Date().toISOString().slice(0, 10), author: mockStaff.name, note }] }
      : t
  );
  return taskStore.find((t) => t.id === id);
}

export async function uploadTaskFile(id, fileMeta) {
  await delay(700);
  taskStore = taskStore.map((t) => (t.id === id ? { ...t, attachments: [...t.attachments, fileMeta] } : t));
  return taskStore.find((t) => t.id === id);
}

// ---------------------------- DASHBOARD / CHARTS ------------------------------
export async function fetchMonthlyPerformance() {
  await delay(400);
  return mockMonthlyPerformance;
}

export async function fetchWeeklyActivity() {
  await delay(400);
  return mockWeeklyActivity;
}

// ------------------------------ NOTIFICATIONS ---------------------------------
let notificationStore = JSON.parse(JSON.stringify(mockNotifications));
export async function fetchNotifications() {
  await delay(400);
  return notificationStore;
}
export async function markNotificationRead(id) {
  await delay(200);
  notificationStore = notificationStore.map((n) => (n.id === id ? { ...n, read: true } : n));
  return notificationStore;
}
export async function markAllNotificationsRead() {
  await delay(300);
  notificationStore = notificationStore.map((n) => ({ ...n, read: true }));
  return notificationStore;
}

// --------------------------------- CALENDAR -----------------------------------
export async function fetchCalendarEvents() {
  await delay(400);
  return mockCalendarEvents;
}

// --------------------------------- REPORTS -------------------------------------
export async function fetchReports() {
  await delay(500);
  return mockReports;
}
