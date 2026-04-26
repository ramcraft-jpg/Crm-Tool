import { useAuth } from "../context/AuthContext";

// Professional SVG Icons for Main Nav
const ICONS = {
  dashboard: (
    <svg width="22" height="22" fill="none" stroke="#2563eb" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="8" width="5" height="10" rx="2"/><rect x="13" y="4" width="5" height="14" rx="2"/></svg>
  ),
  leads: (
    <svg width="22" height="22" fill="none" stroke="#2563eb" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="7.5" r="3.5"/><path d="M3.5 18c0-3.2 5-4.5 7.5-4.5s7.5 1.3 7.5 4.5" /></svg>
  ),
  projects: (
    <svg width="22" height="22" fill="none" stroke="#2563eb" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3.5" y="6" width="15" height="10" rx="2"/><path d="M7 10h2v2H7zM13 10h2v2h-2z" fill="#2563eb"/></svg>
  ),
  tasks: (
    <svg width="22" height="22" fill="none" stroke="#2563eb" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="14" height="14" rx="3"/><path d="M8 11.5l2.2 2 3.7-4" /></svg>
  ),
  events: (
    <svg width="22" height="22" fill="none" stroke="#2563eb" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3.5" y="5.5" width="15" height="13" rx="3"/><path d="M7 3v3M15 3v3"/><path d="M3.5 9.5h15"/></svg>
  ),
  profile: (
    <svg width="22" height="22" fill="none" stroke="#2563eb" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="8.5" r="3.5"/><path d="M3.5 18c0-3.2 5-4.5 7.5-4.5s7.5 1.3 7.5 4.5" /></svg>
  ),
  settings: (
    <svg width="22" height="22" fill="none" stroke="#2563eb" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="3"/><path d="M19 11a8 8 0 0 0-1.6-4.8l-1.1-1.1a2 2 0 0 0-2.7-2.7l-1.1-1.1A8 8 0 0 0 11 3a8 8 0 0 0-4.8 1.6l-1.1 1.1a2 2 0 0 0-2.7 2.7l-1.1 1.1A8 8 0 0 0 3 11a8 8 0 0 0 1.6 4.8l1.1 1.1a2 2 0 0 0 2.7 2.7l1.1 1.1A8 8 0 0 0 11 19a8 8 0 0 0 4.8-1.6l1.1-1.1a2 2 0 0 0 2.7-2.7l1.1-1.1A8 8 0 0 0 19 11z"/></svg>
  ),
  logout: (
    <svg width="22" height="22" fill="none" stroke="#e11d48" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M15 16l5-5-5-5"/><path d="M20 11H9"/><path d="M4 4v14a2 2 0 0 0 2 2h5"/></svg>
  ),
};

const NAV_ITEMS = [
  { id: "dashboard", icon: ICONS.dashboard, label: "Dashboard" },
  { id: "leads", icon: ICONS.leads, label: "Lead Management", badgeKey: "leads" },
  { id: "projects", icon: ICONS.projects, label: "Projects", badgeKey: "projects" },
  { id: "tasks", icon: ICONS.tasks, label: "Tasks", badgeKey: "tasks" },
  { id: "events", icon: ICONS.events, label: "Events", badgeKey: "events" },
];

const BOTTOM_ITEMS = [
  { id: "profile", icon: ICONS.profile, label: "Profile" },
  { id: "settings", icon: ICONS.settings, label: "Settings" },
];

