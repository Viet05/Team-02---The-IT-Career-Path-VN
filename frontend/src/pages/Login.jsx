import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/login.css";

import { loginMock } from "../services/authMock";
import { saveSession } from "../services/auth";

const routeByRole = (role) => {
  if (role === "Admin") return "/admin";
  if (role === "Company") return "/company";
  return "/home"; // Student mặc định
};

export default function Login() {
//   const nav = useNavigate();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

    const [searchParams] = useSearchParams();

      useEffect(() => {
        if (searchParams.get("verified") === "true") {
          alert("Xác thực email thành công! Vui lòng đăng nhập.");
        }
      }, []);

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//
//     try {
//       setLoading(true);
//
//       // ✅ chưa gọi backend: dùng mock
//       const { token, role } = await loginMock({ email, password });
//
//       // ✅ lưu token + role
//       saveSession({ token, role });
//
//       // ✅ redirect theo role
//       nav(routeByRole(role), { replace: true });
//     } catch (err) {
//       setError(err?.message || "Đăng nhập thất bại.");
//     } finally {
//       setLoading(false);
//     }
//   };

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
            type="text"
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
            <Link to="/forgotPassword">Forgot Password?</Link>
          </div>

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        <div className="footer">
          Don&apos;t have an account? <Link to="/register">Sign up</Link>
        </div>

        <div style={{ marginTop: 10, fontSize: 12, opacity: 0.7 }}>
          Admin test: email <b>admin</b>, password <b>admin</b>
        </div>
      </div>
    </div>
  );
}
