# 🚀 Nexus CRM - Backend API

A complete MERN stack backend for the Nexus CRM React frontend application.

---

## 📁 Folder Structure

```
backend/
├── config/          → MongoDB connection
├── controllers/     → Business logic for each module
├── models/          → Mongoose schemas
├── routes/          → Express route definitions
├── middleware/      → JWT auth & error handlers
├── utils/           → JWT token generator
├── .env             → Environment variables
├── server.js        → App entry point
└── package.json
```

---

## ⚙️ Setup Instructions

### 1. Install dependencies
```bash
cd backend
npm install
```

### 2. Configure `.env`
Edit the `.env` file with your real values:
```
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxx.mongodb.net/nexuscrm
JWT_SECRET=your_long_random_secret_key
PORT=5000
CLIENT_URL=http://localhost:3000
```

### 3. Start the server
```bash
# Development (with auto-restart)
npm run dev

# Production
npm start
```

---

## 🔌 API Endpoints Reference

### 🔐 Auth Routes — `/api/auth`
| Method | Route              | Access  | Description       |
|--------|--------------------|---------|-------------------|
| POST   | `/register`        | Public  | Register new user |
| POST   | `/login`           | Public  | Login, get token  |
| GET    | `/me`              | Private | Get current user  |

### 📊 Dashboard — `/api/dashboard`
| Method | Route   | Access  | Description          |
|--------|---------|---------|----------------------|
| GET    | `/stats`| Private | All dashboard stats  |

### 👥 Leads — `/api/leads`
| Method | Route  | Access  | Description       |
|--------|--------|---------|-------------------|
| GET    | `/`    | Private | Get all leads     |
| POST   | `/`    | Private | Create lead       |
| GET    | `/:id` | Private | Get single lead   |
| PUT    | `/:id` | Private | Update lead       |
| DELETE | `/:id` | Private | Delete lead       |

### 📁 Projects — `/api/projects`
| Method | Route  | Access  | Description          |
|--------|--------|---------|----------------------|
| GET    | `/`    | Private | Get all projects     |
| POST   | `/`    | Private | Create project       |
| GET    | `/:id` | Private | Get single project   |
| PUT    | `/:id` | Private | Update project       |
| DELETE | `/:id` | Private | Delete project       |

### ✅ Tasks — `/api/tasks`
| Method | Route  | Access  | Description       |
|--------|--------|---------|-------------------|
| GET    | `/`    | Private | Get all tasks     |
| POST   | `/`    | Private | Create task       |
| GET    | `/:id` | Private | Get single task   |
| PUT    | `/:id` | Private | Update task       |
| DELETE | `/:id` | Private | Delete task       |

### 📅 Events — `/api/events`
| Method | Route  | Access  | Description       |
|--------|--------|---------|-------------------|
| GET    | `/`    | Private | Get all events    |
| POST   | `/`    | Private | Create event      |
| GET    | `/:id` | Private | Get single event  |
| PUT    | `/:id` | Private | Update event      |
| DELETE | `/:id` | Private | Delete event      |

### 👤 Profile — `/api/profile`
| Method | Route             | Access  | Description          |
|--------|-------------------|---------|----------------------|
| GET    | `/`               | Private | Get profile          |
| PUT    | `/`               | Private | Update profile       |
| PUT    | `/change-password`| Private | Change password      |

---

## ⚛️ React Frontend Integration

### Step 1 — Save token after login

```js
// In your Login component
const handleLogin = async (e) => {
  e.preventDefault();
  const res = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();

  if (res.ok) {
    localStorage.setItem("token", data.token); // ← Save JWT
    localStorage.setItem("user", JSON.stringify(data));
    navigate("/dashboard");
  } else {
    alert(data.message);
  }
};
```

### Step 2 — Create an API utility (recommended)

Create `src/utils/api.js` in your React project:

```js
const API_URL = "http://localhost:5000/api";

// Get auth headers with token
const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// ── Auth ──────────────────────────────────────────
export const registerUser = (data) =>
  fetch(`${API_URL}/auth/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then(r => r.json());

