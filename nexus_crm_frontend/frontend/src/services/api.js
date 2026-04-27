// services/api.js
// Centralized API service layer for backend REST API calls.
// Includes improved "failed to fetch" error handling for debugging connection issues.

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, "");

async function request(endpoint, options = {}) {
  let response;
  try {
    response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });
  } catch (error) {
    // Network error, fetch didn't complete (CORS, DNS, server offline, etc)
    const customErr = new Error("Failed to fetch. Could not connect to server.");
    customErr.original = error;
    customErr._isFetchError = true;
    throw customErr;
  }

  // Try to read error message from backend even on non-ok
  let result;
  const isJson = response.headers.get("content-type")?.includes("application/json");
  if (isJson) {
    try {
      result = await response.json();
    } catch (e) {
      result = null;
    }
  }

  if (!response.ok) {
    // Backend might include a helpful message or "failed to fetch" notice
    const errorMsg = result?.message || `API error: ${response.status}`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.backend = result;
    throw error;
  }

  return result;
}

// ── Auth ──────────────────────────────────────────────
export const authAPI = {
  async login(email, password) {
    // Use try/catch here so UI can show fetch-level errors (like "failed to fetch").
    try {
      return await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
    } catch (err) {
      if (err._isFetchError) {
        // Custom error for network/server connection issues
        throw new Error(
          "Failed to connect to authentication service (server unavailable or CORS error)."
        );
      }
      throw err;
    }
  },
  async register(data) {
    try {
      return await request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    } catch (err) {
      if (err._isFetchError) {
        throw new Error(
          "Failed to connect to registration service (server unavailable or CORS error)."
        );
      }
      throw err;
    }
  },
  forgotPassword: (email) =>
    request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
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
