// Events.jsx

import { useState, useEffect, useCallback } from "react";
import { useAuth, API } from "../context/AuthContext";
import EventForm from "../components/EventForm";
import { StatusBadge } from "../components/Card";

const EVENT_TYPES = [
  "View All",
  "Meeting",
  "Call",
  "Demo",
  "Follow up",
  "Deadline",
  "Other",
];

export default function Events() {
  const { events, setEvents, showToast } = useAuth();

  const [filter, setFilter] = useState("View All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  // CLEAN TYPE
  const getCleanType = (type) => {
    if (!type) return "—";
    const norm = type.toString().toLowerCase().trim();

    if (norm === "call") return "Call";
    if (
      norm === "demo" ||
      norm === "demoo" ||
      norm === "demonstration" ||
      norm === "demmo"
    ) {
      return "Demo";
    }
    if (
      norm === "meeting" ||
      norm === "meetng" ||
      norm === "meting"
    ) {
      return "Meeting";
    }
    if (
      norm === "follow up" ||
      norm === "follow-up" ||
      norm === "followup" ||
      norm === "f/up" ||
      norm === "fup"
    ) {
      return "Follow up";
    }
    if (
      norm === "deadline" ||
      norm === "dead line" ||
      norm === "due"
    ) {
      return "Deadline";
    }
    if (
      norm === "other" ||
      norm === "interview" ||
      norm === "interviw" ||
      norm === "interveiw"
    ) {
      return "Other";
    }
    return "—";
  };

  // Fetch all events from backend
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/events`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to load events");
      }
      const data = await res.json();
      setEvents(data);
    } catch (error) {
      console.error("Fetch Events Error:", error);
      showToast("Failed to load events", "danger");
      setEvents([]); // Prevent undefined if request fails
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line
  }, []);

  // FILTERED EVENTS
  const filtered = (Array.isArray(events) ? events : [])
    .filter((e) => e.status !== "Completed")
    .filter(
      (e) =>
        filter === "View All" ||
        getCleanType(e.type) === filter
    );

  // OPEN ADD
  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  // OPEN EDIT
  const openEdit = (event) => {
    setEditing({
      ...event,
      date: event.startDate
        ? new Date(event.startDate)
          .toISOString()
          .split("T")[0]
        : "",
      time: event.endDate
        ? new Date(event.endDate)
          .toISOString()
          .slice(11, 16)
        : "",
      participants: Array.isArray(event.attendees)
        ? event.attendees.join(", ")
        : "",
      desc: event.description || "",
      type: getCleanType(event.type),
    });
    setModalOpen(true);
  };

  // SAVE EVENT (with robust validation, especially for required fields)
  const handleSave = async (form) => {
    try {
      // Validation - event title and date are required (date, NOT time)
      if (!form.title || !form.title.trim()) {
        showToast("Event title is required.", "danger");
        return;
      }
      if (!form.date || !form.date.trim()) {
        showToast("Event start date is required.", "danger");
        return;
      }
      // Optional: you could validate format, but if a date string is present, we let the Date constructor handle parse errors.

      // Fix: Make sure type is valid
      const validType =
        EVENT_TYPES.slice(1).find(
          (t) => t === form.type
        ) || "Meeting";

      // Build correct start and end dates based on form values
      let startDate = null;
      let endDate = null;
      if (form.date) {
        // startDate is always present if required validation passed
        if (form.time && form.time.trim()) {
          // date and time
          startDate = new Date(`${form.date}T${form.time}`);
          endDate = new Date(`${form.date}T${form.time}`); // Set end same as start unless you have a duration field
        } else {
          // date only
          startDate = new Date(form.date);
          endDate = null;
        }
      }

      if (!startDate || isNaN(new Date(startDate).getTime())) {
        showToast("Event start date is invalid.", "danger");
        return;
      }

      const payload = {
        title: form.title.trim(),
        description: form.desc || "",
        location: "",
        startDate: startDate,
        endDate: endDate,
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

      // UPDATE
      if (editing && editing._id) {
        const updateRes = await fetch(
          `${API}/events/${editing._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(payload),
          }
        );

        // Await JSON/error message
        if (!updateRes.ok) {
          let msg = "Failed to update event";
          try {
            const err = await updateRes.json();
            if (err && err.message) msg = err.message;
          } catch (e) { }
          throw new Error(msg);
        }

        showToast("Event updated successfully!", "success");
      }
      // CREATE
      else {
        const createRes = await fetch(
          `${API}/events`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(payload),
          }
        );

        // Await JSON/error message
        if (!createRes.ok) {
          let msg = "Failed to create event";
          try {
            const err = await createRes.json();
            if (err && err.message) msg = err.message;
          } catch (e) { }
          throw new Error(msg);
        }

        showToast("Event scheduled successfully!", "success");
      }

      // REFRESH EVENTS after save
      await fetchEvents();

      setModalOpen(false);
      setEditing(null);
    } catch (error) {
      console.error("SAVE EVENT ERROR:", error);
      showToast(
        error && error.message ? error.message : "Something went wrong!",
        "danger"
      );
    }
  };

  // DELETE EVENT
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;

    try {
      await fetch(
        `${API}/events/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      await fetchEvents();

      showToast("Event deleted successfully!", "success");
    } catch (error) {
      console.error(error);
      showToast("Failed to delete event", "danger");
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
          Event Management
        </div>

        <button
          className="btn btn-primary"
          onClick={openAdd}
        >
          + Add Event
        </button>
      </div>

      {/* FILTERS */}
      <div className="filters">
        {EVENT_TYPES.map((type) => (
          <div
            key={type}
            className={`filter-btn${filter === type ? " active" : ""}`}
            onClick={() =>
              setFilter(type)
            }
          >
            {type}
          </div>
        ))}
      </div>

      {/* TABLE */}
      <div className="table-wrap">
        {loading ? (
          <div className="empty-state">
            <div className="empty-text">Loading events...</div>
          </div>
        ) : !Array.isArray(events) || events.length === 0 ? (
          <div className="empty-state">
            <div className="empty-text">No events found.</div>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Title</th>
                <th>Date / Time</th>
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
                      <div className="empty-text">
                        No events found
                        for this filter.
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((e) => (
                  <tr key={e._id}>
                    <td>
                      {getCleanType(e.type)}
                    </td>

                    <td>
                      {e.title || "—"}
                    </td>

                    <td>
                      {e.startDate
                        ? new Date(
                          e.startDate
                        ).toLocaleDateString()
                        : "—"}

                      {e.endDate && (
                        <span
                          style={{
                            fontSize: 12,
                            color: "#64748b",
                          }}
                        >
                          {" "}
                          {new Date(
                            e.endDate
                          ).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      )}
                    </td>

                    <td>
                      {Array.isArray(e.attendees) && e.attendees.length > 0
                        ? e.attendees.join(", ")
                        : "—"}
                    </td>

                    <td>
                      <StatusBadge status={e.status} />
                    </td>

                    <td>
                      <div className="td-actions">
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => openEdit(e)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(e._id)}
                        >
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
        eventTypes={EVENT_TYPES.filter(
          (t) => t !== "View All"
        )}
      />
    </div>
  );
}