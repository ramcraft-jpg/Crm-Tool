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

  // Compact styles for modal, form, inputs, buttons, textareas, selects
  const modalStyle = {
    width: 340,
    minWidth: 0,
    padding: 18,
    borderRadius: 10,
    background: "#fff",
    boxShadow: "0 4px 18px rgba(0,0,0,0.09)",
    margin: "48px auto"
  };
  const gridStyle = {
    display: "grid",
    gap: 10,
    gridTemplateColumns: "1fr 1fr",
    marginBottom: 8
  };
  const inputStyle = {
    fontSize: 13,
    padding: "5px 8px",
    borderRadius: 4,
    border: "1px solid #ccc",
    width: "100%",
    boxSizing: "border-box"
  };
  const textareaStyle = {
    ...inputStyle,
    minHeight: 44,
    resize: "vertical",
    fontSize: 13
  };
  const labelStyle = {
    fontSize: 13,
    marginBottom: 2,
    fontWeight: 500
  };
  const btnStyle = {
    fontSize: 13,
    padding: "5px 20px",
    borderRadius: 4,
    border: "none",
    cursor: "pointer"
  };
  const footerStyle = {
    display: "flex",
    gap: 8,
    justifyContent: "flex-end",
    marginTop: 6
  };
  const modalCloseStyle = {
    background: "none",
    border: "none",
    fontSize: 18,
    cursor: "pointer",
    padding: 2,
    marginLeft: 6
  };
  const formGroupStyle = {
    display: "flex",
    flexDirection: "column",
    marginBottom: 0
  };
  // Make "full" class span both columns
  const formGroupFullStyle = {
    ...formGroupStyle,
    gridColumn: "1/-1"
  };


  return (
    <div
      className="modal-overlay open"
      style={{ background: "rgba(0,0,0,.15)", zIndex: 20 }}
      onClick={(e) =>
        e.target === e.currentTarget && onClose()
      }
    >
      <div className="modal" style={modalStyle}>
        {/* HEADER */}
        <div
          className="modal-header"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 10
          }}
        >
          <div className="modal-title" style={{ fontSize: 15, fontWeight: 600 }}>
            {initial ? "Edit Task" : "Add New Task"}
          </div>
          <button
            className="modal-close"
            style={modalCloseStyle}
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* FORM */}
        <div className="form-grid" style={gridStyle}>

          {/* TASK TITLE */}
          <div className="form-group full" style={formGroupFullStyle}>
            <label style={labelStyle}>Task Title *</label>
            <input
              style={inputStyle}
              value={form.title}
              onChange={(e) =>
                set("title", e.target.value)
              }
              placeholder="Task title"
              autoFocus
            />
          </div>

          {/* DESCRIPTION */}
          <div className="form-group full" style={formGroupFullStyle}>
            <label style={labelStyle}>Description</label>
            <textarea
              style={textareaStyle}
              value={form.description}
              onChange={(e) =>
                set("description", e.target.value)
              }
              placeholder="Task description..."
            />
          </div>

          {/* ASSIGNED TO */}
          <div className="form-group" style={formGroupStyle}>
            <label style={labelStyle}>Assigned Employee</label>
            <input
              style={inputStyle}
              value={form.assignedTo}
              onChange={(e) =>
                set("assignedTo", e.target.value)
              }
              placeholder="Employee name"
            />
          </div>

          {/* DUE DATE */}
          <div className="form-group" style={formGroupStyle}>
            <label style={labelStyle}>Due Date</label>
            <input
              style={inputStyle}
              type="date"
              value={form.dueDate}
              onChange={(e) =>
                set("dueDate", e.target.value)
              }
            />
          </div>

          {/* PRIORITY */}
          <div className="form-group" style={formGroupStyle}>
            <label style={labelStyle}>Priority</label>
            <select
              style={inputStyle}
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
          <div className="form-group full" style={formGroupFullStyle}>
            <label style={labelStyle}>Status</label>
            <select
              style={inputStyle}
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
        <div className="form-footer" style={footerStyle}>
          <button
            className="btn btn-outline"
            style={{
              ...btnStyle,
              background: "#f5f5f5",
              border: "1px solid #ccc",
              color: "#2c3743"
            }}
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>

          <button
            className="btn btn-primary"
            style={{
              ...btnStyle,
              background: "#2563eb",
              color: "#fff",
              fontWeight: 500,
              border: "1px solid #1562c1"
            }}
            onClick={handleSubmit}
            type="button"
          >
            Save Task
          </button>
        </div>
      </div>
    </div>
  );
}