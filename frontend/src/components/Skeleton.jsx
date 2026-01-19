import React from "react";
import "../styles/components.css";

export default function Skeleton({ width, height, className = "", variant = "text" }) {
  const style = {};
  if (width) style.width = width;
  if (height) style.height = height;

  return (
    <div
      className={`skeleton skeleton-${variant} ${className}`}
      style={style}
      aria-label="Loading..."
    />
  );
}
