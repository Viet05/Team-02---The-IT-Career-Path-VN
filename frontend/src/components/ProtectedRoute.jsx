import { Navigate } from "react-router-dom";
import { getToken, getRole } from "../services/session";

export default function ProtectedRoute({ children, requiredRole }) {
  const token = getToken(); // đọc access_token
  const role = getRole();   // đọc role

  if (!token) return <Navigate to="/login" replace />;
  
  if (requiredRole) {
    if (role !== requiredRole) {
      // Redirect based on role
      if (role === "ADMIN") return <Navigate to="/admin" replace />;
      if (role === "COMPANY") return <Navigate to="/company" replace />;
      return <Navigate to="/" replace />;
    }
  } else {
    // For admin routes without requiredRole prop, keep old behavior
    if (role !== "ADMIN") return <Navigate to="/login" replace />;
  }
  
  return children;
}
