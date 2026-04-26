// services/api.js
// Centralized API service layer.
// Currently uses in-memory state via AuthContext.
// Replace these stubs with real HTTP calls when a backend is ready.

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

async function request(endpoint, options = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// ── Auth ──────────────────────────────────────────────
export const authAPI = {
  login: (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  forgotPassword: (email) => request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
};

// ── Leads ─────────────────────────────────────────────
export const leadsAPI = {
  getAll: () => request('/leads'),
  create: (data) => request('/leads', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/leads/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/leads/${id}`, { method: 'DELETE' }),
};

// ── Projects ──────────────────────────────────────────
export const projectsAPI = {
  getAll: () => request('/projects'),
  create: (data) => request('/projects', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/projects/${id}`, { method: 'DELETE' }),
};

// ── Tasks ─────────────────────────────────────────────
export const tasksAPI = {
  getAll: () => request('/tasks'),
  create: (data) => request('/tasks', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/tasks/${id}`, { method: 'DELETE' }),
};

// ── Events ────────────────────────────────────────────
export const eventsAPI = {
  getAll: () => request('/events'),
  create: (data) => request('/events', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/events/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/events/${id}`, { method: 'DELETE' }),
};
