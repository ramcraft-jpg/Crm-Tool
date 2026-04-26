import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth, API } from "../context/AuthContext";
import TaskForm from "../components/TaskForm";
import { StatusBadge } from "../components/Card";

export default function Tasks() {
  const { tasks, setTasks, showToast } = useAuth();

  const [view, setView] = useState("task");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch all tasks from backend (MongoDB)
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/tasks`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });
      setTasks(res.data);
    } catch (error) {
      console.error("Fetch Tasks Error:", error);
      showToast("Failed to load tasks", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line
  }, []);

  /* FILTER TASKS */
  const todo = tasks.filter((t) => t.status === "Todo");
  const inProgress = tasks.filter((t) => t.status === "In Progress");
  const done = tasks.filter((t) => t.status === "Completed");

  /* OPEN ADD */
  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  /* OPEN EDIT */
  const openEdit = (task) => {
    setEditing({
      ...task,
      assignee: task.assignedTo || "",
      deadline: task.dueDate
        ? new Date(task.dueDate).toISOString().split("T")[0]
        : "",
      status:
        task.status === "Todo"
          ? "To Do"
          : task.status === "Completed"
          ? "Done"
          : task.status,
    });

    setModalOpen(true);
  };

  /* SAVE TASK */
  const handleSave = async (form) => {
    try {
      const payload = {
        title: form.title,
        assignedTo: form.assignee,
        dueDate: form.deadline,
        priority: form.priority,
        status:
          form.status === "To Do"
            ? "Todo"
            : form.status === "Done"
            ? "Completed"
            : form.status,
      };

      if (editing && editing._id) {
        // UPDATE
        const res = await axios.put(
          `${API}/tasks/${editing._id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
          }
        );
        const updatedTask = res.data;
        await fetchTasks(); // Ensure tasks sync from backend
        showToast("Task updated successfully!", "success");
      } else {
        // CREATE
        const res = await axios.post(
          `${API}/tasks`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
          }
        );
        const createdTask = res.data;
        await fetchTasks(); // Ensure tasks sync from backend
        showToast("Task added successfully!", "success");
      }

      setModalOpen(false);
      setEditing(null);
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data && error.response.data.message) {
        showToast(error.response.data.message, "danger");
      } else {
        showToast("Something went wrong!", "danger");
      }
    }
  };

  /* DELETE TASK */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      await axios.delete(
        `${API}/tasks/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        }
      );
      await fetchTasks(); // Resync with DB
      showToast("Task deleted successfully!", "success");
    } catch (error) {
      console.error(error);
      showToast("Failed to delete task", "danger");
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
        <div className="section-title">
          Task Management
        </div>

        <button
          className="btn btn-primary"
          onClick={openAdd}
        >
          + Add Task
        </button>
      </div>

      {/* VIEW TABS */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 20,
          alignItems: "center",
        }}
      >
        <div className="view-tabs">
          <button
            className={`view-tab ${
              view === "task" ? "active" : ""
            }`}
            onClick={() => setView("task")}
          >
            Task Board
          </button>

          <button
            className={`view-tab ${
              view === "table" ? "active" : ""
            }`}
            onClick={() => setView("table")}
          >
            Table View
          </button>
        </div>
      </div>

      {/* TASK BOARD */}
      {view === "task" && (
        <div
          style={{
            display: "flex",
            gap: "20px",
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          {[
            {
              label: "To Do",
              color: "#94a3b8",
              items: todo,
            },
            {
              label: "In Progress",
              color: "#2563eb",
              items: inProgress,
            },
            {
              label: "Done",
              color: "#10b981",
              items: done,
            },
          ].map((col) => (
            <div
              key={col.label}
              style={{
                flex: 1,
                minWidth: "320px",
                background: "#f8fafc",
                border: "1px solid #dbe3ef",
                borderRadius: "20px",
                padding: "18px",
              }}
            >
              {/* COLUMN HEADER */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 18,
                  fontWeight: 600,
                  fontSize: 18,
                }}
              >
                <span
                  style={{
                    color: col.color,
                    fontSize: 20,
                  }}
                >
                  ●
                </span>

                {col.label}

                <span
                  style={{
                    background: "#e2e8f0",
                    borderRadius: "999px",
                    padding: "2px 10px",
                    fontSize: 13,
                  }}
                >
                  {col.items.length}
                </span>
              </div>

              {/* TASK CARDS */}
              {loading ? (
                <div
                  style={{
                    textAlign: "center",
                    color: "#94a3b8",
                    padding: "30px 0",
                  }}
                >Loading tasks...</div>
              ) : col.items.length ? (
                col.items.map((task) => (
                  <div
                    key={task._id}
                    style={{
                      background: "#fff",
                      borderRadius: "16px",
                      padding: "18px",
                      marginBottom: "14px",
                      boxShadow:
                        "0 4px 12px rgba(0,0,0,0.04)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 18,
                        fontWeight: 600,
                        marginBottom: 12,
                      }}
                    >
                      {task.title}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: 10,
                        marginBottom: 14,
                        flexWrap: "wrap",
                      }}
                    >
                      <StatusBadge
                        status={task.priority}
                      />

                      {task.dueDate && (
                        <span
                          style={{
                            fontSize: 14,
                            color: "#64748b",
                          }}
                        >
                          📅{" "}
                          {new Date(
                            task.dueDate
                          ).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 14,
                          color: "#64748b",
                        }}
                      >
                        {task.assignedTo ||
                          "Unassigned"}
                      </div>

                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                        }}
                      >
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() =>
                            openEdit(task)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                            handleDelete(task._id)
                          }
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
                    textAlign: "center",
                    color: "#94a3b8",
                    padding: "30px 0",
                  }}
                >
                  No tasks
                </div>
              )}

              {/* ADD TASK BUTTON */}
              {col.label === "To Do" && (
                <button
                  className="btn btn-outline"
                  style={{
                    width: "100%",
                    marginTop: 10,
                  }}
                  onClick={openAdd}
                >
                  + Add Task
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {view === "table" && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Task Title</th>
                <th>Assigned To</th>
                <th>Deadline</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6">
                    <div className="empty-state">
                      <div className="empty-text">
                        Loading tasks...
                      </div>
                    </div>
                  </td>
                </tr>
              ) : tasks.length ? (
                tasks.map((task) => (
                  <tr key={task._id}>
                    <td className="td-name">
                      {task.title}
                    </td>

                    <td>
                      {task.assignedTo || "—"}
                    </td>

                    <td>
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString()
                        : "—"}
                    </td>

                    <td>
                      <StatusBadge
                        status={task.priority}
                      />
                    </td>

                    <td>
                      <StatusBadge
                        status={task.status}
                      />
                    </td>

                    <td>
                      <div className="td-actions">
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() =>
                            openEdit(task)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                            handleDelete(task._id)
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">
                    <div className="empty-state">
                      <div className="empty-icon">
                        ✅
                      </div>
                      <div className="empty-text">
                        No tasks yet.
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* TASK MODAL */}
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