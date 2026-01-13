// import { Routes, Route } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Home from "./pages/Home";
// import ForgotPassword from "./pages/ForgotPassword";
// import AboutPage from "./pages/About";
// import JobsPage from "./pages/Job";
// import AdminDashboard from "./pages/AdminDashboard";
// import ProtectedRoute from "./components/ProtectedRoute";
// function Placeholder({ title }) {
//   return <div style={{ padding: 24 }}>{title}</div>;
// }

// export default function App() {
//   return (
//     <>
//       <Navbar />
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/about" element={<AboutPage />} />
//         <Route path="/roadmap" element={<Placeholder title="Roadmap" />} />
//         <Route path="/jobs" element={<JobsPage />} /> 
//         <Route path="/login" element={<Login />} />
//         <Route path="/dashboard" element={<Placeholder title="Dashboard (tạm)" />} />
//         <Route path="/forgotPassword" element={<ForgotPassword />} />
//         <Route path="/signup" element={<Placeholder title="Sign up (tạm)" />} />
//         <Route path="/register" element={<Register />} />
//       </Routes>
//     </>
//   );
// }
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ForgotPassword from "./pages/ForgotPassword";
import AboutPage from "./pages/About";
import JobsPage from "./pages/Job";

import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function Placeholder({ title }) {
  return <div style={{ padding: 24 }}>{title}</div>;
}

export default function App() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin"); // /admin, /admin/...

  return (
    <>
      {/* User thấy Navbar bình thường, Admin thì không */}
      {!isAdminPath && <Navbar />}

      <Routes>
        {/* User pages */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/roadmap" element={<Placeholder title="Roadmap" />} />
        <Route path="/jobs" element={<JobsPage />} />

        {/* Auth pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />

        {/* Admin page */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
