import { Navigate } from "react-router-dom";
import { getToken, getRole } from "../services/auth";

export default function ProtectedRoute({ children }) {
  const token = getToken(); // đọc access_token
  const role = getRole();   // đọc role

  if (!token || role !== "Admin") return <Navigate to="/login" replace />;
  return children;
}
