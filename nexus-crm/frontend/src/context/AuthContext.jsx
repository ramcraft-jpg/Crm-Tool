import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef
} from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const API = "http://localhost:5000/api";

export function AuthProvider({ children }) {
  /* ── USER STATE ───────────────────────────────────────────── */
  const [user, setUser] = useState(() => {
    // Attempt to init user from localStorage (if exists & valid)
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
    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }
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
      // Check JWT validity by format
      if (!token.includes(".")) {
        throw new Error("Invalid token format");
      }

      const tokenParts = token.split(".");
      if (tokenParts.length < 2) {
        throw new Error("Invalid JWT structure");
      }
      let payload;
      try {
        payload = JSON.parse(atob(tokenParts[1]));
      } catch (e) {
        throw new Error("Failed to parse token payload");
      }

      // Only check exp if given - if not, trust token is valid
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      } else {
        // Only set user if not already present
        setUser(prev =>
          prev || JSON.parse(savedUser)
        );
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
    if (!user) {
      setLeads([]);
      setProjects([]);
      setTasks([]);
      setEvents([]);
      return;
    }

    const h = authHeader();

    axios
      .get(`${API}/leads`, h)
      .then((res) => setLeads(res.data))
      .catch(() => {});

    axios
      .get(`${API}/projects`, h)
      .then((res) => setProjects(res.data))
      .catch(() => {});

    axios
      .get(`${API}/tasks`, h)
      .then((res) => setTasks(res.data))
      .catch(() => {});

    axios
      .get(`${API}/events`, h)
      .then((res) => setEvents(res.data))
      .catch(() => {});
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
    </AuthContext.Provider>
  );
}

/* ── CUSTOM HOOK ────────────────────────────────────────────── */
export const useAuth = () => useContext(AuthContext);