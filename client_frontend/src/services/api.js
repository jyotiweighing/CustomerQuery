const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const token = localStorage.getItem('customer_token');
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export const customerApi = {
  register: (payload) => request('/customers/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => request('/customers/login', { method: 'POST', body: JSON.stringify(payload) }),
  forgotPassword: (email) => request('/customers/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  verifyOtp: (email, otp) => request('/customers/verify-otp', { method: 'POST', body: JSON.stringify({ email, otp }) }),
  resendOtp: (email) => request('/customers/resend-otp', { method: 'POST', body: JSON.stringify({ email }) }),
  resetPassword: (email, password) => request('/customers/reset-password', { method: 'POST', body: JSON.stringify({ email, password }) }),
  me: () => request('/customers/me'),
};

export const queryApi = {
  myQueries: () => request('/queries/my'),
  create: (payload) => request('/queries', { method: 'POST', body: JSON.stringify(payload) }),
  detail: (id) => request(`/queries/${id}`),
  message: (id, message) => request(`/queries/${id}/messages`, { method: 'POST', body: JSON.stringify({ message }) }),
};
