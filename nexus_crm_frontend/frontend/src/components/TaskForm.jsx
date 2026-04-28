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
    setForm(initial ? { ...EMPTY, ...initial } : { ...EMPTY });
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

  // == Modal styling (matches ProjectForm/CRM professional modals) ==
  const overlayStyle = {
    position: "fixed",
    zIndex: 200,
    inset: 0,
    background: "rgba(45,50,87,0.27)",
    backdropFilter: "blur(2.5px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
  const modalStyle = {
    background: "#fff",
    borderRadius: 15,
    width: 426,
    maxWidth: "97vw",
    boxShadow: "0 8px 38px rgba(40,54,99,0.17)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    padding: 0,
    margin: 0,
  };
  const headerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "23px 30px 0 30px",
    marginBottom: 9,
    minHeight: 0,
  };
  const titleStyle = {
    fontSize: 20,
    fontWeight: 700,
    color: "#27304a",
    margin: 0,
    letterSpacing: "-0.22px",
    lineHeight: 1.16,
  };
  const modalCloseStyle = {
    background: "none",
    border: "none",
    fontSize: 25,
    color: "#8693a8",
    cursor: "pointer",
    padding: 0,
    marginLeft: 16,
    lineHeight: 1,
    transition: "color .18s",
    display: "flex",
    alignItems: "center",
  };
  const formBodyStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "0",
    padding: "8px 30px 0 30px",
    minWidth: 0,
  };
  const labelStyle = {
    fontWeight: 600,
    fontSize: 14.5,
    color: "#344054",
    marginBottom: 7,
    marginTop: 0,
    letterSpacing: "0px",
  };
  const inputStyle = {
    background: "#f7f9fc",
    border: "1.35px solid #dbe5ee",
    borderRadius: 7,
    fontSize: 15,
    padding: "9.5px 12px",
    color: "#253044",
    outline: "none",
    width: "100%",
    margin: 0,
    marginBottom: 0,
    transition: "border 0.17s",
    boxSizing: "border-box",
    resize: "none",
  };
  const textareaStyle = {
    ...inputStyle,
    minHeight: 52,
    maxHeight: 72,
    fontFamily: "inherit",
    fontSize: 15,
    resize: "vertical",
    marginBottom: "0",
  };
  // Form group styles
  const formGroupStyle = {
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    marginBottom: 13,
  };
  const formGroupRowStyle = {
    display: "flex",
    gap: 16,
    marginBottom: 13,
  };
  const formGroupGrow = {
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
  };
  // Footer
  const footerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    borderTop: "1.2px solid #f1f1f2",
    padding: "16px 30px",
    background: "#fff",
    gap: 12,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    minHeight: 0,
  };
  const cancelBtnStyle = {
    background: "#fff",
    color: "#2f4567",
    fontWeight: 700,
    border: "1.3px solid #b9c9da",
    borderRadius: 7,
    padding: "9px 24px",
    fontSize: 15,
    cursor: "pointer",
    transition: "all .14s",
  };
  const saveBtnStyle = {
    background: "linear-gradient(96deg,#3d6bcb 60%,#1c7ae7 100%)",
    color: "#fff",
    fontWeight: 700,
    border: 0,
    borderRadius: 7,
    padding: "10.5px 32px",
    fontSize: 15,
    boxShadow: "0 1.2px 7px rgba(51,86,255,0.09)",
    transition: "all .14s",
    cursor: "pointer",
    outline: 0,
  };

  return (
    <div
      className="modal-overlay open"
      style={overlayStyle}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="modal" style={modalStyle}>
        {/* HEADER */}
        <div className="modal-header" style={headerStyle}>
          <h3 className="modal-title" style={titleStyle}>
            {initial ? "Edit Task" : "Add New Task"}
          </h3>
          <button
            className="modal-close"
            style={modalCloseStyle}
            onClick={onClose}
            aria-label="Close"
            tabIndex={0}
          >
            <span style={{ display: "inline-block", fontWeight: 300, fontSize: "1.20em" }}>×</span>
          </button>
        </div>

        {/* MODAL BODY FORM */}
        <form
          className="modal-form"
          style={formBodyStyle}
          onSubmit={e => { e.preventDefault(); handleSubmit(); }}
          autoComplete="off"
        >
          {/* Task Title - full width */}
          <div className="form-group" style={{ ...formGroupStyle, marginBottom: 13 }}>
            <label style={labelStyle} htmlFor="task-title">Task Title *</label>
            <input
              id="task-title"
              style={inputStyle}
              value={form.title}
              onChange={e => set("title", e.target.value)}
              placeholder="Task title"
              autoFocus
              type="text"
              maxLength={128}
            />
          </div>

          {/* Assigned Employee + Due Date row */}
          <div className="form-row" style={formGroupRowStyle}>
            <div className="form-group" style={formGroupGrow}>
              <label style={labelStyle} htmlFor="assigned-to">Assigned Employee</label>
              <input
                id="assigned-to"
                style={inputStyle}
                value={form.assignedTo}
                onChange={e => set("assignedTo", e.target.value)}
                placeholder="Employee name"
                type="text"
                maxLength={80}
              />
            </div>
            <div className="form-group" style={formGroupGrow}>
              <label style={labelStyle} htmlFor="due-date">Due Date</label>
              <input
                id="due-date"
                style={inputStyle}
                type="date"
                value={form.dueDate}
                onChange={e => set("dueDate", e.target.value)}
              />
            </div>
          </div>

          {/* Priority + Status row */}
          <div className="form-row" style={formGroupRowStyle}>
            <div className="form-group" style={formGroupGrow}>
              <label style={labelStyle} htmlFor="priority">Priority</label>
              <select
                id="priority"
                style={inputStyle}
                value={form.priority}
                onChange={e => set("priority", e.target.value)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div className="form-group" style={formGroupGrow}>
              <label style={labelStyle} htmlFor="status">Status</label>
              <select
                id="status"
                style={inputStyle}
                value={form.status}
                onChange={e => set("status", e.target.value)}
              >
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Description - at bottom, full width */}
          <div className="form-group" style={{ ...formGroupStyle, marginBottom: 2 }}>
            <label style={labelStyle} htmlFor="description">Description</label>
            <textarea
              id="description"
              style={textareaStyle}
              value={form.description}
              onChange={e => set("description", e.target.value)}
              placeholder="Describe this task in detail…"
              rows={2}
              maxLength={400}
            />
          </div>

          {/* Modal footer */}
          <div className="form-footer" style={footerStyle}>
            <button
              className="btn btn-cancel"
              style={cancelBtnStyle}
              onClick={onClose}
              type="button"
              tabIndex={0}
            >
              Cancel
            </button>
            <button
              className="btn btn-save"
              style={saveBtnStyle}
              type="submit"
            >
              Save Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}