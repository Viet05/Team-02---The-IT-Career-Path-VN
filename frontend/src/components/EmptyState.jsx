import React from "react";
import Button from "./Button";
import "../styles/components.css";

export default function EmptyState({
  icon = "📭",
  title,
  message,
  actionLabel,
  onAction,
  className = "",
}) {
  return (
    <div className={`empty-state ${className}`}>
      <div className="empty-state-icon">{icon}</div>
      {title && <h3 className="empty-state-title">{title}</h3>}
      {message && <p className="empty-state-message">{message}</p>}
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