export const loginUser = (data) =>
  fetch(`${API_URL}/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then(r => r.json());

// ── Dashboard ─────────────────────────────────────
export const getDashboardStats = () =>
  fetch(`${API_URL}/dashboard/stats`, { headers: authHeaders() }).then(r => r.json());

// ── Leads ─────────────────────────────────────────
export const getLeads       = ()     => fetch(`${API_URL}/leads`,      { headers: authHeaders() }).then(r => r.json());
export const createLead     = (data) => fetch(`${API_URL}/leads`,      { method: "POST",   headers: authHeaders(), body: JSON.stringify(data) }).then(r => r.json());
export const updateLead     = (id, data) => fetch(`${API_URL}/leads/${id}`, { method: "PUT",    headers: authHeaders(), body: JSON.stringify(data) }).then(r => r.json());
export const deleteLead     = (id)   => fetch(`${API_URL}/leads/${id}`,    { method: "DELETE", headers: authHeaders() }).then(r => r.json());

// ── Projects ──────────────────────────────────────
export const getProjects    = ()     => fetch(`${API_URL}/projects`,      { headers: authHeaders() }).then(r => r.json());
export const createProject  = (data) => fetch(`${API_URL}/projects`,      { method: "POST",   headers: authHeaders(), body: JSON.stringify(data) }).then(r => r.json());
export const updateProject  = (id, data) => fetch(`${API_URL}/projects/${id}`, { method: "PUT",    headers: authHeaders(), body: JSON.stringify(data) }).then(r => r.json());
export const deleteProject  = (id)   => fetch(`${API_URL}/projects/${id}`,    { method: "DELETE", headers: authHeaders() }).then(r => r.json());

// ── Tasks ─────────────────────────────────────────
export const getTasks       = ()     => fetch(`${API_URL}/tasks`,      { headers: authHeaders() }).then(r => r.json());
export const createTask     = (data) => fetch(`${API_URL}/tasks`,      { method: "POST",   headers: authHeaders(), body: JSON.stringify(data) }).then(r => r.json());
export const updateTask     = (id, data) => fetch(`${API_URL}/tasks/${id}`, { method: "PUT",    headers: authHeaders(), body: JSON.stringify(data) }).then(r => r.json());
export const deleteTask     = (id)   => fetch(`${API_URL}/tasks/${id}`,    { method: "DELETE", headers: authHeaders() }).then(r => r.json());

// ── Events ────────────────────────────────────────
export const getEvents      = ()     => fetch(`${API_URL}/events`,      { headers: authHeaders() }).then(r => r.json());
export const createEvent    = (data) => fetch(`${API_URL}/events`,      { method: "POST",   headers: authHeaders(), body: JSON.stringify(data) }).then(r => r.json());
export const updateEvent    = (id, data) => fetch(`${API_URL}/events/${id}`, { method: "PUT",    headers: authHeaders(), body: JSON.stringify(data) }).then(r => r.json());
export const deleteEvent    = (id)   => fetch(`${API_URL}/events/${id}`,    { method: "DELETE", headers: authHeaders() }).then(r => r.json());

// ── Profile ───────────────────────────────────────
export const getProfile     = ()     => fetch(`${API_URL}/profile`,             { headers: authHeaders() }).then(r => r.json());
export const updateProfile  = (data) => fetch(`${API_URL}/profile`,             { method: "PUT", headers: authHeaders(), body: JSON.stringify(data) }).then(r => r.json());
export const changePassword = (data) => fetch(`${API_URL}/profile/change-password`, { method: "PUT", headers: authHeaders(), body: JSON.stringify(data) }).then(r => r.json());
```

### Step 3 — Use in Dashboard component

```jsx
// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { getDashboardStats } from "../utils/api";

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const data = await getDashboardStats();
      setStats(data);
    };
    fetchStats();
  }, []);

  if (!stats) return <div>Loading...</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Total Leads: {stats.totalLeads}</p>
      <p>Total Projects: {stats.totalProjects}</p>
      <p>Total Tasks: {stats.totalTasks}</p>
      <p>Total Events: {stats.totalEvents}</p>

      {/* Pie Chart Data */}
      <p>New Leads: {stats.leadStatus.new}</p>
      <p>Contacted: {stats.leadStatus.contacted}</p>
      <p>Converted: {stats.leadStatus.converted}</p>

      {/* Upcoming Events */}
      {stats.upcomingEvents.map(ev => (
        <div key={ev._id}>{ev.title} — {new Date(ev.startDate).toLocaleDateString()}</div>
      ))}
    </div>
  );
};

export default Dashboard;
```

### Step 4 — Protect React Routes

```jsx
// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;

// In App.jsx:
// <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
```

---

## 🗃️ Dashboard API Response Shape

```json
{
  "totalLeads": 24,
  "totalProjects": 8,
  "totalTasks": 42,
  "totalEvents": 15,
  "leadStatus": {
    "new": 10,
    "contacted": 9,
    "converted": 5
  },
  "recentActivity": {
    "latestLead": { "name": "John Doe", "email": "...", "status": "New", "createdAt": "..." },
    "latestTask": { "title": "Fix bug", "status": "Todo", "priority": "High", "createdAt": "..." },
    "latestEvent": { "title": "Client Meeting", "type": "Meeting", "startDate": "...", "createdAt": "..." }
  },
  "upcomingEvents": [
    { "_id": "...", "title": "Demo Call", "type": "Call", "startDate": "...", "location": "Zoom" }
  ]
}
```
