import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef
} from "react";

// Use a local development API by default but allow .env override
const getDefaultAPI = () => (
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:5000/api"
);
export const API = getDefaultAPI();

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  /* ── USER STATE ───────────────────────────────────────────── */
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  /* ── TOAST STATE ──────────────────────────────────────────── */
  const [toast, setToast] = useState({
    msg: "",
    type: "",
    show: false,
  });

  const toastTimer = useRef(null);

  /* ── TOAST FUNCTION ───────────────────────────────────────── */
  const showToast = (msg, type = "") => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({
      msg,
      type,
      show: true,
    });
    toastTimer.current = setTimeout(() => {
      setToast((prev) => ({
        ...prev,
        show: false,
      }));
    }, 2800);
  };

  /* ── AUTH HEADER ──────────────────────────────────────────── */
  const authHeader = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  /* ── DATA STATES ──────────────────────────────────────────── */
  const [leads, setLeads] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);

  // --- Ensure we do not aggressively log out the user if local token exists and isn't expired ---
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!token || !savedUser) {
      setUser(null);
      return;
    }

    try {
      if (!token.includes(".")) throw new Error("Invalid token format");
      const tokenParts = token.split(".");
      if (tokenParts.length < 2) throw new Error("Invalid JWT structure");
      let payload;
      try {
        payload = JSON.parse(atob(tokenParts[1]));
      } catch {
        throw new Error("Failed to parse token payload");
      }
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      } else {
        setUser(prev => prev || JSON.parse(savedUser));
      }
    } catch (error) {
      console.error("Token validation failed:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    }
    // eslint-disable-next-line
  }, []);

  /* ── SYNC USER TO LOCALSTORAGE ────────────────────────────── */
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, [user]);

  /* ── FETCH ALL DATA AFTER LOGIN ───────────────────────────── */
  useEffect(() => {
    // Upon login, fetch resources if API is reachable
    if (!user) {
      setLeads([]);
      setProjects([]);
      setTasks([]);
      setEvents([]);
      return;
    }

    const h = authHeader();

    // Only attempt fetch if API is set
    const tryFetch = async (path, setter) => {
      try {
        const res = await fetch(`${API}/${path}`, h);
        // Detect network errors (failed to fetch) in addition to HTTP errors
        if (!res.ok) {
          let errorMsg = "";
          try {
            const errorData = await res.json();
            // If backend has a fetch failure, it should send message as "failed to fetch"
            if (
              errorData &&
              typeof errorData.message === "string" &&
              errorData.message.toLowerCase().includes("failed to fetch")
            ) {
              errorMsg = errorData.message;
            }
          } catch {
            // Ignore parse error, treat as generic fetch failure if res is not ok
          }
          setter([]);
          showToast(
            errorMsg
              ? `Failed to load ${path}: ${errorMsg} Please check backend/API connectivity.`
              : `Failed to load ${path}. Check backend/API URL in .env (current: ${API}).`,
            "danger"
          );
          return;
        }
        const data = await res.json();
        setter(data);
      } catch (err) {
        // If fetch itself throws, detect if it is a "failed to fetch" network error
        let showMsg = `Failed to load ${path}. Check backend/API URL in .env (current: ${API}).`;
        if (
          typeof err?.message === "string" &&
          err.message.toLowerCase().includes("failed to fetch")
        ) {
          showMsg = `Failed to load ${path}: Could not connect to backend (failed to fetch). Please check your API server and network.`;
        }
        setter([]);
        showToast(showMsg, "danger");
      }
    };

    tryFetch("leads", setLeads);
    tryFetch("projects", setProjects);
    tryFetch("tasks", setTasks);
    tryFetch("events", setEvents);
  }, [user]);

  /* ── LOGIN ────────────────────────────────────────────────── */
  const login = (userData) => {
    setUser(userData);
    showToast("Welcome back! 👋", "success");
  };

  /* ── LOGOUT ───────────────────────────────────────────────── */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    showToast("Logged out successfully!", "success");
  };

  /* ── PROVIDER ─────────────────────────────────────────────── */
  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        showToast,
        toast,
        authHeader,
        API,
        leads,
        setLeads,
        projects,
        setProjects,
        tasks,
        setTasks,
        events,
        setEvents,
      }}
    >
      {children}
      <div className={`toast ${toast.type} ${toast.show ? "show" : ""}`}>
        {toast.msg}
      </div>
      <RouterFutureWarnings />
    </AuthContext.Provider>
  );
}

/* ── REACT ROUTER v7 FUTURE WARNINGS COMPONENT ─────────────── */
function RouterFutureWarnings() {
  // Intentionally only shows in dev
  if (import.meta.env.PROD) return null;
  return (
    <div style={{
      fontSize: "small",
      color: "#ad7110",
      background: "#fff9eb",
      border: "1px solid #ffe2b4",
      padding: "8px",
      marginTop: "24px",
      marginBottom: "8px",
      borderRadius: "4px",
      maxWidth: 680
    }}>
      <b>⚠️ React Router v7 Future Flag Warnings:</b>
      <ul style={{ margin: '0.5em 0', paddingLeft: 24 }}>
        <li>
          <strong>startTransition:</strong>{" "}
          <span>
            React Router will wrap navigation state updates in <code>React.startTransition</code> in v7.
            You can opt-in early with the <code>v7_startTransition</code> future flag.<br />
            See <a href="https://reactrouter.com/v6/upgrading/future#v7_starttransition" target="_blank" rel="noopener noreferrer">docs</a>.
          </span>
        </li>
        <li>
          <strong>relativeSplatPath:</strong>{" "}
          <span>
            Relative route resolution within Splat routes is changing in v7.
            You can opt-in early with the <code>v7_relativeSplatPath</code> future flag.<br />
            See <a href="https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath" target="_blank" rel="noopener noreferrer">docs</a>.
          </span>
        </li>
      </ul>
    </div>
  );
}

/* ── CUSTOM HOOK ────────────────────────────────────────────── */
export const useAuth = () => useContext(AuthContext);