import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserState } from "../store/useLocalStorage";
import Card from "../components/Card";
import Button from "../components/Button";
import { toast } from "../components/Toast";
import "../styles/login.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useUserState();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Mock login - in real app, call API
    setTimeout(() => {
      // Check if admin login
      if (formData.email === "admin@gmail.com" && formData.password === "admin") {
        login({
          name: "Admin",
          email: "admin@gmail.com",
          role: "admin",
        });
        toast.success("Logged in as admin!");
        navigate("/admin-dashboard");
      } else {
        // Regular user login
        login({
          name: formData.email.split("@")[0],
          email: formData.email,
          role: "user",
        });
        toast.success("Logged in successfully!");
        navigate("/hub");
      }
      setLoading(false);
    }, 500);
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
