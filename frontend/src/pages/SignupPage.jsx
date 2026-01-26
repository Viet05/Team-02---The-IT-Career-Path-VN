import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";
import { toast } from "../components/Toast";
import "../styles/login.css";
import { authService } from "../services/auth";
export default function SignupPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData.password !== formData.confirmPassword) {
    toast.error("Passwords do not match");
    return;
  }

  setLoading(true);
  try {
    await authService.register({
      username: formData.username,
      email: formData.email,
      password: formData.password,
    });
    toast.success("Account created successfully! Please sign in.");
    navigate("/auth/login");
  } catch (err) {
    toast.error(err?.response?.data?.message || "Signup failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <Card className="auth-card">
      <div className="card-title">Create Account</div>
      <div className="card-subtitle">Start your learning journey today</div>

      <form onSubmit={handleSubmit} className="form">
        <label className="label">Username</label>
        <input
          className="input"
          type="text"
          placeholder="Your username (min 8 characters)"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          required
          minLength={8}
        />

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
          minLength={8}
        />

        <label className="label">Confirm Password</label>
        <input
          className="input"
          type="password"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          required
        />

        <Button variant="primary" fullWidth type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Sign Up"}
        </Button>
      </form>

      <div className="footer">
        Already have an account? <Link to="/auth/login">Sign in</Link>
      </div>
    </Card>
  );
}
