import { useState, useEffect } from "react";
import { useAuth, API } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

export default function Auth() {
  const { login, showToast, user } = useAuth();
  const [view, setView] = useState("login");
  const navigate = useNavigate();

  /* LOGIN STATE */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /* REGISTER STATE */
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPass, setRegPass] = useState("");
  const [regConfirm, setRegConfirm] = useState("");

  /* FORGOT STATE */
  const [forgotEmail, setForgotEmail] = useState("");

  /* API CHECK */
  useEffect(() => {
    fetch(`${API}/auth/login`, { method: "OPTIONS" })
      .then(() => console.log("Backend Connected"))
      .catch(() => console.log("Backend Not Connected"));
  }, []);

  /* AUTO REDIRECT IF LOGGED IN */
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (user || token) {
      navigate("/");
    }
  }, [user, navigate]);

  /* LOGIN FUNCTION */
  const doLogin = async () => {
    if (!email) {
      return showToast("Please enter email", "danger");
    }

    if (!password) {
      return showToast("Please enter password", "danger");
    }

    try {
      /* VERY IMPORTANT FIX */
      const res = await authAPI.login(email, password);

      if (!res.token) {
        throw new Error("Token not received");
      }

      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res));

      login(res);

      showToast("Login Successful", "success");

      navigate("/");
    } catch (error) {
      console.log("LOGIN ERROR:", error);

      showToast(
        error?.response?.data?.message ||
          error?.message ||
          "Login Failed",
        "danger"
      );
    }
  };

  /* REGISTER FUNCTION */
  const doRegister = async () => {
    if (!regName) {
      return showToast("Please enter name", "danger");
    }

    if (!regEmail) {
      return showToast("Please enter email", "danger");
    }

    if (regPass.length < 6) {
      return showToast(
        "Password must be at least 6 characters",
        "danger"
      );
    }

    if (regPass !== regConfirm) {
      return showToast("Passwords do not match", "danger");
    }

    try {
      await authAPI.register({
        name: regName,
        email: regEmail,
        password: regPass,
      });

      showToast(
        "Registration Successful. Please Login",
        "success"
      );

      setView("login");
    } catch (error) {
      console.log(error);

      showToast(
        error?.response?.data?.message ||
          error?.message ||
          "Registration Failed",
        "danger"
      );
    }
  };

  /* SIMPLE LOGIN PAGE */
  return (
    <div className="login-page">
      <div className="login-card">
        {view === "login" ? (
          <>
            <h1>Welcome Back</h1>
            <p>Login to your CRM account</p>

            <div className="form-group">
              <label>Email</label>

              <input
                type="email"
                value={email}
                placeholder="Enter Email"
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>Password</label>

              <input
                type="password"
                value={password}
                placeholder="Enter Password"
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                onKeyDown={(e) =>
                  e.key === "Enter" && doLogin()
                }
              />
            </div>

            <button
              className="login-btn"
              onClick={doLogin}
            >
              Sign In
            </button>

            <div className="login-footer">
              Don’t have an account?

              <span
                onClick={() => setView("register")}
                style={{
                  color: "blue",
                  cursor: "pointer",
                  marginLeft: "6px",
                }}
              >
                Register
              </span>
            </div>
          </>
        ) : (
          <>
            <h1>Create Account</h1>
            <p>Register for your CRM account</p>

            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={regName}
                placeholder="Enter Name"
                onChange={(e) => setRegName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={regEmail}
                placeholder="Enter Email"
                onChange={(e) => setRegEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={regPass}
                placeholder="Enter Password"
                onChange={(e) => setRegPass(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                value={regConfirm}
                placeholder="Confirm Password"
                onChange={(e) => setRegConfirm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && doRegister()}
              />
            </div>

            <button className="login-btn" onClick={doRegister}>
              Sign Up
            </button>

            <div className="login-footer">
              Already have an account?
              <span
                onClick={() => setView("login")}
                style={{
                  color: "blue",
                  cursor: "pointer",
                  marginLeft: "6px",
                }}
              >
                Login
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}