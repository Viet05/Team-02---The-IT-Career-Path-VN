import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserState } from "../store/useLocalStorage";
import Card from "../components/Card";
import Button from "../components/Button";
import { toast } from "../components/Toast";
import "../styles/login.css";

import { authService } from "../services/auth";
import { saveSession } from "../services/session";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useUserState();

  const [formData, setFormData] = useState({ email: "admin@test.com", password: "admin" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await authService.login(formData.email, formData.password);

      // data = { accessToken, tokenType, userId, userName, role }
      const token = data.accessToken;
      const roleRaw = data.role;
      const role = (roleRaw || "user").toString().toLowerCase();

      if (token) saveSession({ token, role });

      // Update store UI with user info from login response
      login({
        name: data.userName || formData.email.split("@")[0],
        email: formData.email,
        role,
        userId: data.userId,
      });

      toast.success("Logged in successfully!");

      if (role === "admin") navigate("/admin-dashboard");
      else navigate("/hub");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="auth-card">
      <div className="card-title">Welcome Back</div>
      <div className="card-subtitle">Sign in to continue your learning journey</div>

      <form onSubmit={handleSubmit} className="form">
        <label className="label">Email</label>
        <input
          className="input"
          type="email"
          placeholder="your@email.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />

        <label className="label">Password</label>
        <input
          className="input"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />

        <div className="reset">
          <Link to="/auth/forgot">Forgot password?</Link>
        </div>

        <Button variant="primary" fullWidth type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <div className="footer">
        Don't have an account? <Link to="/auth/signup">Sign up</Link>
      </div>
    </Card>
  );
}
