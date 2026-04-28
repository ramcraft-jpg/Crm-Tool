// Tasks.jsx

import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth, API } from "../context/AuthContext";
import TaskForm from "../components/TaskForm";

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

  // TASK CARD UI
  const renderTaskCard = (task) => (
    <div
      key={task._id}
      style={{
        background: "#fff",
        borderRadius: "14px",
        padding: "18px",
        marginBottom: "16px",
        border: "1px solid #e5e7eb",
        boxShadow:
          "0px 1px 2px rgba(16,30,54,0.03), 0px 0.5px 1px rgba(16,30,54,0.02)",
        transition: "box-shadow 0.14s",
        display: "flex",
        flexDirection: "column",
        gap: "10px"
      }}
    >
      {/* TITLE */}
      <h3
        style={{
          fontSize: "16px",
          fontWeight: 600,
          color: "#1e293b",
          marginBottom: "8px",
          letterSpacing: "-0.5px",
        }}
      >
        {task.title}
      </h3>

      {/* DESCRIPTION */}
      {task.description && (
        <div
          style={{
            marginBottom: "0px",
            fontSize: "14px",
            color: "#475569",
            whiteSpace: "pre-line",
            minHeight: "22px"
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
          gap: "12px",
          marginBottom: "0px",
          marginTop: "6px",
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            padding: "5px 14px",
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
            fontSize: "13px",
            fontWeight: "600",
          }}
        >
          {task.priority}
        </span>

        {task.dueDate && (
          <span
            style={{
              fontSize: "14px",
              color: "#667399",
            }}
          >
            📅 {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>

      {/* FOOTER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "10px"
        }}
      >
        {/* ASSIGNED USER */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              background: "#10b981",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              fontWeight: "700",
              letterSpacing: "0.5px"
            }}
          >
            {(task.assignedTo || "UN")
              .substring(0, 2)
              .toUpperCase()}
          </div>

          <span
            style={{
              fontSize: "14px",
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
            gap: "8px",
          }}
        >
          <button
            onClick={() => openEdit(task)}
            style={{
              padding: "6px 14px",
              borderRadius: "8px",
              border: "1px solid #e0e7ef",
              background: "#f9fafb",
              color: "#2563eb",
              cursor: "pointer",
              fontWeight: 500,
              fontSize: "13px",
              transition: "border 0.15s"
            }}
          >
            Edit
          </button>

          <button
            onClick={() => handleDelete(task._id)}
            style={{
              padding: "6px 14px",
              borderRadius: "8px",
              border: "none",
              background: "#fee2e2",
              color: "#ef4444",
              cursor: "pointer",
              fontWeight: 500,
              fontSize: "13px"
            }}
          >
            Del
          </button>
        </div>
      </div>
    </div>
  );

  // TABLE VIEW UI (kept the same)
  const renderTableView = () => (
    <div style={{
      background: "#fff",
      borderRadius: "18px",
      padding: "18px",
      border: "1px solid #e2e8f0",
      minHeight: "420px",
      boxShadow:
        "0px 1px 2px rgba(16,30,54,0.03), 0px 0.5px 1px rgba(16,30,54,0.02)"
    }}>
      <h2
        style={{
          marginBottom: "18px",
          fontSize: "16px",
          fontWeight: "600",
          color: "#1e293b",
        }}
      >
        All Tasks
      </h2>
      {loading ? (
        <p>Loading...</p>
      ) : tasks.length === 0 ? (
        <p>No tasks</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "15px",
              color: "#374151",
              background: "#fff"
            }}
          >
            <thead>
              <tr>
                <th style={{
                  textAlign: "left",
                  borderBottom: "1px solid #e2e8f0",
                  padding: "8px"
                }}>Title</th>
                <th style={{
                  textAlign: "left",
                  borderBottom: "1px solid #e2e8f0",
                  padding: "8px"
                }}>Description</th>
                <th style={{
                  textAlign: "left",
                  borderBottom: "1px solid #e2e8f0",
                  padding: "8px"
                }}>Assigned To</th>
                <th style={{
                  textAlign: "left",
                  borderBottom: "1px solid #e2e8f0",
                  padding: "8px"
                }}>Due Date</th>
                <th style={{
                  textAlign: "left",
                  borderBottom: "1px solid #e2e8f0",
                  padding: "8px"
                }}>Priority</th>
                <th style={{
                  textAlign: "left",
                  borderBottom: "1px solid #e2e8f0",
                  padding: "8px"
                }}>Status</th>
                <th style={{
                  textAlign: "left",
                  borderBottom: "1px solid #e2e8f0",
                  padding: "8px"
                }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task._id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "8px", fontWeight: 500 }}>{task.title}</td>
                  <td style={{ padding: "8px" }}>{task.description}</td>
                  <td style={{ padding: "8px" }}>{task.assignedTo || "Unassigned"}</td>
                  <td style={{ padding: "8px" }}>
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : ""}
                  </td>
                  <td style={{ padding: "8px" }}>
                    <span
                      style={{
                        padding: "4px 12px",
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
                        fontSize: "13px",
                        fontWeight: "600",
                      }}
                    >
                      {task.priority}
                    </span>
                  </td>
                  <td style={{ padding: "8px" }}>{task.status}</td>
                  <td style={{ padding: "8px" }}>
                    <button
                      onClick={() => openEdit(task)}
                      style={{
                        marginRight: "8px",
                        padding: "5px 12px",
                        borderRadius: "6px",
                        border: "1px solid #dbeafe",
                        background: "#fff",
                        color: "#475569",
                        cursor: "pointer",
                        fontSize: "13px"
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(task._id)}
                      style={{
                        padding: "5px 12px",
                        borderRadius: "6px",
                        border: "none",
                        background: "#fee2e2",
                        color: "#ef4444",
                        cursor: "pointer",
                        fontSize: "13px"
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
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              fontSize: 18,
            }}
          >
            📝
          </span>
          To Do
        </span>
      ),
      items: todo,
      key: "todo"
    },
    {
      title: (
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 18 }}>🚧</span>
          In Progress
        </span>
      ),
      items: inProgress,
      key: "inprogress"
    },
    {
      title: (
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 18 }}>✅</span>
          Done
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
    gap: "24px",
    alignItems: "flex-start"
  });

  // COLUMN CARD STYLE - dynamic height, clean padding/margin, no fixed minHeight
  const kanbanColumnStyle = {
    background: "#fff",
    borderRadius: "18px",
    padding: "20px 18px 16px 18px",
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
        padding: "24px",
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
          marginBottom: "32px",
        }}
      >
        <h1
          style={{
            fontSize: "22px",
            fontWeight: "800",
            color: "#1e293b",
            letterSpacing: "-0.5px",
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
            padding: "11px 28px",
            borderRadius: "12px",
            cursor: "pointer",
            fontWeight: "700",
            fontSize: "15px",
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
          gap: "14px",
          marginBottom: "28px",
        }}
      >
        <button
          onClick={() => setView("task")}
          style={{
            background: view === "task" ? "#eef4ff" : "#fff",
            border: `1.5px solid ${view === "task" ? "#2563eb" : "#dbeafe"}`,
            padding: "10px 27px",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: 600,
            color: view === "task" ? "#2563eb" : "#475569",
            fontSize: "15px",
            boxShadow: view === "task" ? "0 2px 10px rgba(37,99,235,0.04)" : "none",
            transition: "all 0.13s"
          }}
        >
          Task View
        </button>

        <button
          onClick={() => setView("table")}
          style={{
            background: view === "table" ? "#eef4ff" : "#fff",
            border: `1.5px solid ${view === "table" ? "#2563eb" : "#dbeafe"}`,
            padding: "10px 27px",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: 600,
            color: view === "table" ? "#2563eb" : "#475569",
            fontSize: "15px",
            boxShadow: view === "table" ? "0 2px 10px rgba(37,99,235,0.04)" : "none",
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
                  marginBottom: "16px",
                  fontSize: "16px",
                  fontWeight: "700",
                  color: "#1e293b",
                  letterSpacing: "-0.25px",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                {column.title}
              </div>

              {loading ? (
                <div style={{ paddingTop: 16, color: "#64748b" }}>Loading...</div>
              ) : column.items.length ? (
                column.items.map(renderTaskCard)
              ) : (
                <div style={{ color: "#64748b", fontSize: 15, padding: "22px 2px 6px 2px", textAlign: "center" }}>
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