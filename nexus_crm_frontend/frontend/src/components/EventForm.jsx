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
  const [error, setError] = useState("");

  // Always keep form in sync with latest initial
  useEffect(() => {
    if (open) {
      if (initial) {
        setForm({
          title: initial.title || "",
          date: initial.date || initial.startDate || "",
          time: initial.time || "",
          type: initial.type || "Meeting",
          // If participants is an array, join with a comma for the input field
          participants: Array.isArray(initial.participants)
            ? initial.participants.join(", ")
            : typeof initial.participants === "string"
              ? initial.participants
              : (Array.isArray(initial.attendees)
                  ? initial.attendees.join(", ") : ""),
          desc: initial.desc || initial.description || "",
        });
      } else {
        setForm(EMPTY);
      }
      setError("");
    }
    // eslint-disable-next-line
  }, [initial, open]);

  const set = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
    setError(""); // Clear error message on input
  };

  const handleSubmit = (e) => {
    e && e.preventDefault();
    if (!form.title.trim() && !form.date) {
      setError("Event title and date are required.");
      return;
    }
    if (!form.title.trim()) {
      setError("Event title is required.");
      return;
    }
    if (!form.date) {
      setError("Event date is required.");
      return;
    }

    // Split participants string (user input) into an array
    const parsedParticipants = form.participants
      ? form.participants
          .split(",")
          .map((p) => p.trim())
          .filter(Boolean)
      : [];

    // Compose a normalized event object
    const eventToSave = {
      title: form.title.trim(),
      startDate: form.date,
      date: form.date,
      time: form.time,
      type: form.type,
      attendees: parsedParticipants.length ? parsedParticipants : (initial?.attendees || []),
      participants: form.participants,
      desc: form.desc,
      description: form.desc,
      _id: initial?._id   // Pass _id for edit (so parent knows this is an update)
    };

    onSave(eventToSave);

    // After saving, don't close/reset here, let parent manage state,
    // otherwise modal closes before parent updates, causing visual flicker/no update.
    // The parent should provide open=false when done, which resets the form accordingly.
    // setForm(EMPTY);
    // setError("");
    // onClose();
  };

  if (!open) return null;

  return (
    <div
      className="modal-overlay open"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal">
        {/* HEADER */}
        <div className="modal-header">
          <div className="modal-title">
            {initial
              ? "Edit Event"
              : "Schedule New Event"}
          </div>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form className="form-grid" onSubmit={handleSubmit} autoComplete="off">
          {/* TITLE */}
          <div className="form-group full">
            <label>Event Title *</label>
            <input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Event title"
              autoFocus
              required
            />
          </div>

          {/* DATE */}
          <div className="form-group">
            <label>Date *</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
              required
            />
          </div>

          {/* TIME */}
          <div className="form-group">
            <label>Time</label>
            <input
              type="time"
              value={form.time}
              onChange={(e) => set("time", e.target.value)}
            />
          </div>

          {/* TYPE */}
          <div className="form-group">
            <label>Event Type</label>
            <select
              value={form.type}
              onChange={(e) => set("type", e.target.value)}
            >
              {[
                "Meeting",
                "Call",
                "Demo",
                "Follow-up",
                "Deadline",
                "Other",
              ].map((type) => (
                <option key={type} value={type}>
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
              onChange={(e) => set("participants", e.target.value)}
              placeholder=""
            />
          </div>

          {/* DESCRIPTION */}
          <div className="form-group full">
            <label>Description</label>
            <textarea
              value={form.desc}
              onChange={(e) => set("desc", e.target.value)}
              placeholder="Event details..."
            />
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div
              style={{
                color: "#d10c29",
                background: "#fde8eb",
                padding: "8px 16px",
                borderRadius: "6px",
                margin: "12px 0 0 0",
                fontSize: 14,
                gridColumn: "1/-1",
              }}
            >
              {error}
            </div>
          )}

          {/* FOOTER */}
          <div className="form-footer" style={{ gridColumn: "1/-1" }}>
            <button
              className="btn btn-outline"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button className="btn btn-primary" type="submit">
              Save Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}