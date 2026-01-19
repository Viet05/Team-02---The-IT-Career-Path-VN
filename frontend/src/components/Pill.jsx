import React from "react";
import "../styles/components.css";

export default function Pill({ children, variant = "default", onClick, className = "" }) {
  return (
    <span
      className={`pill pill-${variant} ${onClick ? "pill-clickable" : ""} ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </span>
  );
}
