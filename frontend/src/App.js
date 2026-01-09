import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";

function Placeholder({ title }) {
  return <div style={{ padding: 24 }}>{title}</div>;
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Placeholder title="Home" />} />
        <Route path="/about" element={<Placeholder title="About" />} />
        <Route path="/roadmaps" element={<Placeholder title="Roadmaps" />} />
        <Route path="/jobs" element={<Placeholder title="Jobs" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Placeholder title="Dashboard (tạm)" />} />
        <Route path="/reset-password" element={<Placeholder title="Reset Password (tạm)" />} />
        <Route path="/signup" element={<Placeholder title="Sign up (tạm)" />} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}
