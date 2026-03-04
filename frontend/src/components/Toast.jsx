import React, { useEffect, useState } from "react";
import "../styles/toast.css";

let toastId = 0;
const toasts = [];
let listeners = [];

const notify = (message, type = "info", duration = 3000) => {
  const id = toastId++;
  const toast = { id, message, type, duration };
  toasts.push(toast);
  listeners.forEach((listener) => listener([...toasts]));
  
  if (duration > 0) {
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }
  
  return id;
};

const removeToast = (id) => {
  const index = toasts.findIndex((t) => t.id === id);
  if (index > -1) {
    toasts.splice(index, 1);
    listeners.forEach((listener) => listener([...toasts]));
  }
};

export const toast = {
  success: (message, duration) => notify(message, "success", duration),
  error: (message, duration) => notify(message, "error", duration),
  info: (message, duration) => notify(message, "info", duration),
  warning: (message, duration) => notify(message, "warning", duration),
};

export default function ToastContainer() {
  const [toastList, setToastList] = useState([]);

  useEffect(() => {
    listeners.push(setToastList);
    return () => {
      listeners = listeners.filter((l) => l !== setToastList);
    };
  }, []);

  return (
    <div className="toast-container">
      {toastList.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span className="toast-message">{t.message}</span>
          <button className="toast-close" onClick={() => removeToast(t.id)} aria-label="Close">
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
