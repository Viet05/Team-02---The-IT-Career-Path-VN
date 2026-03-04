import React from "react";
import "../styles/components.css";

export default function Card({ children, className = "", hover = true, ...props }) {
  return (
    <div className={`card ${hover ? "card-hover" : ""} ${className}`} {...props}>
      {children}
    </div>
  );
}
