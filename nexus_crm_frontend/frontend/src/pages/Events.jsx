import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import EventForm from "../components/EventForm";
import { StatusBadge } from "../components/Card";

// Add "Follow up", "Deadline" and "Other" to available event types, with "View All" option at the start
const EVENT_TYPES = [
  "View All",
  "Call",
  "Demo",
  "Meeting",
  "Follow up",
  "Deadline",
  "Other"
];

export default function Events() {
  const { events, setEvents, showToast } = useAuth();

  // Set default filter to "View All"
  const [filter, setFilter] = useState(EVENT_TYPES[0]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  // --------- Data Clean-Up Helper ----------
  // Clean the event type field for display and filtering.
  // Return exactly "Call", "Demo", "Deadline", "Follow up", "Meeting", or "Other" if the event type matches (case-insensitive), including fixing misspellings.
  function getCleanType(type) {
    if (!type) return "—";
    const norm = type.toString().toLowerCase().trim();

    // Strict match for allowed types + handle common misspellings for "Demo", "Deadline", "Follow up" etc.
    if (norm === "call") return "Call";
    if (
      norm === "demo" ||
      norm === "demoo" ||
      norm === "demonstration" ||
      norm === "demon" ||
      norm === "demmo"
    ) return "Demo";
    if (
      norm === "meeting" ||
      norm === "meetng" ||
      norm === "meting"
    ) return "Meeting";
    if (
      norm === "follow up" ||
      norm === "follow-up" ||
      norm === "followup" ||
      norm === "f/up" ||
      norm === "fup"
    ) return "Follow up";
    if (
      norm === "deadline" ||
      norm === "dead line" ||
      norm === "due"
    ) return "Deadline";
    if (
      norm === "other" ||
      norm === "interview" ||
      norm === "interviw" ||
      norm === "interveiw"
    ) return "Other";

    // fallback
    return "—";
  }

  // Filter events list ("View All" shows all, otherwise filter by type using clean type)
  // REMOVE completed events from the list (i.e. events with status "Completed")
  const filtered = (Array.isArray(events) ? events : [])
    .filter((e) => e.status !== "Completed")
    .filter(
      (e) =>
        filter === "View All" || getCleanType(e.type) === filter
    );

  // Open add event modal
  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  // Open edit event modal
  const openEdit = (event) => {
    setEditing({
      ...event,
      date: event.startDate
        ? new Date(event.startDate).toISOString().split("T")[0]
        : "",
      time: event.endDate
        ? new Date(event.endDate).toISOString().slice(11, 16)
        : "",
      participants: event.attendees
        ? event.attendees.join(", ")
        : "",
      desc: event.description || "",
      // Normalize the event type so the form shows the correct value
      type: getCleanType(event.type),
    });

    setModalOpen(true);
  };

  // Save (add or edit) event
  const handleSave = async (form) => {
    try {
      // Ensure never saving "View All" as a type! Default to "Call" if not a valid event type (enforced by dropdown)
      const validType = EVENT_TYPES.slice(1).find(
        (t) => t === form.type
      ) || EVENT_TYPES[1];

      const payload = {
        title: form.title,
        description: form.desc || "",
        location: "",
        startDate: form.date
          ? new Date(form.date)
          : null,
        endDate:
          form.date && form.time
            ? new Date(`${form.date}T${form.time}`)
            : null,
        type: validType,
        attendees: form.participants
          ? form.participants
              .split(",")
              .map((p) => p.trim())
              .filter(Boolean)
          : [],
        status: "Scheduled",
        isAllDay: false,
      };

      // Update event
      if (editing && editing._id) {
        const updateRes = await fetch(
          `http://localhost:5000/api/events/${editing._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(payload),
          }
        );

        if (!updateRes.ok) {
          throw new Error("Failed to update event");
        }

        showToast("Event updated successfully!", "success");
      }
      // Create event
      else {
        const createRes = await fetch(
          "http://localhost:5000/api/events",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(payload),
          }
        );

        if (!createRes.ok) {
          const err = await createRes.json();
          throw new Error(
            err.message || "Failed to create event"
          );
        }

        showToast(
          "Event scheduled successfully!",
          "success"
        );
      }

      // Refresh events
      const refreshed = await fetch(
        "http://localhost:5000/api/events",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const freshData = await refreshed.json();
      setEvents(freshData);

      setModalOpen(false);
      setEditing(null);

    } catch (error) {
      console.error("SAVE EVENT ERROR:", error);

      showToast(
        error.message || "Something went wrong!",
        "danger"
      );
    }
  };

  // Delete event
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;

    try {
      await fetch(
        `http://localhost:5000/api/events/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const refreshed = await fetch(
        "http://localhost:5000/api/events",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const freshData = await refreshed.json();
      setEvents(freshData);

      showToast(
        "Event deleted successfully!",
        "success"
      );
    } catch (error) {
      console.error(error);

      showToast(
        "Failed to delete event",
        "danger"
      );
    }
  };

  // UI
  return (
    <div style={{ padding: "30px", background: "#f5f8fc", minHeight: "100vh" }}>
      {/* HEADER */}
      <div className="section-header">
        <div className="section-title">Event Management</div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Event</button>
      </div>

      {/* FILTERS */}
      <div className="filters">
        {EVENT_TYPES.map((type) => (
          <div
            key={type}
            className={`filter-btn${filter === type ? " active" : ""}`}
            onClick={() => setFilter(type)}
          >
            {type}
          </div>
        ))}
      </div>

      {/* EVENT TABLE */}
      <div className="table-wrap">
        {(Array.isArray(events) && events.length === 0) ? (
          <div className="empty-state">
            <div className="empty-icon"></div>
            <div className="empty-text">No events found.</div>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Title</th>
                <th>Date/Time</th>
                <th>Participants</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6">
                    <div className="empty-state">
                      <div className="empty-icon"></div>
                      <div className="empty-text">No events found for this filter.</div>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((e) => (
                  <tr key={e._id}>
                    {/* Type - Always show the cleaned up type */}
                    <td>
                      {getCleanType(e.type)}
                    </td>
                    {/* Title */}
                    <td>{e.title || "—"}</td>
                    {/* Date / Time */}
                    <td>
                      {e.startDate
                        ? new Date(e.startDate).toLocaleDateString()
                        : "—"}
                      {e.endDate &&
                        <span style={{ color: "#888", fontSize: 12 }}>
                          {" "}
                          {new Date(e.endDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      }
                    </td>
                    {/* Participants */}
                    <td>
                      <span style={{
                        fontSize: 12,
                        color: "#64748b",
                      }}>
                        {Array.isArray(e.attendees) && e.attendees.length > 0
                          ? e.attendees.join(", ")
                          : "—"}
                      </span>
                    </td>
                    {/* Status */}
                    <td>
                      <StatusBadge status={e.status} />
                    </td>
                    {/* Actions */}
                    <td>
                      <div className="td-actions">
                        <button className="btn btn-outline btn-sm" onClick={() => openEdit(e)}>
                          Edit
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(e._id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL */}
      <EventForm
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSave={handleSave}
        initial={editing}
        // Pass all event types, now including "Follow up", "Deadline", and "Other" ("View All" is filtered out)
        eventTypes={EVENT_TYPES.filter(t => t !== "View All")}
      />
    </div>
  );
}