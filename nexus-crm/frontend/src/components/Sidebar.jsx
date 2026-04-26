import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { id: "dashboard", icon: "🏠", label: "Dashboard" },
  { id: "leads", icon: "🎯", label: "Lead Management", badgeKey: "leads" },
  { id: "projects", icon: "📂", label: "Projects", badgeKey: "projects" },
  { id: "tasks", icon: "✅", label: "Tasks", badgeKey: "tasks" },
  { id: "events", icon: "📅", label: "Events", badgeKey: "events" },
];

const BOTTOM_ITEMS = [
  { id: "profile", icon: "👤", label: "Profile" },
  { id: "settings", icon: "⚙️", label: "Settings" },
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
    <div
      style={{
        width: "280px",
        minHeight: "100vh",
        background: "#ffffff",
        borderRight: "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
  
      <div>
        <div
          style={{
            padding: "28px 26px",
            borderBottom: "1px solid #f1f5f9",
          }}
        >
          <div
            style={{
              fontSize: "20px",
              fontWeight: "700",
              color: "#2563eb",
            }}
          >
             CRM
          </div>

          <div
            style={{
              marginTop: "6px",
              fontSize: "13px",
              color: "#94a3b8",
              fontWeight: "500",
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            Tool Development
          </div>
        </div>

        {/* Navigation */}
        <div style={{ padding: "24px 14px" }}>
          {/* MAIN */}
          <div
            style={{
              fontSize: "13px",
              fontWeight: "700",
              color: "#94a3b8",
              marginBottom: "14px",
              paddingLeft: "12px",
              textTransform: "uppercase",
              letterSpacing: "1px",
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
                gap: "12px",
                padding: "14px 16px",
                borderRadius: "14px",
                cursor: "pointer",
                marginBottom: "10px",
                background:
                  activePage === item.id ? "#dbeafe" : "transparent",
                color:
                  activePage === item.id ? "#2563eb" : "#475569",
                fontWeight: activePage === item.id ? "600" : "500",
              }}
            >
              <span style={{ fontSize: "20px" }}>{item.icon}</span>

              <span style={{ flex: 1 }}>{item.label}</span>

              {item.badgeKey && (
                <div
                  style={{
                    minWidth: "26px",
                    height: "26px",
                    borderRadius: "50%",
                    background: "#2563eb",
                    color: "#ffffff",
                    fontSize: "13px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "600",
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
              marginTop: "28px",
              fontSize: "13px",
              fontWeight: "700",
              color: "#94a3b8",
              marginBottom: "14px",
              paddingLeft: "12px",
              textTransform: "uppercase",
              letterSpacing: "1px",
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
                gap: "12px",
                padding: "14px 16px",
                borderRadius: "14px",
                cursor: "pointer",
                marginBottom: "10px",
                color: "#475569",
                fontWeight: "500",
              }}
            >
              <span style={{ fontSize: "20px" }}>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* LOGOUT */}
      <div
        style={{
          padding: "24px",
          borderTop: "1px solid #f1f5f9",
        }}
      >
        <button
          onClick={logout}
          style={{
            background: "transparent",
            border: "none",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontSize: "18px",
            color: "#040665",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          <span> 
            <i className="fa-solid fa-right-from-bracket"> </i></span>
          Log Out
        </button>
      </div>
    </div>
  );
}