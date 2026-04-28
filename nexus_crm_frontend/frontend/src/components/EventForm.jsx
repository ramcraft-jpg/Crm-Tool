

import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth, API } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

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
  eventTypes = [],
}) {
  const { showToast } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      let startForm = { ...EMPTY };

      if (
        initial &&
        typeof initial === "object" &&
        Object.keys(initial).length
      ) {
        startForm = {
          title: initial.title || "",
          date:
            initial.date ||
            (initial.startDate
              ? new Date(initial.startDate)
                  .toISOString()
                  .split("T")[0]
              : ""),
          time:
            initial.time ||
            (initial.endDate
              ? new Date(initial.endDate)
                  .toISOString()
                  .slice(11, 16)
              : ""),
          type: initial.type || "Meeting",
          participants: Array.isArray(initial.attendees)
            ? initial.attendees.join(", ")
            : initial.participants || "",
          desc:
            initial.desc ||
            initial.description ||
            "",
        };
      }

      setForm(startForm);
      setError("");
    } else {
      setForm(EMPTY);
      setError("");
    }
  }, [initial, open]);

  const set = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      setError("Event title is required.");
      return;
    }

    if (!form.date) {
      setError("Event date is required.");
      return;
    }

    const eventToSave = {
      title: form.title.trim(),
      date: form.date,
      time: form.time,
      type: form.type,
      participants: form.participants,
      desc: form.desc,
      _id: initial?._id,
    };

    onSave(eventToSave);
  };

  if (!open) return null;

  return (
    <div
      className="modal-overlay open"
      onClick={(e) =>
        e.target === e.currentTarget &&
        onClose()
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
        <form
          className="form-grid"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          {/* EVENT TITLE */}
          <div className="form-group full">
            <label>Event Title *</label>
            <input
              value={form.title}
              onChange={(e) =>
                set("title", e.target.value)
              }
              placeholder="Event title"
              required
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
              required
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

          {/* EVENT TYPE */}
          <div className="form-group">
            <label>Event Type</label>
            <select
              value={form.type}
              onChange={(e) =>
                set("type", e.target.value)
              }
            >
              {eventTypes.map((type) => (
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
              Participants
              (comma separated)
            </label>

            <input
              value={form.participants}
              onChange={(e) =>
                set(
                  "participants",
                  e.target.value
                )
              }
              placeholder="John, Alex, Smith"
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

          {/* ERROR */}
          {error && (
            <div
              style={{
                color: "#d10c29",
                background: "#fde8eb",
                padding: "10px 14px",
                borderRadius: "8px",
                fontSize: "14px",
                gridColumn: "1 / -1",
              }}
            >
              {error}
            </div>
          )}

          {/* FOOTER */}
          <div
            className="form-footer"
            style={{
              gridColumn: "1 / -1",
            }}
          >
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary"
            >
              Save Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

