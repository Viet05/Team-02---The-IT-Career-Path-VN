import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Register.css";

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const USERS_KEY = "mock_users"; // nơi lưu danh sách user mock
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

const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export default function Register() {
  const nav = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!fullName.trim()) return setError("Vui lòng nhập họ tên.");
    if (!isValidEmail(email)) return setError("Email không đúng định dạng.");
    if (pass.length < 6) return setError("Mật khẩu tối thiểu 6 ký tự.");
    if (pass !== confirm) return setError("Mật khẩu nhập lại không khớp.");
    if (!agree) return setError("Bạn cần đồng ý Terms & Privacy.");

    try {
      setLoading(true);

      // ✅ Lưu user vào LocalStorage (mock DB)
      const users = loadUsers();
      const key = email.trim().toLowerCase();

      if (key === "admin") {
        return setError("Email này không hợp lệ.");
      }

      if (users[key]) {
        return setError("Email đã tồn tại. Vui lòng đăng nhập.");
      }

      users[key] = {
        fullName: fullName.trim(),
        email: key,
        password: pass,
        role, // STUDENT | COMPANY
      };
      saveUsers(users);

      // ✅ Auto-login luôn (lưu token + role)
      const token = makeFakeJwt({
        sub: key,
        role,
        exp: Date.now() + 60 * 60 * 1000,
      });

      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(ROLE_KEY, role);

      // ✅ Redirect theo role
      nav(role === "COMPANY" ? "/company" : "/home", { replace: true });
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
          <label className="label">Full name</label>
          <input
            className="input"
            placeholder="Your name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
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

          {/* ✅ Role */}
          <div className="group">
            <div className="label" style={{ margin: 0 }}>Role</div>
            <div className="role-row">
              <label className="radio">
                <input
                  type="radio"
                  name="role"
                  checked={role === "STUDENT"}
                  onChange={() => setRole("STUDENT")}
                />
                <span>Student</span>
              </label>

              <label className="radio">
                <input
                  type="radio"
                  name="role"
                  checked={role === "COMPANY"}
                  onChange={() => setRole("COMPANY")}
                />
                <span>Company</span>
              </label>
            </div>
          </div>

          {/* ✅ Terms */}
          <label className="check">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />
            <span>I agree to Terms &amp; Privacy</span>
          </label>

          {/* ✅ Nút submit đúng chuẩn: KHÔNG bọc Link */}
          <button className="btn" type="submit" disabled={loading}>
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
