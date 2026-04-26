import { useState } from "react";
import axios from "axios";
import { useAuth, API } from "./context/AuthContext";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

/* Pages */
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import Events from "./pages/Events";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

/* Forms */
import LeadForm from "./components/LeadForm";
import ProjectForm from "./components/ProjectForm";
import TaskForm from "./components/TaskForm";
import EventForm from "./components/EventForm";

export default function App() {
  const {
    user,
    authHeader,
    setLeads,
    setProjects,
    setTasks,
    setEvents,
    showToast,
  } = useAuth();

  const [page,       setPage]       = useState("dashboard");
  const [quickModal, setQuickModal] = useState(null);

  /* ── AUTH GUARD ───────────────────────────────────────────── */
  if (!user) return <Auth />;

  /* ── DASHBOARD QUICK SAVE (hits real API) ─────────────────── */
  const handleQuickSave = {

    lead: async (form) => {
      try {
        const res = await axios.post(`${API}/leads`, form, authHeader());
        setLeads((prev) => [res.data, ...prev]);
        showToast("Lead added!", "success");
        setQuickModal(null);
      } catch (err) {
        showToast(err.response?.data?.message || "Failed to add lead", "danger");
      }
    },

    project: async (form) => {
      try {
        const res = await axios.post(`${API}/projects`, form, authHeader());
        setProjects((prev) => [res.data, ...prev]);
        showToast("Project created!", "success");
        setQuickModal(null);
      } catch (err) {
        showToast(err.response?.data?.message || "Failed to create project", "danger");
      }
    },

    task: async (form) => {
      try {
        const res = await axios.post(`${API}/tasks`, form, authHeader());
        setTasks((prev) => [res.data, ...prev]);
        showToast("Task added!", "success");
        setQuickModal(null);
      } catch (err) {
        showToast(err.response?.data?.message || "Failed to add task", "danger");
      }
    },

    event: async (form) => {
      try {
        const res = await axios.post(`${API}/events`, form, authHeader());
        setEvents((prev) => [res.data, ...prev]);
        showToast("Event scheduled!", "success");
        setQuickModal(null);
      } catch (err) {
        showToast(err.response?.data?.message || "Failed to schedule event", "danger");
      }
    },
  };

  /* ── PAGE ROUTER ──────────────────────────────────────────── */
  const renderPage = () => {
    switch (page) {
      case "dashboard": return <Dashboard onNavigate={setPage} onOpenModal={setQuickModal} />;
      case "leads":     return <Leads />;
      case "projects":  return <Projects />;
      case "tasks":     return <Tasks />;
      case "events":    return <Events />;
      case "profile":   return <Profile />;
      case "settings":  return <Settings />;
      default:          return <Dashboard onNavigate={setPage} onOpenModal={setQuickModal} />;
    }
  };

  /* ── RENDER ───────────────────────────────────────────────── */
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        background: "#f5f8fc",
      }}
    >
      {/* FIXED SIDEBAR */}
      <div
        style={{
          width: "280px",
          minWidth: "280px",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          background: "#ffffff",
          borderRight: "1px solid #e5e7eb",
          zIndex: 1000,
        }}
      >
        <Sidebar activePage={page} onNavigate={setPage} />
      </div>

      {/* RIGHT SIDE */}
      <div
        style={{
          marginLeft: "280px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {/* FIXED NAVBAR */}
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 999,
            background: "#ffffff",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <Navbar activePage={page} onNavigate={setPage} />
        </div>

        {/* SCROLLABLE CONTENT */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0" }}>
          {renderPage()}
        </div>
      </div>

      {/* QUICK ADD MODALS */}
      <LeadForm
        open={quickModal === "lead"}
        onClose={() => setQuickModal(null)}
        onSave={handleQuickSave.lead}
      />
      <ProjectForm
        open={quickModal === "project"}
        onClose={() => setQuickModal(null)}
        onSave={handleQuickSave.project}
      />
      <TaskForm
        open={quickModal === "task"}
        onClose={() => setQuickModal(null)}
        onSave={handleQuickSave.task}
      />
      <EventForm
        open={quickModal === "event"}
        onClose={() => setQuickModal(null)}
        onSave={handleQuickSave.event}
      />
    </div>
  );
}