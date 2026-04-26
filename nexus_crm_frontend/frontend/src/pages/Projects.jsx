import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import ProjectForm from "../components/ProjectForm";
import { StatusBadge } from "../components/Card";

const COLORS = [
  "#2563eb",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ef4444",
  "#14b8a6",
];

export default function Projects() {
  const { projects, setProjects, showToast } = useAuth();

  const [filter, setFilter] = useState("all");
  const [view, setView] = useState("grid");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  /* FILTER */
  const filtered = projects.filter(
    (p) => filter === "all" || p.status === filter
  );

  /* OPEN ADD */
  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  /* OPEN EDIT */
  const openEdit = (project) => {
    setEditing(project);
    setModalOpen(true);
  };

  /* SAVE PROJECT */
  const handleSave = async (form) => {
    try {
      const payload = {
        title: form.title,
        client: form.client,
        status: form.status,
        startDate: form.startDate,
        endDate: form.endDate,
        progress: form.progress,
        description: form.description,
      };

      if (editing && editing._id) {
        /* UPDATE */
        const res = await fetch(
          `http://localhost:5000/api/projects/${editing._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(payload),
          }
        );

        const data = await res.json();

        setProjects((prev) =>
          prev.map((p) => (p._id === editing._id ? data : p))
        );

        showToast("Project updated successfully!", "success");
      } else {
        /* CREATE */
        const res = await fetch(
          "http://localhost:5000/api/projects",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(payload),
          }
        );

        const data = await res.json();

        setProjects((prev) => [data, ...prev]);

        showToast("Project created successfully!", "success");
      }

      setModalOpen(false);
      setEditing(null);
    } catch (error) {
      console.error(error);
      showToast("Something went wrong!", "danger");
    }
  };

  /* DELETE PROJECT */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;

    try {
      await fetch(`http://localhost:5000/api/projects/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setProjects((prev) => prev.filter((p) => p._id !== id));

      showToast("Project deleted successfully!", "success");
    } catch (error) {
      console.error(error);
      showToast("Failed to delete project", "danger");
    }
  };

  return (
    <div
      style={{
        padding: "30px",
        background: "#f5f8fc",
        minHeight: "100vh",
      }}
    >
      {/* HEADER */}
      <div className="section-header">
        <div className="section-title">Project Management</div>

        <button className="btn btn-primary" onClick={openAdd}>
          + New Project
        </button>
      </div>

      {/* FILTERS */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 18,
          alignItems: "center",
        }}
      >
        <div className="view-tabs">
          <button
            className={`view-tab${view === "grid" ? " active" : ""}`}
            onClick={() => setView("grid")}
          >
            Grid View
          </button>

          <button
            className={`view-tab${view === "table" ? " active" : ""}`}
            onClick={() => setView("table")}
          >
            Table View
          </button>
        </div>

        <div className="filters" style={{ margin: 0 }}>
          {["all", "Planning", "In Progress", "Completed"].map((f) => (
            <div
              key={f}
              className={`filter-btn${filter === f ? " active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "All" : f}
            </div>
          ))}
        </div>
      </div>

      {/* GRID VIEW */}
      {view === "grid" && (
        <div className="project-grid">
          {filtered.length ? (
            filtered.map((p, i) => (
              <div className="project-card" key={p._id}>
                <div className="project-card-header">
                  <div>
                    <div className="project-name">{p.title}</div>
                    <div className="project-client">
                      {p.client || "No client"}
                    </div>
                  </div>

                  <StatusBadge status={p.status} />
                </div>

                <div className="progress-bar-wrap">
                  <div
                    className="progress-bar"
                    style={{
                      width: `${p.progress || 0}%`,
                      background: COLORS[i % COLORS.length],
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 6,
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      color: "var(--text-3)",
                    }}
                  >
                    {p.progress || 0}% complete
                  </span>

                  <span
                    style={{
                      fontSize: 11,
                      color: "var(--text-3)",
                    }}
                  >
                    {p.priority || "Medium"}
                  </span>
                </div>

                <div className="project-meta-row">
                  <div className="project-dates">
                    📅 Due:{" "}
                    {p.endDate
                      ? new Date(p.endDate).toLocaleDateString()
                      : "No deadline"}
                  </div>

                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => openEdit(p)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(p._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div
              style={{
                gridColumn: "1/-1",
                textAlign: "center",
                padding: 48,
                color: "var(--text-3)",
              }}
            >
              <div style={{ fontSize: 40 }}>📂</div>
              <div style={{ fontSize: 14, marginTop: 12 }}>
                No projects found.
              </div>
            </div>
          )}
        </div>
      )}

      {/* TABLE VIEW */}
      {view === "table" && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Client</th>
                <th>Start Date</th>
                <th>Deadline</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length ? (
                filtered.map((p) => (
                  <tr key={p._id}>
                    <td className="td-name">{p.title}</td>
                    <td>{p.client || "—"}</td>

                    <td>
                      {p.startDate
                        ? new Date(p.startDate).toLocaleDateString()
                        : "—"}
                    </td>

                    <td>
                      {p.endDate
                        ? new Date(p.endDate).toLocaleDateString()
                        : "—"}
                    </td>

                    <td>
                      <StatusBadge status={p.status} />
                    </td>

                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          minWidth: 100,
                        }}
                      >
                        <div
                          className="progress-bar-wrap"
                          style={{ flex: 1 }}
                        >
                          <div
                            className="progress-bar"
                            style={{
                              width: `${p.progress || 0}%`,
                            }}
                          />
                        </div>

                        <span
                          style={{
                            fontSize: 11,
                            color: "var(--text-3)",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {p.progress || 0}%
                        </span>
                      </div>
                    </td>

                    <td>
                      <div className="td-actions">
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => openEdit(p)}
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(p._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">
                    <div className="empty-state">
                      <div className="empty-icon">📂</div>
                      <div className="empty-text">
                        No projects found.
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL */}
      <ProjectForm
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSave={handleSave}
        initial={editing}
      />
    </div>
  );
}