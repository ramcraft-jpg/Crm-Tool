import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth, API } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const { login, showToast, user } = useAuth();
  const [view, setView] = useState("login");
  const navigate = useNavigate();

  // Login
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");

  // Register
  const [regName,    setRegName]    = useState("");
  const [regEmail,   setRegEmail]   = useState("");
  const [regPass,    setRegPass]    = useState("");
  const [regConfirm, setRegConfirm] = useState("");

  // Forgot
  const [forgotEmail, setForgotEmail] = useState("");

  // If already authenticated, redirect to home/dashboard page
  useEffect(() => {
    // If there is a user or token in localStorage, redirect to dashboard
    const token = localStorage.getItem("token");
    if (user || token) {
      // Optionally, you can add a user validation step here with backend if required
      navigate("/");
    }
  }, [user, navigate]);

  /* ── LOGIN ────────────────────────────────────────────────── */
  const doLogin = async () => {
    if (!email)    return showToast("Please enter your email", "danger");
    if (!password) return showToast("Please enter your password", "danger");

    try {
      const res = await axios.post(`${API}/auth/login`, { email, password });
      localStorage.setItem("token", res.data.token);
      login(res.data); // real user from MongoDB
      navigate("/");
    } catch (error) {
      showToast(error.response?.data?.message || "Login failed", "danger");
    }
  };

  /* ── REGISTER ─────────────────────────────────────────────── */
  const doRegister = async () => {
    if (!regName)           return showToast("Please enter your name", "danger");
    if (!regEmail)          return showToast("Please enter your email", "danger");
    if (regPass.length < 6) return showToast("Password must be at least 6 characters", "danger");
    if (regPass !== regConfirm) return showToast("Passwords do not match!", "danger");

    try {
      await axios.post(`${API}/auth/register`, {
        name: regName, email: regEmail, password: regPass,
      });
      showToast("Account created! Please Sign In", "success");
      setTimeout(() => setView("login"), 1500);
    } catch (error) {
      showToast(error.response?.data?.message || "Registration failed", "danger");
    }
  };

  /* ── FORGOT PASSWORD ──────────────────────────────────────── */
  const doForgot = () => {
    if (!forgotEmail) return showToast("Please enter your email", "danger");
    showToast("Reset link sent to " + forgotEmail, "success");
    setTimeout(() => setView("login"), 1500);
  };

  const Blobs = () => (
    <>
      <div className="login-blob" style={{ width: 400, height: 400, background: "rgba(37,99,235,0.1)", top: -100, left: -150 }} />
      <div className="login-blob" style={{ width: 300, height: 300, background: "rgba(16,185,129,0.08)", bottom: -50, right: -80 }} />
    </>
  );

  /* ── FORGOT PAGE ──────────────────────────────────────────── */
  if (view === "forgot") {
    return (
      <div className="login-page">
        <Blobs />
        <div className="login-card">
          <div className="back-link" onClick={() => setView("login")}>← Back to Sign In</div>
          <div className="login-page-title">Forgot Password?</div>
          <div className="login-page-sub">Enter your email and we'll send you a reset link.</div>
          <div className="login-form">
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label>Email Address</label>
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="admin@nexus.com"
              />
            </div>
            <button className="login-btn" onClick={doForgot}>Send Reset Link</button>
          </div>
        </div>
      </div>
    );
  }

  /* ── REGISTER PAGE ────────────────────────────────────────── */
  if (view === "register") {
    return (
      <div className="login-page">
        <Blobs />
        <div className="login-card">
          <div className="back-link" onClick={() => setView("login")}>← Back to Sign In</div>
          <div className="login-page-title">Create Account</div>
          <div className="login-page-sub">Join your team's CRM workspace</div>
          <div className="login-form">
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label>Full Name</label>
              <input type="text" value={regName} onChange={(e) => setRegName(e.target.value)} placeholder="Your full name" />
            </div>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label>Email Address</label>
              <input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} placeholder="you@company.com" />
            </div>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label>Password</label>
              <input type="password" value={regPass} onChange={(e) => setRegPass(e.target.value)} placeholder="Create a strong password" />
            </div>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label>Confirm Password</label>
              <input type="password" value={regConfirm} onChange={(e) => setRegConfirm(e.target.value)} placeholder="Re-enter your password" />
            </div>
            <button className="login-btn" onClick={doRegister}>Create Account</button>
          </div>
          <div className="login-footer">
            Already have an account?{" "}
            <span style={{ color: "var(--blue)", cursor: "pointer", fontWeight: 500 }} onClick={() => setView("login")}>
              Sign In
            </span>
          </div>
        </div>
      </div>
    );
  }

  /* ── LOGIN PAGE ───────────────────────────────────────────── */
  return (
    <div className="login-page">
      <Blobs />
      <div className="login-card">
        <div className="login-page-title">Welcome Back</div>
        <div className="login-page-sub">Sign in to your CRM account</div>
        <div className="login-form">
          <div className="form-group" style={{ marginBottom: 16 }}>
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@nexus.com"
            />
          </div>
          <div className="form-group" style={{ marginBottom: 16 }}>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              onKeyDown={(e) => e.key === "Enter" && doLogin()}
            />
          </div>
          <button className="login-btn" onClick={doLogin}>Sign In</button>
        </div>
        <div className="login-footer">
          Don't have an account?{" "}
          <span style={{ color: "var(--blue)", cursor: "pointer", fontWeight: 500 }} onClick={() => setView("register")}>
            Register
          </span>
        </div>
        <div style={{ textAlign: "center", marginTop: 12 }}>
          <span style={{ color: "var(--blue)", cursor: "pointer", fontSize: 13 }} onClick={() => setView("forgot")}>
            Forgot Password?
          </span>
        </div>
      </div>
    </div>
  );
}