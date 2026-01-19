import React from "react";
import { Outlet } from "react-router-dom";
import "../styles/auth-layout.css";

export default function AuthLayout() {
  return (
    <div className="auth-layout">
      <div className="auth-container">
        <Outlet />
      </div>
    </div>
  );
}
