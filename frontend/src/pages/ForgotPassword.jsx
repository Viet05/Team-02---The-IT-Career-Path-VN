import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/login.css"; // dùng chung style với Login

const USERS_KEY = "mock_users";

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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

export default function ForgotPassword() {
  const nav = useNavigate();

  const [step, setStep] = useState(1); 
  const [email, setEmail] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSend = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!isValidEmail(email)) return setError("Email không đúng định dạng.");

    const key = email.trim().toLowerCase();
    const users = loadUsers();

    // mock check email tồn tại
    if (!users[key]) return setError("Email không tồn tại.");

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setMessage("Vui lòng đặt mật khẩu mới.");
      setStep(2);
    }, 300);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPass.length < 6) return setError("Mật khẩu tối thiểu 6 ký tự.");
    if (newPass !== confirm) return setError("Mật khẩu nhập lại không khớp.");

    const key = email.trim().toLowerCase();
    const users = loadUsers();

    if (!users[key]) return setError("Email không tồn tại.");

    setLoading(true);
    setTimeout(() => {
      users[key].password = newPass; // ✅ update mock password
      saveUsers(users);

      setLoading(false);
      setMessage("Đổi mật khẩu thành công. Vui lòng đăng nhập lại.");
      nav("/login", { replace: true });
    }, 300);
  };

  return (
    <div className="page">
      <div className="card">
        <div className="card-title">Forgot Password</div>
        <div className="card-subtitle">
          {step === 1 ? "Enter your email to reset password." : "Set your new password."}
        </div>

        {error && <div className="error">{error}</div>}
        {message && <div className="error" style={{ borderColor: "#111" }}>{message}</div>}

        {step === 1 ? (
          <form onSubmit={handleSend}>
            <label className="label">Email Address</label>
            <input
              className="input"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button className="login-btn" type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleUpdate}>
            <label className="label">New Password</label>
            <input
              className="input"
              type="password"
              placeholder="••••••••"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
            />

            <label className="label">Confirm Password</label>
            <input
              className="input"
              type="password"
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />

            <button className="login-btn" type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update password"}
            </button>
          </form>
        )}

        <div className="footer">
          Back to <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}
