import { useState, useEffect } from "react";

const EMPTY = {
  title: "",
  client: "",
  status: "Planning",
  startDate: "",
  endDate: "",
  progress: 0,
  description: "",
};

export default function ProjectForm({
  open,
  onClose,
  onSave,
  initial,
}) {
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title || "",
        client: initial.client || "",
        status: initial.status || "Planning",
        startDate: initial.startDate
          ? initial.startDate.slice(0, 10)
          : "",
        endDate: initial.endDate
          ? initial.endDate.slice(0, 10)
          : "",
        progress: initial.progress || 0,
        description: initial.description || "",
      });
    } else {
      setForm(EMPTY);
    }
  }, [initial, open]);

  const set = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = () => {
    if (!form.title.trim()) return;
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
        <div className="modal-header">
          <div className="modal-title">
            {initial ? "Edit Project" : "Create New Project"}
          </div>

          <button
            className="modal-close"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="form-grid">
          <div className="form-group full">
            <label>Project Title *</label>
            <input
              value={form.title}
              onChange={(e) =>
                set("title", e.target.value)
              }
              placeholder="Project title"
            />
          </div>

          <div className="form-group">
            <label>Client Name</label>
            <input
              value={form.client}
              onChange={(e) =>
                set("client", e.target.value)
              }
              placeholder="Client name"
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              value={form.status}
              onChange={(e) =>
                set("status", e.target.value)
              }
            >
              {[
                "Planning",
                "In Progress",
                "Completed",
              ].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              value={form.startDate}
              onChange={(e) =>
                set("startDate", e.target.value)
              }
            />
          </div>

          <div className="form-group">
            <label>End Date</label>
            <input
              type="date"
              value={form.endDate}
              onChange={(e) =>
                set("endDate", e.target.value)
              }
            />
          </div>

          <div className="form-group">
            <label>Progress (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={form.progress}
              onChange={(e) =>
                set(
                  "progress",
                  parseInt(e.target.value) || 0
                )
              }
            />
          </div>

          <div className="form-group full">
            <label>Description</label>
            <textarea
              value={form.description}
              onChange={(e) =>
                set("description", e.target.value)
              }
              placeholder="Project description..."
            />
          </div>
        </div>

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
            Save Project
          </button>
        </div>
      </div>
    </div>
  );
}