import React, { useState } from "react";
import { Link } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";
import { toast } from "../components/Toast";
import "../styles/login.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Mock - in real app, call API
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      toast.success("Password reset email sent!");
    }, 500);
  };

  if (sent) {
    return (
      <Card className="auth-card">
        <div className="card-title">Check Your Email</div>
        <div className="card-subtitle">
          We've sent a password reset link to {email}
        </div>
        <Link to="/auth/login">
          <Button variant="primary" fullWidth>
            Back to Login
          </Button>
        </Link>
      </Card>
    );
  }

  return (
    <Card className="auth-card">
      <div className="card-title">Reset Password</div>
      <div className="card-subtitle">Enter your email to receive a reset link</div>

      <form onSubmit={handleSubmit} className="form">
        <label className="label">Email</label>
        <input
          className="input"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Button variant="primary" fullWidth type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>

      <div className="footer">
        Remember your password? <Link to="/auth/login">Sign in</Link>
      </div>
    </Card>
  );
}
