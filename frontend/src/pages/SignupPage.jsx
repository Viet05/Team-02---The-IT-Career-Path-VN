import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserState } from "../store/useLocalStorage";
import Card from "../components/Card";
import Button from "../components/Button";
import { toast } from "../components/Toast";
import "../styles/login.css";

export default function SignupPage() {
  const navigate = useNavigate();
  const { login } = useUserState();
  const [formData, setFormData] = useState({
    name: "",
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

    // Mock signup - in real app, call API
    setTimeout(() => {
      login({
        name: formData.name,
        email: formData.email,
      });
      toast.success("Account created successfully!");
      navigate("/hub");
      setLoading(false);
    }, 500);
  };

  return (
    <Card className="auth-card">
      <div className="card-title">Create Account</div>
      <div className="card-subtitle">Start your learning journey today</div>

      <form onSubmit={handleSubmit} className="form">
        <label className="label">Name</label>
        <input
          className="input"
          type="text"
          placeholder="Your name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
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
          minLength={6}
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
