import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Register.css";

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const USERS_KEY = "mock_users";

const loadUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || {};
  } catch {
    return {};
  }
};

const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export default function Register() {
  const nav = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) return setError("Vui lòng nhập username.");
    if (!isValidEmail(email)) return setError("Email không đúng định dạng.");
    if (pass.length < 6) return setError("Mật khẩu tối thiểu 6 ký tự.");
    if (pass !== confirm) return setError("Mật khẩu nhập lại không khớp.");
    if (!agree) return setError("Bạn cần đồng ý Terms & Privacy.");

    try {
      setLoading(true);

      const users = loadUsers();
      const key = email.trim().toLowerCase();
      const uname = username.trim();

      // check trùng email
      if (users[key]) return setError("Email đã tồn tại. Vui lòng đăng nhập.");

      // check trùng username
      const usernameExists = Object.values(users).some((u) => u.username === uname);
      if (usernameExists) return setError("Username đã tồn tại. Vui lòng chọn username khác.");

      users[key] = {
        username: uname,
        email: key,
        password: pass,
        role: "STUDENT", // nếu chưa làm chọn role, để mặc định
      };
      saveUsers(users);

      // ✅ xong: chuyển qua login và tự điền username
      nav("/login", { replace: true, state: { prefillUser: uname } });
      return;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h2 className="card-title">Sign up</h2>
        <p className="card-subtitle">Create a new account.</p>

        {error ? <div className="error">{error}</div> : null}

        <form onSubmit={onSubmit} className="form">
          <label className="label">User name</label>
          <input
            className="input"
            placeholder="Your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label className="label">Email Address</label>
          <input
            className="input"
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="label">Password</label>
          <input
            className="input"
            type="password"
            placeholder="••••••••"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />

          <label className="label">Confirm Password</label>
          <input
            className="input"
            type="password"
            placeholder="••••••••"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />

          <label className="check">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />
            <span>I agree to Terms &amp; Privacy</span>
          </label>

          <button className="register-btn" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>

        <div className="footer">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}
