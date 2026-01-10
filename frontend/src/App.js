import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ForgotPassword from "./pages/ForgotPassword";


function Placeholder({ title }) {
  return <div style={{ padding: 24 }}>{title}</div>;
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<Placeholder title="About" />} />
        <Route path="/roadmap" element={<Placeholder title="Roadmap" />} />
        <Route path="/jobs" element={<Placeholder title="Jobs" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Placeholder title="Dashboard (tạm)" />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/signup" element={<Placeholder title="Sign up (tạm)" />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}