export default function Sidebar({ activePage, onNavigate }) {
  const { leads, projects, tasks, events, logout } = useAuth();

  const counts = {
    leads: leads.length,
    projects: projects.length,
    tasks: tasks.length,
    events: events.length,
  };

  return (
    <aside
      style={{
        width: "260px",
        minHeight: "100vh",
        background: "linear-gradient(134deg, #fff 72%, #f2f6fb 100%)",
        borderRight: "1px solid #e5e7eb",
        boxShadow: "2px 0 14px 0 rgba(39, 102, 255, 0.06)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "box-shadow 0.2s",
      }}
    >
      {/* Logo & Brand Section */}
      <div>
        <div
          style={{
            padding: "32px 26px 20px 26px",
            borderBottom: "1px solid #f1f5f9",
            background: "#f4f6fa",
            // removed the dark blue gradient, use light grey
            boxShadow: "0 2px 10px 0 rgba(37,99,235,0.06)",
            borderTopLeftRadius: "0",
            borderTopRightRadius: "0",
          }}
        >
          <div
            style={{
              fontSize: "27px",
              fontWeight: "800",
              color: "#334155",
              // remove text shadow and blue color, grey for heading
              letterSpacing: "2px",
              textTransform: "uppercase",
              fontFamily: "'Inter', system-ui, sans-serif",
            }}
          >
            CRM
          </div>
          <div
            style={{
              marginTop: "6px",
              fontSize: "13.5px",
              color: "#64748b",
              fontWeight: "500",
              letterSpacing: "1px",
              textTransform: "uppercase",
              opacity: 0.6,
            }}
          >
            Tool Development
          </div>
        </div>

        <div style={{ padding: "28px 10px 0 10px" }}>
          {/* MAIN */}
          <div
            style={{
              fontSize: "12.2px",
              fontWeight: "700",
              color: "#a5b4fc",
              marginBottom: "18px",
              paddingLeft: "18px",
              textTransform: "uppercase",
              letterSpacing: "1.5px",
            }}
          >
            Main
          </div>

          {NAV_ITEMS.map((item) => (
            <div
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                padding: activePage === item.id ? "13px 18px" : "12px 18px",
                borderRadius: "12px",
                cursor: "pointer",
                marginBottom: "10px",
                background:
                  activePage === item.id
                    ? "linear-gradient(91deg, #2563eb20 68%, #eff6ff 100%)"
                    : "transparent",
                color:
                  activePage === item.id ? "#133181" : "#334155",
                fontWeight: activePage === item.id ? "700" : "500",
                boxShadow:
                  activePage === item.id
                    ? "0 3px 12px 0 #2563eb11"
                    : "none",
                border:
                  activePage === item.id
                    ? "1.5px solid #2563eb44"
                    : "1.5px solid transparent",
                transition: "background 0.19s, box-shadow 0.15s, border 0.18s",
              }}
            >
              <span style={{ width: 24, display: "flex", justifyContent: "center" }}>{item.icon}</span>
              <span style={{ flex: 1, fontSize: "16px" }}>{item.label}</span>
              {item.badgeKey && (
                <div
                  style={{
                    minWidth: "27px",
                    height: "27px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #2563eb 77%, #1d4ed8 100%)",
                    color: "#ffffff",
                    fontSize: "14.2px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "700",
                    boxShadow: "0 1px 7px 0 #2563eb33",
                    border: "1.5px solid #fff",
                  }}
                >
                  {counts[item.badgeKey]}
                </div>
              )}
            </div>
          ))}

          {/* ACCOUNT */}
          <div
            style={{
              marginTop: "34px",
              fontSize: "12.2px",
              fontWeight: "700",
              color: "#a5b4fc",
              marginBottom: "16px",
              paddingLeft: "18px",
              textTransform: "uppercase",
              letterSpacing: "1.5px",
            }}
          >
            Account
          </div>

          {BOTTOM_ITEMS.map((item) => (
            <div
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "15px",
                padding: "12px 18px",
                borderRadius: "12px",
                cursor: "pointer",
                marginBottom: "6px",
                color: "#334155",
                fontWeight: "500",
                background: activePage === item.id ? "#e0e7ff" : "transparent",
                border:
                  activePage === item.id
                    ? "1.5px solid #2563eb33"
                    : "1.5px solid transparent",
                transition: "background 0.16s, border 0.14s",
              }}
            >
              <span style={{ width: 23, display: "flex", justifyContent: "center" }}>{item.icon}</span>
              <span style={{ fontSize: "15px" }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* LOGOUT */}
      <div
        style={{
          padding: "27px 23px 26px 23px",
          borderTop: "1px solid #f1f5f9",
          background: "#f5f8fc",
        }}
      >
        <button
          onClick={logout}
          style={{
            background: "linear-gradient(90deg,#fff,#e3eafe 77%)",
            border: "1.3px solid #e0e7ff",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            gap: "13px",
            fontSize: "16.5px",
            color: "#e11d48",
            cursor: "pointer",
            fontWeight: "700",
            width: "100%",
            padding: "11px 4px",
            boxShadow: "0 1px 6px 0 #9ca3af17",
            letterSpacing: "1px",
            transition: "background 0.15s, color 0.15s",
          }}
        >
          <span style={{ width: 21, display: "flex", justifyContent: "center" }}>{ICONS.logout}</span>
          Log Out
        </button>
      </div>
    </aside>
  );
}