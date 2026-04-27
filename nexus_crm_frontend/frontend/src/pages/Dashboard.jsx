import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth, API } from "../context/AuthContext";

// LEAD STATUS COLORS
const COLOR_NEW = "#2563eb";        // Royal Blue
const COLOR_CONTACTED = "#A0AEC0";  // Soft Slate
const COLOR_CONVERTED = "#1e293b";  // Deep Navy

// Helper function to get the start of the current week (Monday)
const getStartOfWeek = () => {
  const now = new Date();
  const day = now.getDay() || 7;
  now.setHours(0, 0, 0, 0);
  now.setDate(now.getDate() - day + 1);
  return now;
};

// Helper function to get 7 dates for week starting Monday
const getWeekDays = () => {
  const start = getStartOfWeek();
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    dates.push(d);
  }
  return dates;
};

export default function Dashboard({ onOpenModal }) {
  const { authHeader, showToast } = useAuth();

  const [stats, setStats] = useState({
    totalLeads: 0,
    totalProjects: 0,
    totalTasks: 0,
    totalEvents: 0
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [leadStatus, setLeadStatus] = useState({ new: 0, contacted: 0, converted: 0 });
  const [leadsData, setLeadsData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAllActivity, setShowAllActivity] = useState(false);
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [allTasks, setAllTasks] = useState([]);
  const [allEvents, setAllEvents] = useState([]);

  const [weeklyLeadStatus, setWeeklyLeadStatus] = useState([]);

  // State for event editing/updating in the popup
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm, setEventForm] = useState({ title: "", date: "" });
  const [eventFormError, setEventFormError] = useState("");

  // NEW: dashboard-level floating error bar for event form errors shown at bottom-right
  const [dashboardError, setDashboardError] = useState("");

  // Keep a refetch flag for events changes
  const [eventsVersion, setEventsVersion] = useState(0);

  // Fetch dashboard data as a memoized function (to avoid unnecessary re-declares)
  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const [leadsRes, projectsRes, tasksRes, eventsRes] = await Promise.all([
        axios.get(`${API}/leads`, authHeader()),
        axios.get(`${API}/projects`, authHeader()),
        axios.get(`${API}/tasks`, authHeader()),
        axios.get(`${API}/events`, authHeader()),
      ]);
      const leads = leadsRes.data;
      setLeadsData(leads);
      const projects = projectsRes.data;
      const tasks = tasksRes.data;
      const events = eventsRes.data;

      setStats({
        totalLeads: leads.length,
        totalProjects: projects.length,
        totalTasks: tasks.length,
        totalEvents: events.length,
      });

      setRecentTasks(tasks.slice(0, 4));
      setAllTasks(tasks);

      const now = new Date();
      const upcoming = events
        .filter((e) => (e.date ? new Date(e.date) >= now : true))
        .slice(0, 4);

      setUpcomingEvents(upcoming);
      setAllEvents(events);

      const weekDays = getWeekDays();
      const weekLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      // Calculate per-day new/contacted/converted leads
      const weeklyStatusData = weekDays.map((d, idx) => {
        const newCount = leads.filter(l => {
          if (l.status !== "New") return false;
          const dt = new Date(l.createdAt);
          return (
            dt.getFullYear() === d.getFullYear() &&
            dt.getMonth() === d.getMonth() &&
            dt.getDate() === d.getDate()
          );
        }).length;
        const contactedCount = leads.filter(l => {
          if (l.status !== "Contacted") return false;
          const dt = new Date(l.updatedAt || l.createdAt);
          return (
            dt.getFullYear() === d.getFullYear() &&
            dt.getMonth() === d.getMonth() &&
            dt.getDate() === d.getDate()
          );
        }).length;
        const convertedCount = leads.filter(l => {
          if (l.status !== "Converted") return false;
          const created = l.createdAt ? new Date(l.createdAt) : null;
          const updated = l.updatedAt ? new Date(l.updatedAt) : created;
          return (
            (created &&
              created.getFullYear() === d.getFullYear() &&
              created.getMonth() === d.getMonth() &&
              created.getDate() === d.getDate()) ||
            (updated &&
              updated.getFullYear() === d.getFullYear() &&
              updated.getMonth() === d.getMonth() &&
              updated.getDate() === d.getDate())
          );
        }).length;

        return {
          day: weekLabels[idx],
          new: newCount,
          contacted: contactedCount,
          converted: convertedCount,
        };
      });

      setWeeklyLeadStatus(weeklyStatusData);

      setLeadStatus({
        new: leads.filter(l => l.status === "New").length,
        contacted: leads.filter(l => l.status === "Contacted").length,
        converted: leads.filter(l => l.status === "Converted").length,
      });
    } catch (error) {
      console.log("Dashboard fetch error:", error);
      showToast("Failed to load dashboard data", "danger");
    } finally {
      setLoading(false);
    }
  }, [authHeader, showToast, eventsVersion]);

  // Make dashboard update when event is possibly changed (as well as initial mount)
  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // Handler to refetch ALL dashboard data, used after closing All Events popup (simulate update after event change)
  const handleEventsPopupClose = () => {
    setShowAllEvents(false);
    setEditingEvent(null);
    setEventForm({ title: "", date: "" });
    setEventFormError("");
    setTimeout(() => {
      setEventsVersion((v) => v + 1);
    }, 250); // Give time for potential modal to close before fetching
  };

  const handleActivityPopupClose = () => {
    setShowAllActivity(false);
    // You may also want to refetch tasks here if needed, but following pattern, can trigger here if desired.
  };

  // Pie chart live calculation
  const leadStatusComputed = {
    new: leadsData.filter(l => l.status === "New").length,
    contacted: leadsData.filter(l => l.status === "Contacted").length,
    converted: leadsData.filter(l => l.status === "Converted").length,
  };
  const pieStatus = leadsData.length ? leadStatusComputed : leadStatus;
  const total =
    (pieStatus.new || 0) +
    (pieStatus.contacted || 0) +
    (pieStatus.converted || 0) || 1;
  const newPct = Math.round((pieStatus.new / total) * 100);
  const convertedPct = Math.round((pieStatus.converted / total) * 100);
  const contactedPct = Math.round((pieStatus.contacted / total) * 100);

  const statCards = [
    {
      icon: (
        <svg width="36" height="36" viewBox="0 0 22 22" fill="none" stroke={COLOR_NEW} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="8" width="5" height="10" rx="2"/>
          <rect x="13" y="4" width="5" height="14" rx="2"/>
        </svg>
      ),
      value: stats.totalLeads,
      label: "Total Leads"
    },
    {
      icon: (
        <svg width="36" height="36" viewBox="0 0 22 22" fill="none" stroke={COLOR_NEW} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3.5" y="6" width="15" height="10" rx="2"/>
          <path d="M7 10h2v2H7zM13 10h2v2h-2z" fill={COLOR_NEW}/>
        </svg>
      ),
      value: stats.totalProjects,
      label: "Total Projects"
    },
    {
      icon: (
        <svg width="36" height="36" viewBox="0 0 22 22" fill="none" stroke={COLOR_NEW} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="4" width="14" height="14" rx="3"/>
          <path d="M8 11.5l2.2 2 3.7-4" />
        </svg>
      ),
      value: stats.totalTasks,
      label: "Total Tasks"
    },
    {
      icon: (
        <svg width="36" height="36" viewBox="0 0 22 22" fill="none" stroke={COLOR_NEW} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3.5" y="5.5" width="15" height="13" rx="3"/>
          <path d="M7 3v3M15 3v3"/>
          <path d="M3.5 9.5h15"/>
        </svg>
      ),
      value: stats.totalEvents,
      label: "Total Events"
    },
  ];

  // -- NEW: Handler to open the edit popup for an event
  const handleEditEventClick = (event) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title || event.name || "",
      date: event.date ? event.date.slice(0, 10) : "",
    });
    setEventFormError("");
    setShowAllEvents(true);
  };

  // -- NEW: Handler for changing event form inputs
  const handleEventFormChange = (e) => {
    setEventForm({
      ...eventForm,
      [e.target.name]: e.target.value,
    });
    setEventFormError('');
    setDashboardError(""); // Clear dashboard error on input
  };

  // -- NEW: Handler for saving/updating event from dashboard popup
  const handleEventFormSubmit = async (e) => {
    e.preventDefault();
    // Validation
    if (!eventForm.title.trim() || !eventForm.date.trim()) {
      setEventFormError("Title and Date are required");
      setDashboardError("Event title and start date are required.");
      // Dashboard error bar will appear at bottom right and auto-hide
      setTimeout(() => setDashboardError(""), 4000);
      return;
    }
    try {
      await axios.put(
        `${API}/events/${editingEvent._id || editingEvent.id}`,
        { ...editingEvent, title: eventForm.title.trim(), date: eventForm.date },
        authHeader()
      );
      showToast("Event updated successfully", "success");
      setShowAllEvents(false);
      setEditingEvent(null);
      setEventForm({ title: "", date: "" });
      setEventFormError("");
      setTimeout(() => setEventsVersion((v) => v + 1), 250);
    } catch (error) {
      setEventFormError(
        error.response?.data?.message ||
          error.message ||
          "Failed to update event"
      );
      setDashboardError(
        error.response?.data?.message ||
        error.message ||
        "Failed to update event"
      );
      setTimeout(() => setDashboardError(""), 4000);
      showToast(
        error.response?.data?.message ||
          error.message ||
          "Failed to update event",
        "danger"
      );
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 30, textAlign: "center", color: "#64748b" }}>
        Loading dashboard...
      </div>
    );
  }

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "#f5f8fc", padding: 0, display: "flex" }}>
      <div style={{ flex: 1, marginLeft: 0 }}>
        <div style={{ width: "100%", minHeight: "calc(100vh)", background: "#f5f8fc", padding: "30px" }}>
          {/* Stat Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "24px" }}>
            {statCards.map((item, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: "18px", padding: "18px", minHeight: "160px" }}>
                <div style={{ fontSize: "24px" }}>{item.icon}</div>
                <h2 style={{ fontSize: "32px", margin: "12px 0" }}>{item.value}</h2>
                <p style={{ color: "#64748b", fontSize: "14px" }}>{item.label}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "24px" }}>
            {[
              { icon: "➕", label: "New Lead", modal: "lead" },
              { icon: "📁", label: "New Project", modal: "project" },
              { icon: "☑️", label: "New Task", modal: "task" },
              { icon: "📅", label: "New Event", modal: "event" },
            ].map((item, i) => (
              <div
                key={i}
                onClick={() => onOpenModal(item.modal)}
                style={{
                  background: "#fff",
                  borderRadius: "18px",
                  padding: "30px",
                  textAlign: "center",
                  cursor: "pointer",
                }}
              >
                <div style={{ fontSize: "32px", marginBottom: "10px" }}>{item.icon}</div>
                {item.label}
              </div>
            ))}
          </div>

          {/* Chart + Lead Status with Connected Weekly Activity */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px", marginBottom: "24px" }}>
            {/* Weekly Activity OverLead Status Connection Board */}
            <div style={{ background: "#fff", borderRadius: "24px", padding: "28px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px" }}>
                <h2>Weekly Lead Status Overview</h2>
                <button style={{ background: "#eff6ff", border: `1px solid #bfdbfe`, padding: "8px 16px", borderRadius: "10px", color: COLOR_NEW }}>
                  This Week
                </button>
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", height: "220px" }}>
                {weeklyLeadStatus.map((item, i) => {
                  // Stack bars for New, Contacted, Converted; each is lead status for that day
                  const maxVal = Math.max(...weeklyLeadStatus.map(
                    w => w.new + w.contacted + w.converted
                  ), 1);
                  const totalHeight = 160;
                  const heightNew = item.new > 0 ? (item.new / maxVal) * totalHeight : 0;
                  const heightContacted = item.contacted > 0 ? (item.contacted / maxVal) * totalHeight : 0;
                  const heightConverted = item.converted > 0 ? (item.converted / maxVal) * totalHeight : 0;
                  return (
                    <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "34px", display: "flex", flexDirection: "column-reverse", height: totalHeight }}>
                        {/* New (bottom) */}
                        <div
                          style={{
                            width: "34px",
                            height: `${heightNew}px`,
                            background: COLOR_NEW,
                            borderRadius:
                              heightContacted + heightConverted === 0
                                ? "8px 8px 0 0"
                                : "0 0 0 0",
                            transition: "height 0.3s",
                          }}
                        />
                        {/* Contacted (middle) */}
                        <div
                          style={{
                            width: "34px",
                            height: `${heightContacted}px`,
                            background: COLOR_CONTACTED,
                            borderRadius:
                              heightConverted === 0 && heightContacted > 0
                                ? "8px 8px 0 0"
                                : "0 0 0 0",
                            transition: "height 0.3s",
                          }}
                        />
                        {/* Converted (top) */}
                        <div
                          style={{
                            width: "34px",
                            height: `${heightConverted}px`,
                            background: COLOR_CONVERTED,
                            borderRadius: heightConverted > 0
                              ? "8px 8px 0 0"
                              : "0 0 0 0",
                            transition: "height 0.3s",
                          }}
                        />
                      </div>
                      <span>{item.day}</span>
                      <div style={{ fontSize: "11px", color: "#64748b", lineHeight: 1.2, marginTop: "-4px" }}>
                        <span style={{ color: COLOR_NEW }}>●{item.new}</span>{" / "}
                        <span style={{ color: COLOR_CONTACTED }}>●{item.contacted}</span>{" / "}
                        <span style={{ color: COLOR_CONVERTED }}>●{item.converted}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop: 16, marginLeft: 8, display: "flex", gap: 14 }}>
                <span style={{ fontSize: "14px" }}>
                  <span style={{
                    display: "inline-block",
                    verticalAlign: "middle",
                    width: 12,
                    height: 12,
                    background: COLOR_NEW,
                    borderRadius: 3,
                    marginRight: 4
                  }} />
                  New
                </span>
                <span style={{ fontSize: "14px" }}>
                  <span style={{
                    display: "inline-block",
                    verticalAlign: "middle",
                    width: 12,
                    height: 12,
                    background: COLOR_CONTACTED,
                    borderRadius: 3,
                    marginRight: 4
                  }} />
                  Contacted
                </span>
                <span style={{ fontSize: "14px" }}>
                  <span style={{
                    display: "inline-block",
                    verticalAlign: "middle",
                    width: 12,
                    height: 12,
                    background: COLOR_CONVERTED,
                    borderRadius: 3,
                    marginRight: 4
                  }} />
                  Converted
                </span>
              </div>
            </div>

            {/* Lead Status Pie */}
            <div style={{ background: "#fff", borderRadius: "24px", padding: "28px" }}>
              <h2 style={{ marginBottom: "30px" }}>Lead Status</h2>
              <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <div
                  style={{
                    width: "140px",
                    height: "140px",
                    borderRadius: "50%",
                    background: `conic-gradient(
                      ${COLOR_NEW} 0% ${newPct}%,
                      ${COLOR_CONVERTED} ${newPct}% ${newPct + convertedPct}%,
                      ${COLOR_CONTACTED} ${newPct + convertedPct}% 100%
                    )`,
                    position: "relative",
                  }}
                >
                  <div style={{
                    width: "70px",
                    height: "70px",
                    background: "#fff",
                    borderRadius: "50%",
                    position: "absolute",
                    top: "35px",
                    left: "35px"
                  }} />
                </div>
                <div style={{ lineHeight: "2" }}>
                  <p><span style={{ color: COLOR_NEW }}>●</span> New ({newPct}%) {pieStatus.new}</p>
                  <p><span style={{ color: COLOR_CONVERTED }}>●</span> Converted ({convertedPct}%) {pieStatus.converted}</p>
                  <p><span style={{ color: COLOR_CONTACTED }}>●</span> Contacted ({contactedPct}%) {pieStatus.contacted}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity + Upcoming Events */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div style={{ background: "#fff", borderRadius: "24px", padding: "28px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                <h2>Recent Activity</h2>
                <button
                  onClick={() => setShowAllActivity(true)}
                  style={{ background: "#eff6ff", border: `1px solid #bfdbfe`, padding: "8px 16px", borderRadius: "10px", color: COLOR_NEW, cursor: "pointer" }}
                >
                  View All
                </button>
              </div>
              <div style={{ lineHeight: "2.2" }}>
                {recentTasks.length > 0 ? (
                  recentTasks.map((task, i) => (
                    <p key={i}>✅ {task.title || task.name} {task.status || "Pending"}</p>
                  ))
                ) : (
                  <p style={{ color: "#64748b" }}>No recent activity found</p>
                )}
              </div>
            </div>
            <div style={{ background: "#fff", borderRadius: "24px", padding: "28px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                <h2>Upcoming Events</h2>
                <button
                  onClick={() => setShowAllEvents(true)}
                  style={{ background: "#eff6ff", border: `1px solid #bfdbfe`, padding: "8px 16px", borderRadius: "10px", color: COLOR_NEW, cursor: "pointer" }}
                >
                  View All
                </button>
              </div>
              <div style={{ lineHeight: "2.2" }}>
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span>
                        📅 {event.title || event.name} {event.date ? new Date(event.date).toLocaleDateString() : "No Date"}
                      </span>
                      <button
                        style={{
                          marginLeft: 12,
                          padding: "2px 7px",
                          fontSize: 12,
                          borderRadius: 5,
                          border: "1px solid #cbd5e1",
                          cursor: "pointer",
                          background: "#e0e7ef",
                          color: "#1e293b",
                        }}
                        onClick={() => handleEditEventClick(event)}
                        title="Edit Event"
                      >
                        Edit
                      </button>
                    </div>
                  ))
                ) : (
                  <p style={{ color: "#64748b" }}>No upcoming events found</p>
                )}
              </div>
            </div>
          </div>
          {/* All Activity Popup */}
          {showAllActivity && (
            <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.25)", backdropFilter: "blur(6px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 999 }}>
              <div style={{ width: "500px", background: "#fff", borderRadius: "24px", padding: "30px", maxHeight: "70vh", overflowY: "auto" }}>
                <h2>All Recent Activities</h2>
                <div style={{ lineHeight: "2.2", marginTop: "20px" }}>
                  {allTasks.length > 0 ? (
                    allTasks.map((task, i) => (
                      <p key={i}>✅ {task.title || task.name} {task.status || "Pending"}</p>
                    ))
                  ) : (
                    <p>No activity found</p>
                  )}
                </div>
                <button
                  onClick={handleActivityPopupClose}
                  style={{ marginTop: "20px", background: COLOR_NEW, color: "#fff", border: "none", padding: "12px 24px", borderRadius: "10px", cursor: "pointer" }}
                >
                  Close
                </button>
              </div>
            </div>
          )}
          {/* All Events Popup */}
          {showAllEvents && (
            <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.25)", backdropFilter: "blur(6px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 999 }}>
              <div style={{ width: "500px", background: "#fff", borderRadius: "24px", padding: "30px", maxHeight: "70vh", overflowY: "auto" }}>
                <h2>All Upcoming Events</h2>
                <div style={{ lineHeight: "2.2", marginTop: "20px" }}>
                  {/* If editing, show the event edit form instead of list */}
                  {editingEvent ? (
                    <form onSubmit={handleEventFormSubmit}>
                      <div style={{ marginBottom: "15px" }}>
                        <label>
                          Title
                          <input
                            style={{
                              display: "block",
                              marginTop: 3,
                              border: "1px solid #cbd5e1",
                              borderRadius: 6,
                              padding: "6px 10px",
                              width: "100%",
                              fontFamily: "inherit",
                              fontSize: 16,
                            }}
                            type="text"
                            name="title"
                            value={eventForm.title}
                            onChange={handleEventFormChange}
                            autoFocus
                          />
                        </label>
                      </div>
                      <div style={{ marginBottom: "15px" }}>
                        <label>
                          Date
                          <input
                            style={{
                              display: "block",
                              marginTop: 3,
                              border: "1px solid #cbd5e1",
                              borderRadius: 6,
                              padding: "6px 10px",
                              width: "100%",
                              fontFamily: "inherit",
                              fontSize: 16,
                            }}
                            type="date"
                            name="date"
                            value={eventForm.date}
                            onChange={handleEventFormChange}
                          />
                        </label>
                      </div>
                      {eventFormError && (
                        <div style={{ color: "red", marginBottom: 12 }}>{eventFormError}</div>
                      )}
                      <div style={{ display: "flex", gap: 10 }}>
                        <button
                          type="submit"
                          style={{
                            background: COLOR_NEW,
                            color: "#fff",
                            border: "none",
                            padding: "12px 24px",
                            borderRadius: "10px",
                            cursor: "pointer",
                          }}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingEvent(null);
                            setEventForm({ title: "", date: "" });
                            setEventFormError("");
                          }}
                          style={{
                            border: `1px solid #cbd5e1`,
                            padding: "12px 24px",
                            borderRadius: "10px",
                            cursor: "pointer",
                            background: "#f3f4f8",
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    allEvents.length > 0 ? (
                      allEvents.map((event, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <span>
                            📅 {event.title || event.name} {event.date ? new Date(event.date).toLocaleDateString() : "No Date"}
                          </span>
                          <button
                            style={{
                              marginLeft: 12,
                              padding: "2px 7px",
                              fontSize: 12,
                              borderRadius: 5,
                              border: "1px solid #cbd5e1",
                              cursor: "pointer",
                              background: "#e0e7ef",
                              color: "#1e293b",
                            }}
                            onClick={() => handleEditEventClick(event)}
                            title="Edit Event"
                          >
                            Edit
                          </button>
                        </div>
                      ))
                    ) : (
                      <p>No events found</p>
                    )
                  )}
                </div>
                <button
                  onClick={handleEventsPopupClose}
                  style={{ marginTop: "20px", background: COLOR_NEW, color: "#fff", border: "none", padding: "12px 24px", borderRadius: "10px", cursor: "pointer" }}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}