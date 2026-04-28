import { useState } from "react";
import { CgProfile } from "react-icons/cg";

const PAGE_TITLES = {
  dashboard: "Dashboard",
  leads: "Lead Management",
  projects: "Projects",
  tasks: "Tasks",
  events: "Events",
  profile: "Profile",
  settings: "Settings",
};

export default function Navbar({ activePage, onNavigate }) {
  const [search, setSearch] = useState("");

  const handleSearch = () => {
    const value = search.toLowerCase().trim();

    if (value.includes("dashboard")) {
      onNavigate("dashboard");
    } else if (value.includes("lead")) {
      onNavigate("leads");
    } else if (value.includes("project")) {
      onNavigate("projects");
    } else if (value.includes("task")) {
      onNavigate("tasks");
    } else if (value.includes("event")) {
      onNavigate("events");
    } else if (value.includes("profile")) {
      onNavigate("profile");
    } else if (value.includes("setting")) {
      onNavigate("settings");
    } else {
      alert("Page not found");
    }

    setSearch("");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "5px 20px",
        background: "#f8fafc",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      {/* Left Side Title */}
      <div
        style={{
          fontSize: "20px",
          fontWeight: "700",
          color: "#1e293b",
        }}
      >
        {PAGE_TITLES[activePage] || activePage}
      </div>

      {/* Right Side */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "18px",
        }}
      >
        {/* Search Box */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "#ffffff",
            border: "1px solid #dbeafe",
            borderRadius: "999px",
            padding: "4px 16px",
            width: "280px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
          }}
        >
          <span
            style={{
              marginRight: "10px",
              fontSize: "15px",
              color: "#94a3b8",
              cursor: "pointer",
            }}
            onClick={handleSearch}
          >
            🔍
          </span>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            placeholder="Search pages..."
            style={{
              border: "none",
              outline: "none",
              width: "100%",
              fontSize: "12px",
              background: "transparent",
              color: "#334155",
            }}
          />
        </div>

        {/* Profile Avatar */}
        <div
          onClick={() => onNavigate("profile")}
          style={{
            width: "46px",
            height: "46px",
            borderRadius: "50%",
            background: " #ffffff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#2563eb",
            fontSize: "20px",
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(37,99,235,0.2)",
          }}
        >
          <CgProfile />
     
        </div>
      </div>
    </div>
  );
}