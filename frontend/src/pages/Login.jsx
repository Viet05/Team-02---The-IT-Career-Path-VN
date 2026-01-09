import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/login.css";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Vui lòng nhập email và mật khẩu.");
      return;
    }

    try {
      setLoading(true);
      // TODO: gọi backend login sau
      nav("/dashboard");
    } catch {
      setError("Đăng nhập thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="card">
        <div className="card-title">Login</div>
        <div className="card-subtitle">Welcome back! Sign in to your account.</div>

        <button className="social-btn" type="button">Continue with GitHub</button>
        <button className="social-btn" type="button">Continue with Google</button>
        <button className="social-btn" type="button">Continue with LinkedIn</button>

        <div className="or">
          <span className="line" />
          <span className="or-text">OR</span>
          <span className="line" />
        </div>

        {error && <div className="error">{error}</div>}

        <form onSubmit={onSubmit}>
          <label className="label">Email Address</label>
          <input
            className="input"
            placeholder="email@example.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="label">Password</label>
          <input
            className="input"
            placeholder="••••••••"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="reset">
            <Link to="/reset-password">Reset your password?</Link>
          </div>

          <button className="login-btn" disabled={loading} type="submit">
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        <div className="footer">
          Don&apos;t have an account? <Link to="/signup">Sign up</Link>
        </div>
      </div>
    </div>
  );
}
