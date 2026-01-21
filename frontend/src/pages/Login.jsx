import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/login.css";

const USERS_KEY = "mock_users";
const TOKEN_KEY = "access_token";
const ROLE_KEY = "role";

const makeFakeJwt = (payload) => {
  const header = btoa(JSON.stringify({ alg: "none", typ: "JWT" }));
  const body = btoa(JSON.stringify(payload));
  return `${header}.${body}.fake`;
};

const loadUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || {};
  } catch {
    return {};
  }
};

export default function Login() {
  const nav = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Prefill username từ Register
  useEffect(() => {
    const prefill = location.state?.prefillUser;
    if (prefill) setUsername(prefill);
  }, [location.state]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) return setError("Vui lòng nhập username hoặc email.");
    if (!pass) return setError("Vui lòng nhập mật khẩu.");

    try {
      setLoading(true);

      // ✅ Check for hardcoded admin (admin@gmail.com)
      if ((username.trim() === "admin@gmail.com" || username.trim() === "admin") && pass === "admin") {
        const role = "ADMIN";
        const token = makeFakeJwt({
          sub: "admin@gmail.com",
          username: "admin",
          role,
          exp: Date.now() + 60 * 60 * 1000,
        });

        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(ROLE_KEY, role);
        localStorage.setItem("user_email", "admin@gmail.com");
        localStorage.setItem("user_name", "Admin");

        nav("/admin", { replace: true });
        return;
      }

      const usersObj = loadUsers();
      const users = Object.values(usersObj);

      // ✅ login bằng username hoặc email
      let user = users.find((u) => u.username === username.trim());
      if (!user) {
        user = users.find((u) => u.email === username.trim());
      }
      
      if (!user) return setError("Username hoặc email không tồn tại.");
      if (user.password !== pass) return setError("Sai mật khẩu.");

      // ✅ lưu token + role
      const role = user.role || "STUDENT";
      const token = makeFakeJwt({
        sub: user.email || user.username,
        username: user.username,
        role,
        exp: Date.now() + 60 * 60 * 1000,
      });

      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(ROLE_KEY, role);
      localStorage.setItem("user_email", user.email);
      localStorage.setItem("user_name", user.username);

      // ✅ Redirect theo role
      if (role === "ADMIN") nav("/admin", { replace: true });
      else if (role === "COMPANY") nav("/company", { replace: true });
      else nav("/home", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="card">
        <div className="card-title">Login</div>
        <div className="card-subtitle">Welcome back! Sign in to your account.</div>

        {error ? <div className="error">{error}</div> : null}

        <form onSubmit={onSubmit} className="form">
          <label className="label">Username or Email</label>
          <input
            className="input"
            placeholder="username or email@example.com"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />

          <label className="label">Password</label>
          <input
            className="input"
            placeholder="••••••••"
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            autoComplete="current-password"
          />

          <div className="reset">
            <Link to="/forgotPassword">Reset your password?</Link>
          </div>

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        <div className="footer">
          Don&apos;t have an account? <Link to="/register">Sign up</Link>
        </div>
      </div>
    </div>
  );
}
