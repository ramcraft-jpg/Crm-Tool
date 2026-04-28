// Tasks.jsx

import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth, API } from "../context/AuthContext";
// Remove native TaskForm import, use inline below

// MODERN PROFESSIONAL TASK FORM MODAL
function TaskForm({ open, onClose, onSave, initial }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    dueDate: "",
    priority: "Medium",
    status: "Todo",
  });
  const [saving, setSaving] = useState(false);

  // Sync with props when editing/adding
  useEffect(() => {
    setForm(
      initial
        ? {
            title: initial.title || "",
            description: initial.description || "",
            assignedTo: initial.assignedTo || "",
            dueDate: initial.dueDate || "",
            priority: initial.priority || "Medium",
            status: initial.status || "Todo",
          }
        : {
            title: "",
            description: "",
            assignedTo: "",
            dueDate: "",
            priority: "Medium",
            status: "Todo",
          }
    );
  }, [initial, open]);

  const handleChange = (e) => {
    setForm((f) => ({
      ...f,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(form);
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  // == STYLES (match LeadForm modal) ==
  const MODAL_OVERLAY_STYLE = {
    position: "fixed",
    zIndex: 1010,
    left: 0,
    top: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(34, 48, 97, 0.18)",
    backdropFilter: "blur(2px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
  const MODAL_CONTAINER_STYLE = {
    background: "#fff",
    borderRadius: "18px",
    maxWidth: 570,
    width: "100%",
    minWidth: 350,
    boxShadow: "0 8px 40px rgba(32,52,92,0.16)",
    padding: "0",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    minHeight: "420px",
    maxHeight: "90vh",
    overflow: "hidden",
  };
  const MODAL_HEADER_STYLE = {
    padding: "30px 36px 14px 36px",
    borderBottom: "1px solid #f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontFamily: "inherit",
  };
  const MODAL_TITLE_STYLE = {
    fontSize: 21,
    fontWeight: 800,
    color: "#1e293b",
    margin: 0,
    letterSpacing: "-0.5px",
    lineHeight: 1.12,
    fontFamily: "inherit",
  };
  const CLOSE_BTN_STYLE = {
    appearance: "none",
    background: "transparent",
    fontSize: 24,
    fontWeight: 400,
    border: "none",
    color: "#8e99af",
    cursor: "pointer",
    marginRight: "-8px",
    outline: "none",
    lineHeight: "1",
    padding: "2px 4px",
    transition: "color 0.12s",
  };
  const MODAL_BODY_STYLE = {
    padding: "28px 36px 0 36px",
    flex: 1,
    overflowY: "auto",
  };
  const FORM_GRID_STYLE = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "26px 22px",
  };
  const FIELD_STYLE = {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    minWidth: 0,
  };
  const LABEL_STYLE = {
    color: "#475569",
    fontWeight: 700,
    fontSize: "14.2px",
    marginBottom: 2,
    letterSpacing: "-0.18px",
    lineHeight: 1.14,
    fontFamily: "inherit",
  };
  const INPUT_STYLE = {
    background: "#f8fafc",
    border: "1.12px solid #e2e8f0",
    borderRadius: "7px",
    fontSize: "15px",
    minHeight: "38px",
    padding: "8px 12px",
    color: "#29344e",
    fontWeight: 500,
    outline: "none",
    lineHeight: 1.35,
    fontFamily: "inherit",
    boxShadow: "none",
    transition: "border 0.12s",
  };
  const TEXTAREA_STYLE = {
    ...INPUT_STYLE,
    minHeight: "90px",
    resize: "vertical",
    fontSize: "15px",
    width: "100%",
    padding: "9px 12px",
    lineHeight: 1.34,
  };
  const MODAL_FOOTER_STYLE = {
    borderTop: "1px solid #f1f5f9",
    marginTop: 32,
    padding: "18px 36px",
    display: "flex",
    justifyContent: "flex-end",
    gap: 18,
    background: "#fff",
  };
  const BTN_CANCEL_STYLE = {
    background: "#f7fafc",
    color: "#64748b",
    border: "1.3px solid #e2e8f0",
    padding: "11px 28px",
    borderRadius: "8px",
    fontWeight: 700,
    fontSize: "15px",
    cursor: "pointer",
    boxShadow: "none",
    outline: "none",
    letterSpacing: "-0.1px",
    transition: "background 0.13s, color 0.13s, border 0.13s",
  };
  const BTN_SAVE_STYLE = {
    background: "linear-gradient(90deg,#2563eb,#1d4ed8 80%)",
    color: "#fff",
    border: "none",
    padding: "11px 28px",
    borderRadius: "8px",
    fontWeight: 700,
    fontSize: "15px",
    cursor: "pointer",
    boxShadow: "0 1.5px 5px rgba(37,99,235,.09)",
    outline: "none",
    letterSpacing: "-0.1px",
    transition: "background 0.14s",
    opacity: saving ? 0.7 : 1,
  };

  return (
    <div style={MODAL_OVERLAY_STYLE}>
      <form
        style={MODAL_CONTAINER_STYLE}
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        {/* HEADER */}
        <div style={MODAL_HEADER_STYLE}>
          <span style={MODAL_TITLE_STYLE}>
            {initial?._id ? "Edit Task" : "Add New Task"}
          </span>
          <button
            onClick={(e) => {
              e.preventDefault();
              onClose();
            }}
            aria-label="Close"
            style={CLOSE_BTN_STYLE}
            type="button"
            tabIndex={0}
          >
            ×
          </button>
        </div>
        {/* BODY */}
        <div style={MODAL_BODY_STYLE}>
          <div style={FORM_GRID_STYLE}>
            {/* Title */}
            <div style={FIELD_STYLE}>
              <label style={LABEL_STYLE} htmlFor="title">
                Title
              </label>
              <input
                id="title"
                name="title"
                value={form.title}
                style={INPUT_STYLE}
                maxLength={64}
                required
                autoFocus
                onChange={handleChange}
                placeholder="Task title"
                disabled={saving}
                autoComplete="off"
              />
            </div>
            {/* Assigned To */}
            <div style={FIELD_STYLE}>
              <label style={LABEL_STYLE} htmlFor="assignedTo">
                Assigned To
              </label>
              <input
                id="assignedTo"
                name="assignedTo"
                value={form.assignedTo}
                style={INPUT_STYLE}
                placeholder="Name or user"
                maxLength={48}
                onChange={handleChange}
                disabled={saving}
                autoComplete="off"
              />
            </div>
            {/* Due Date */}
            <div style={FIELD_STYLE}>
              <label style={LABEL_STYLE} htmlFor="dueDate">
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={form.dueDate}
                style={INPUT_STYLE}
                onChange={handleChange}
                disabled={saving}
                min={new Date().toISOString().split("T")[0]}
                autoComplete="off"
              />
            </div>
            {/* Priority */}
            <div style={FIELD_STYLE}>
              <label style={LABEL_STYLE} htmlFor="priority">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={form.priority}
                style={{
                  ...INPUT_STYLE,
                  minHeight: 38,
                  fontSize: "15px",
                  paddingRight: "30px",
                  appearance: "none",
                }}
                onChange={handleChange}
                disabled={saving}
                autoComplete="off"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            {/* Status */}
            <div style={FIELD_STYLE}>
              <label style={LABEL_STYLE} htmlFor="status">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={form.status}
                style={{
                  ...INPUT_STYLE,
                  minHeight: 38,
                  fontSize: "15px",
                  paddingRight: "30px",
                  appearance: "none",
                }}
                onChange={handleChange}
                disabled={saving}
                autoComplete="off"
              >
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            {/* Description */}
            <div style={{ ...FIELD_STYLE, gridColumn: "span 2" }}>
              <label style={LABEL_STYLE} htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                style={TEXTAREA_STYLE}
                maxLength={900}
                rows={6}
                placeholder="Details, context, or notes"
                onChange={handleChange}
                disabled={saving}
                autoComplete="off"
              />
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div style={MODAL_FOOTER_STYLE}>
          <button
            type="button"
            style={BTN_CANCEL_STYLE}
            onClick={onClose}
            tabIndex={0}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={BTN_SAVE_STYLE}
            disabled={saving}
            tabIndex={0}
          >
            {saving
              ? (initial?._id ? "Saving..." : "Creating...")
              : (initial?._id ? "Save Task" : "Save Task")}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function Tasks() {
  const { tasks, setTasks, showToast } = useAuth();

  const [view, setView] = useState("task");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  // FETCH TASKS
  const fetchTasks = async () => {
    setLoading(true);

    try {
      const res = await axios.get(`${API}/tasks`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setTasks(res.data);
    } catch (error) {
      console.error(error);
      showToast("Failed to load tasks", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line
  }, []);

  // FILTER TASKS
  const todo = tasks.filter((t) => t.status === "Todo");
  const inProgress = tasks.filter((t) => t.status === "In Progress");
  const completed = tasks.filter((t) => t.status === "Completed");

  // OPEN ADD
  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  // OPEN EDIT
  const openEdit = (task) => {
    setEditing({
      ...task,
      dueDate: task.dueDate
        ? new Date(task.dueDate).toISOString().split("T")[0]
        : "",
    });

    setModalOpen(true);
  };

  // SAVE TASK
  const handleSave = async (form) => {
    try {
      const payload = {
        title: form.title,
        description: form.description,
        assignedTo: form.assignedTo,
        dueDate: form.dueDate,
        priority: form.priority,
        status: form.status,
      };

      if (editing?._id) {
        await axios.put(
          `${API}/tasks/${editing._id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        showToast("Task updated successfully!", "success");
      } else {
        await axios.post(
          `${API}/tasks`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        showToast("Task created successfully!", "success");
      }

      await fetchTasks();
      setModalOpen(false);
      setEditing(null);
    } catch (error) {
      console.log(error);
      showToast(
        error.response?.data?.message || "Failed to save task",
        "danger"
      );
    }
  };

  // DELETE TASK
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      await axios.delete(`${API}/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      await fetchTasks();
      showToast("Task deleted successfully!", "success");
    } catch (error) {
      console.log(error);
      showToast("Delete failed", "danger");
    }
  };

  // TASK CARD UI (Decrease sizes)
  const renderTaskCard = (task) => (
    <div
      key={task._id}
      style={{
        background: "#fff",
        borderRadius: "8px", // reduced
        padding: "10px", // reduced
        marginBottom: "10px", // reduced
        border: "1px solid #e5e7eb",
        boxShadow:
          "0px 1px 2px rgba(16,30,54,0.03), 0px 0.5px 1px rgba(16,30,54,0.02)",
        transition: "box-shadow 0.14s",
        display: "flex",
        flexDirection: "column",
        gap: "6px" // reduced
      }}
    >
      {/* TITLE */}
      <h3
        style={{
          fontSize: "13px", // reduced
          fontWeight: 600,
          color: "#1e293b",
          marginBottom: "4px", // reduced
          letterSpacing: "-0.4px",
        }}
      >
        {task.title}
      </h3>

      {/* DESCRIPTION */}
      {task.description && (
        <div
          style={{
            marginBottom: "0px",
            fontSize: "11.5px", // reduced
            color: "#475569",
            whiteSpace: "pre-line",
            minHeight: "16px" // reduced
          }}
        >
          {task.description}
        </div>
      )}

      {/* PRIORITY + DATE */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px", // reduced
          marginBottom: "0px",
          marginTop: "3px", // reduced
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            padding: "3px 8px", // reduced
            borderRadius: "999px",
            background:
              task.priority === "High"
                ? "#fee2e2"
                : task.priority === "Medium"
                ? "#fef3c7"
                : "#dcfce7",
            color:
              task.priority === "High"
                ? "#dc2626"
                : task.priority === "Medium"
                ? "#d97706"
                : "#16a34a",
            fontSize: "11px", // reduced
            fontWeight: "600",
          }}
        >
          {task.priority}
        </span>

        {task.dueDate && (
          <span
            style={{
              fontSize: "11.5px", // reduced
              color: "#667399",
            }}
          >
            {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>

      {/* FOOTER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "4px" // reduced
        }}
      >
        {/* ASSIGNED USER */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px", // reduced
          }}
        >
          <div
            style={{
              width: "20px", // reduced
              height: "20px", // reduced
              borderRadius: "50%",
              background: "#10b981",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "9px", // reduced
              fontWeight: "700",
              letterSpacing: "0.3px"
            }}
          >
            {(task.assignedTo || "UN")
              .substring(0, 2)
              .toUpperCase()}
          </div>

          <span
            style={{
              fontSize: "11px", // reduced
              color: "#64748b",
              fontWeight: "500",
            }}
          >
            {task.assignedTo || "Unassigned"}
          </span>
        </div>

        {/* ACTIONS */}
        <div
          style={{
            display: "flex",
            gap: "5px", // reduced
          }}
        >
          <button
            onClick={() => openEdit(task)}
            style={{
              padding: "3px 8px", // reduced
              borderRadius: "5px", // reduced
              border: "1px solid #e0e7ef",
              background: "#f9fafb",
              color: "#2563eb",
              cursor: "pointer",
              fontWeight: 500,
              fontSize: "11px", // reduced
              transition: "border 0.15s"
            }}
          >
            Edit
          </button>

          <button
            onClick={() => handleDelete(task._id)}
            style={{
              padding: "3px 8px", // reduced
              borderRadius: "5px", // reduced
              border: "none",
              background: "#fee2e2",
              color: "#ef4444",
              cursor: "pointer",
              fontWeight: 500,
              fontSize: "11px" // reduced
            }}
          >
            Del
          </button>
        </div>
      </div>
    </div>
  );

  // TABLE VIEW UI (reduced sizes)
  const renderTableView = () => (
    <div style={{
      background: "#fff",
      borderRadius: "10px", // reduced
      padding: "10px", // reduced
      border: "1px solid #e2e8f0",
      minHeight: "240px", // reduced
      boxShadow:
        "0px 1px 2px rgba(16,30,54,0.03), 0px 0.5px 1px rgba(16,30,54,0.02)"
    }}>
      <h2
        style={{
          marginBottom: "10px", // reduced
          fontSize: "13.5px", // reduced
          fontWeight: "600",
          color: "#1e293b",
        }}
      >
        All Tasks
      </h2>
      {loading ? (
        <p style={{ fontSize: "11px", margin: "5px 0" }}>Loading...</p>
      ) : tasks.length === 0 ? (
        <p style={{ fontSize: "11px", margin: "5px 0" }}>No tasks</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "12px", // reduced
              color: "#374151",
              background: "#fff"
            }}
          >
            <thead>
              <tr>
                <th style={{
                  textAlign: "left",
                  borderBottom: "1px solid #e2e8f0",
                  padding: "5px" // reduced
                }}>Title</th>
                <th style={{
                  textAlign: "left",
                  borderBottom: "1px solid #e2e8f0",
                  padding: "5px"
                }}>Description</th>
                <th style={{
                  textAlign: "left",
                  borderBottom: "1px solid #e2e8f0",
                  padding: "5px"
                }}>Assigned To</th>
                <th style={{
                  textAlign: "left",
                  borderBottom: "1px solid #e2e8f0",
                  padding: "5px"
                }}>Due Date</th>
                <th style={{
                  textAlign: "left",
                  borderBottom: "1px solid #e2e8f0",
                  padding: "5px"
                }}>Priority</th>
                <th style={{
                  textAlign: "left",
                  borderBottom: "1px solid #e2e8f0",
                  padding: "5px"
                }}>Status</th>
                <th style={{
                  textAlign: "left",
                  borderBottom: "1px solid #e2e8f0",
                  padding: "5px"
                }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task._id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "5px", fontWeight: 500 }}>{task.title}</td>
                  <td style={{ padding: "5px" }}>{task.description}</td>
                  <td style={{ padding: "5px" }}>{task.assignedTo || "Unassigned"}</td>
                  <td style={{ padding: "5px" }}>
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : ""}
                  </td>
                  <td style={{ padding: "5px" }}>
                    <span
                      style={{
                        padding: "2px 6px", // reduced
                        borderRadius: "999px",
                        background:
                          task.priority === "High"
                            ? "#fee2e2"
                            : task.priority === "Medium"
                            ? "#fef3c7"
                            : "#dcfce7",
                        color:
                          task.priority === "High"
                            ? "#dc2626"
                            : task.priority === "Medium"
                            ? "#d97706"
                            : "#16a34a",
                        fontSize: "11px", // reduced
                        fontWeight: "600",
                      }}
                    >
                      {task.priority}
                    </span>
                  </td>
                  <td style={{ padding: "5px" }}>{task.status}</td>
                  <td style={{ padding: "5px" }}>
                    <button
                      onClick={() => openEdit(task)}
                      style={{
                        marginRight: "5px", // reduced
                        padding: "3px 7px", // reduced
                        borderRadius: "4px", // reduced
                        border: "1px solid #dbeafe",
                        background: "#fff",
                        color: "#475569",
                        cursor: "pointer",
                        fontSize: "10.5px" // reduced
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(task._id)}
                      style={{
                        padding: "3px 7px", // reduced
                        borderRadius: "4px", // reduced
                        border: "none",
                        background: "#fee2e2",
                        color: "#ef4444",
                        cursor: "pointer",
                        fontSize: "10.5px" // reduced
                      }}
                    >
                      Del
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  // COLUMN TITLES WITH MODERN ICON
  const kanbanColumns = [
    {
      title: (
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              fontSize: 14, // reduced
            }}
          >
            
          </span>
          <span style={{ fontSize: "13px" }}>To Do</span>
        </span>
      ),
      items: todo,
      key: "todo"
    },
    {
      title: (
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 14 }}></span>
          <span style={{ fontSize: "13px" }}>In Progress</span>
        </span>
      ),
      items: inProgress,
      key: "inprogress"
    },
    {
      title: (
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 14 }}></span>
          <span style={{ fontSize: "13px" }}>Done</span>
        </span>
      ),
      items: completed,
      key: "done"
    }
  ];

  // RESPONSIVE: 3 cols desktop, stack on mobile/tablet
  const getKanbanGridStyle = () => ({
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "14px", // reduced
    alignItems: "flex-start"
  });

  // COLUMN CARD STYLE - dynamic height, clean padding/margin, no fixed minHeight
  const kanbanColumnStyle = {
    background: "#fff",
    borderRadius: "10px", // reduced
    padding: "10px", // reduced
    border: "1px solid #e2e8f0",
    boxShadow:
      "0px 1px 2px rgba(16,30,54,0.03), 0px 0.5px 1px rgba(16,30,54,0.02)",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    minWidth: 0,
    // no minHeight!
    transition: "box-shadow 0.15s"
  };

  // Responsive, professional, premium
  return (
    <div
      style={{
        padding: "8px", // reduced
        background: "#f7fbfd",
        minHeight: "100vh",
        boxSizing: "border-box",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "14px", // reduced
        }}
      >
        <h1
          style={{
            fontSize: "15px", // reduced
            fontWeight: "800",
            color: "#1e293b",
            letterSpacing: "-0.4px",
          }}
        >
          Task Management
        </h1>

        <button
          onClick={openAdd}
          style={{
            background: "linear-gradient(90deg,#2563eb,#1d4ed8 90%)",
            color: "#fff",
            border: "none",
            padding: "7px 18px", // reduced
            borderRadius: "8px", // reduced
            cursor: "pointer",
            fontWeight: "600", // reduced
            fontSize: "12px", // reduced
            boxShadow:
              "0px 1px 2px rgba(40,86,237,0.06), 0px 0.5px 1px rgba(40,86,237,0.02)",
            transition: "background 0.15s"
          }}
        >
          + Add Task
        </button>
      </div>

      {/* TABS */}
      <div
        style={{
          display: "flex",
          gap: "8px", // reduced
          marginBottom: "12px", // reduced
        }}
      >
        <button
          onClick={() => setView("task")}
          style={{
            background: view === "task" ? "#eef4ff" : "#fff",
            border: `1.2px solid ${view === "task" ? "#2563eb" : "#dbeafe"}`, // reduced
            padding: "6px 15px", // reduced
            borderRadius: "5px", // reduced
            cursor: "pointer",
            fontWeight: 500, // reduced
            color: view === "task" ? "#2563eb" : "#475569",
            fontSize: "11.5px", // reduced
            boxShadow: view === "task" ? "0 1px 5px rgba(37,99,235,0.04)" : "none", // reduced
            transition: "all 0.13s"
          }}
        >
          Task View
        </button>

        <button
          onClick={() => setView("table")}
          style={{
            background: view === "table" ? "#eef4ff" : "#fff",
            border: `1.2px solid ${view === "table" ? "#2563eb" : "#dbeafe"}`,
            padding: "6px 15px",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: 500,
            color: view === "table" ? "#2563eb" : "#475569",
            fontSize: "11.5px",
            boxShadow: view === "table" ? "0 1px 5px rgba(37,99,235,0.04)" : "none",
            transition: "all 0.13s"
          }}
        >
          Table View
        </button>
      </div>

      {/* TASK VIEW OR TABLE VIEW */}
      {view === "task" && (
        <div style={getKanbanGridStyle()}>
          {kanbanColumns.map((column) => (
            <div key={column.key} style={kanbanColumnStyle}>
              <div
                style={{
                  marginBottom: "8px", // reduced
                  fontSize: "12.5px", // reduced
                  fontWeight: "700",
                  color: "#1e293b",
                  letterSpacing: "-0.15px",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                {column.title}
              </div>

              {loading ? (
                <div style={{ paddingTop: 7, color: "#64748b", fontSize: "11px" }}>Loading...</div>
              ) : column.items.length ? (
                column.items.map(renderTaskCard)
              ) : (
                <div style={{ color: "#64748b", fontSize: 11, padding: "10px 2px 4px 2px", textAlign: "center" }}>
                  No tasks
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* SHOW THE TABLE VIEW */}
      {view === "table" && renderTableView()}

      <TaskForm
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