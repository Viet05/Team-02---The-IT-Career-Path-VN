import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ForgotPassword from "./pages/ForgotPassword";
import AboutPage from "./pages/About";
import JobsPage from "./pages/Job";

function Placeholder({ title }) {
  return <div style={{ padding: 24 }}>{title}</div>;
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/roadmap" element={<Placeholder title="Roadmap" />} />
        <Route path="/jobs" element={<JobsPage />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Placeholder title="Dashboard (tạm)" />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/signup" element={<Placeholder title="Sign up (tạm)" />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}
