import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth, API } from "../context/AuthContext";

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

  const [stats, setStats] = useState({ totalLeads: 0, totalProjects: 0, totalTasks: 0, totalEvents: 0 });
  const [recentTasks, setRecentTasks] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [leadStatus, setLeadStatus] = useState({ new: 0, contacted: 0, converted: 0 });
  const [loading, setLoading] = useState(true);

  const [showAllActivity, setShowAllActivity] = useState(false);
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [allTasks, setAllTasks] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  // Removed sidebar state and sidebarOpen because sidebar is gone

  const [weeklyActivity, setWeeklyActivity] = useState([]);

  // Fetch dashboard data
  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const [leadsRes, projectsRes, tasksRes, eventsRes] = await Promise.all([
        axios.get(`${API}/leads`, authHeader()),
        axios.get(`${API}/projects`, authHeader()),
        axios.get(`${API}/tasks`, authHeader()),
        axios.get(`${API}/events`, authHeader()),
      ]);
      const leads = leadsRes.data;
      const projects = projectsRes.data;
      const tasks = tasksRes.data;
      const events = eventsRes.data;

      setStats({
        totalLeads: leads.length,
        totalProjects: projects.length,
        totalTasks: tasks.length,
        totalEvents: events.length,
      });

      setLeadStatus({
        new: leads.filter((l) => l.status === "New").length,
        contacted: leads.filter((l) => l.status === "Contacted").length,
        converted: leads.filter((l) => l.status === "Converted").length,
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
      const weekData = weekDays.map((d, idx) => {
        const convertedLeads = leads.filter((lead) => {
          if (!lead.status || lead.status !== "Converted") return false;
          if (!lead.updatedAt) return false;
          const dt = new Date(lead.updatedAt);
          return (
            dt.getFullYear() === d.getFullYear() &&
            dt.getMonth() === d.getMonth() &&
            dt.getDate() === d.getDate()
          );
        }).length;

        const completedTasks = tasks.filter((task) => {
          if (!task.status || task.status.toLowerCase() !== "completed") return false;
          const completedDate = task.completedAt || task.updatedAt;
          if (!completedDate) return false;
          const dt = new Date(completedDate);
          return (
            dt.getFullYear() === d.getFullYear() &&
            dt.getMonth() === d.getMonth() &&
            dt.getDate() === d.getDate()
          );
        }).length;

        return {
          day: weekLabels[idx],
          converted: convertedLeads,
          completed: completedTasks,
        };
      });

      setWeeklyActivity(weekData);
    } catch (error) {
      console.log("Dashboard fetch error:", error);
      showToast("Failed to load dashboard data", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    // eslint-disable-next-line
  }, []);

  // Lead status percentages
  const total = leadStatus.new + leadStatus.contacted + leadStatus.converted || 1;
  const newPct = Math.round((leadStatus.new / total) * 100);
  const contactedPct = Math.round((leadStatus.contacted / total) * 100);
  const convertedPct = Math.round((leadStatus.converted / total) * 100);

  const statCards = [
    { icon: "🎯", value: stats.totalLeads, label: "Total Leads" },
    { icon: "📁", value: stats.totalProjects, label: "Total Projects" },
    { icon: "✅", value: stats.totalTasks, label: "Total Tasks" },
    { icon: "📅", value: stats.totalEvents, label: "Total Events" },
  ];

  if (loading) {
    return (
      <div style={{ padding: 30, textAlign: "center", color: "#64748b" }}>
        Loading dashboard...
      </div>
    );
  }

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "#f5f8fc", padding: 0, display: "flex" }}>
      {/* Removed Sidebar and Dashboard title */}
      <div style={{ flex: 1, marginLeft: 0 }}>
        {/* Removed Header (dashboard dashes and Dashboard title) */}

        {/* Main content */}
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

          {/* Chart + Lead Status */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px", marginBottom: "24px" }}>

            {/* Bar Chart */}
            <div style={{ background: "#fff", borderRadius: "24px", padding: "28px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px" }}>
                <h2>Weekly Activity Overview</h2>
                <button style={{ background: "#eff6ff", border: "1px solid #bfdbfe", padding: "8px 16px", borderRadius: "10px", color: "#2563eb" }}>
                  This Week
                </button>
              </div>
              <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", height: "220px" }}>
                {weeklyActivity.map((item, i) => {
                  const maxVal = Math.max(...weeklyActivity.map(w => w.completed + w.converted), 1);
                  const totalHeight = 160;
                  const barConverted = item.converted;
                  const barCompleted = item.completed;
                  const heightConverted = barConverted > 0 ? (barConverted / maxVal) * totalHeight : 0;
                  const heightCompleted = barCompleted > 0 ? (barCompleted / maxVal) * totalHeight : 0;
                  return (
                    <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "34px", display: "flex", flexDirection: "column-reverse" }}>
                        {/* Completed (yellow) - top */}
                        <div
                          style={{
                            width: "34px",
                            height: `${heightCompleted}px`,
                            background: "#f59e0b",
                            borderRadius: heightConverted > 0 ? "0 0 0 0" : "8px 8px 0 0",
                            transition: "height 0.3s",
                          }}
                        />
                        {/* Converted (green) - bottom */}
                        <div
                          style={{
                            width: "34px",
                            height: `${heightConverted}px`,
                            background: "#10b981",
                            borderRadius: heightCompleted > 0 ? "0 0 8px 8px" : "8px 8px 0 0",
                            transition: "height 0.3s",
                          }}
                        />
                      </div>
                      <span>{item.day}</span>
                      <div style={{ fontSize: "11px", color: "#64748b", lineHeight: 1.2, marginTop: "-5px" }}>
                        <span>🟢{item.converted}</span>{" / "}
                        <span style={{ color: "#edb31c" }}>🟡{item.completed}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop: 16, marginLeft: 8, display: "flex", gap: 14 }}>
                <span style={{ fontSize: "14px" }}><span style={{ display: "inline-block", verticalAlign: "middle", width: 12, height: 12, background: "#10b981", borderRadius: 3, marginRight: 4 }} />Converted</span>
                <span style={{ fontSize: "14px" }}><span style={{ display: "inline-block", verticalAlign: "middle", width: 12, height: 12, background: "#f59e0b", borderRadius: 3, marginRight: 4 }} />Completed</span>
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
                      #2563eb 0% ${newPct}%,
                      #10b981 ${newPct}% ${newPct + convertedPct}%,
                      #f59e0b ${newPct + convertedPct}% 100%
                    )`,
                    position: "relative",
                  }}
                >
                  <div style={{ width: "70px", height: "70px", background: "#fff", borderRadius: "50%", position: "absolute", top: "35px", left: "35px" }} />
                </div>
                <div style={{ lineHeight: "2" }}>
                  <p>🔵 New ({newPct}%) {leadStatus.new}</p>
                  <p>🟢 Converted ({convertedPct}%) {leadStatus.converted}</p>
                  <p>🟠 Contacted ({contactedPct}%) {leadStatus.contacted}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity + Upcoming Events */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>

            {/* Recent Tasks */}
            <div style={{ background: "#fff", borderRadius: "24px", padding: "28px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                <h2>Recent Activity</h2>
                <button
                  onClick={() => setShowAllActivity(true)}
                  style={{ background: "#eff6ff", border: "1px solid #bfdbfe", padding: "8px 16px", borderRadius: "10px", color: "#2563eb", cursor: "pointer" }}
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

            {/* Upcoming Events */}
            <div style={{ background: "#fff", borderRadius: "24px", padding: "28px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                <h2>Upcoming Events</h2>
                <button
                  onClick={() => setShowAllEvents(true)}
                  style={{ background: "#eff6ff", border: "1px solid #bfdbfe", padding: "8px 16px", borderRadius: "10px", color: "#2563eb", cursor: "pointer" }}
                >
                  View All
                </button>
              </div>
              <div style={{ lineHeight: "2.2" }}>
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event, i) => (
                    <p key={i}>📅 {event.title || event.name} {event.date ? new Date(event.date).toLocaleDateString() : "No Date"}</p>
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
                  onClick={() => setShowAllActivity(false)}
                  style={{ marginTop: "20px", background: "#2563eb", color: "#fff", border: "none", padding: "12px 24px", borderRadius: "10px", cursor: "pointer" }}
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
                  {allEvents.length > 0 ? (
                    allEvents.map((event, i) => (
                      <p key={i}>📅 {event.title || event.name} {event.date ? new Date(event.date).toLocaleDateString() : "No Date"}</p>
                    ))
                  ) : (
                    <p>No events found</p>
                  )}
                </div>
                <button
                  onClick={() => setShowAllEvents(false)}
                  style={{ marginTop: "20px", background: "#2563eb", color: "#fff", border: "none", padding: "12px 24px", borderRadius: "10px", cursor: "pointer" }}
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