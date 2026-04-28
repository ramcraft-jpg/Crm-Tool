// Tasks.jsx

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
      console.error("Fetch Tasks Error:", error);
      showToast("Failed to load tasks", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // FILTER TASKS
  const todo = tasks.filter((t) => t.status === "Todo");
  const inProgress = tasks.filter((t) => t.status === "In Progress");
  const review = tasks.filter((t) => t.status === "Review");
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

      if (editing && editing._id) {
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

        showToast("Task added successfully!", "success");
      }

      await fetchTasks();
      setModalOpen(false);
      setEditing(null);
    } catch (error) {
      console.error(error);

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
      console.error(error);
      showToast("Failed to delete task", "danger");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <button onClick={openAdd}>+ Add Task</button>

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