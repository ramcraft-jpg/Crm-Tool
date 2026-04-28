// TaskForm.jsx

import { useState, useEffect } from "react";

const EMPTY = {
  title: "",
  description: "",
  assignedTo: "",
  dueDate: "",
  priority: "High",
  status: "Todo",
};

export default function TaskForm({
  open,
  onClose,
  onSave,
  initial,
}) {
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    setForm(initial ? { ...initial } : { ...EMPTY });
  }, [initial, open]);

  const set = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = () => {
    if (!form.title.trim()) {
      alert("Task title is required");
      return;
    }

    onSave(form);
  };

  if (!open) return null;

  return (
    <div
      className="modal-overlay open"
      onClick={(e) =>
        e.target === e.currentTarget && onClose()
      }
    >
      <div className="modal">
        {/* HEADER */}
        <div className="modal-header">
          <div className="modal-title">
            {initial ? "Edit Task" : "Add New Task"}
          </div>

          <button
            className="modal-close"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* FORM */}
        <div className="form-grid">

          {/* TASK TITLE */}
          <div className="form-group full">
            <label>Task Title *</label>
            <input
              value={form.title}
              onChange={(e) =>
                set("title", e.target.value)
              }
              placeholder="Task title"
            />
          </div>

          {/* DESCRIPTION */}
          <div className="form-group full">
            <label>Description</label>
            <textarea
              value={form.description}
              onChange={(e) =>
                set("description", e.target.value)
              }
              placeholder="Task description..."
            />
          </div>

          {/* ASSIGNED TO */}
          <div className="form-group">
            <label>Assigned Employee</label>
            <input
              value={form.assignedTo}
              onChange={(e) =>
                set("assignedTo", e.target.value)
              }
              placeholder="Employee name"
            />
          </div>

          {/* DUE DATE */}
          <div className="form-group">
            <label>Due Date</label>
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) =>
                set("dueDate", e.target.value)
              }
            />
          </div>

          {/* PRIORITY */}
          <div className="form-group">
            <label>Priority</label>
            <select
              value={form.priority}
              onChange={(e) =>
                set("priority", e.target.value)
              }
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
             
            </select>
          </div>

          {/* STATUS */}
          <div className="form-group full">
            <label>Status</label>
            <select
              value={form.status}
              onChange={(e) =>
                set("status", e.target.value)
              }
            >
              <option>Todo</option>
              <option>In Progress</option>
          
              <option>Completed</option>
            </select>
          </div>
        </div>

        {/* FOOTER */}
        <div className="form-footer">
          <button
            className="btn btn-outline"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="btn btn-primary"
            onClick={handleSubmit}
          >
            Save Task
          </button>
        </div>
      </div>
    </div>
  );
}