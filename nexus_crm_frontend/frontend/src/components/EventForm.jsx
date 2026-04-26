import { useState, useEffect } from "react";

const EMPTY = {
  title: "",
  date: "",
  time: "",
  type: "Meeting",
  participants: "",
  desc: "",
};

export default function EventForm({
  open,
  onClose,
  onSave,
  initial,
}) {
  const [form, setForm] = useState(EMPTY);

  /* LOAD EDIT DATA OR RESET FORM */
  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title || "",
        date: initial.date || "",
        time: initial.time || "",
        type: initial.type || "Meeting",
        participants: initial.participants || "",
        desc: initial.desc || "",
      });
    } else {
      setForm(EMPTY);
    }
  }, [initial, open]);

  /* SET FIELD */
  const set = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  /* SUBMIT */
  const handleSubmit = () => {
    if (!form.title.trim()) {
      return;
    }

    if (!form.date) {
      alert("Please select event date");
      return;
    }

    onSave(form);

    /* RESET FORM AFTER SAVE */
    setForm(EMPTY);
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
            {initial
              ? "Edit Event"
              : "Schedule New Event"}
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
          {/* TITLE */}
          <div className="form-group full">
            <label>Event Title *</label>
            <input
              value={form.title}
              onChange={(e) =>
                set("title", e.target.value)
              }
              placeholder="Event title"
            />
          </div>

          {/* DATE */}
          <div className="form-group">
            <label>Date *</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) =>
                set("date", e.target.value)
              }
            />
          </div>

          {/* TIME */}
          <div className="form-group">
            <label>Time</label>
            <input
              type="time"
              value={form.time}
              onChange={(e) =>
                set("time", e.target.value)
              }
            />
          </div>

          {/* TYPE */}
          <div className="form-group">
            <label>Event Type</label>
            <select
              value={form.type}
              onChange={(e) =>
                set("type", e.target.value)
              }
            >
              {[
                "Meeting",
                "Call",
                "Demo",
                "Follow-up",
                "Deadline",
                "Other",
              ].map((type) => (
                <option
                  key={type}
                  value={type}
                >
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* PARTICIPANTS */}
          <div className="form-group full">
            <label>
              Participants (comma separated)
            </label>
            <input
              value={form.participants}
              onChange={(e) =>
                set(
                  "participants",
                  e.target.value
                )
              }
              placeholder="John, Sarah, Mike..."
            />
          </div>

          {/* DESCRIPTION */}
          <div className="form-group full">
            <label>Description</label>
            <textarea
              value={form.desc}
              onChange={(e) =>
                set("desc", e.target.value)
              }
              placeholder="Event details..."
            />
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
            Save Event
          </button>
        </div>
      </div>
    </div>
  );
}