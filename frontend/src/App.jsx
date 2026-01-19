<<<<<<< HEAD:frontend/src/App.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

// Public pages
import HomePage from "./pages/HomePage";
import About from "./pages/About";
import RoadmapsPage from "./pages/RoadmapsPage";
import RoadmapDetailPage from "./pages/RoadmapDetailPage";
import LessonDetailPage from "./pages/LessonDetailPage";
import JobsPage from "./pages/JobsPage";
import JobDetailPage from "./pages/JobDetailPage";

// User pages
import HubPage from "./pages/HubPage";
import ProfilePage from "./pages/ProfilePage";
import ProfileEditPage from "./pages/ProfileEditPage";
import SkillsPage from "./pages/SkillsPage";

// Auth pages
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

// Admin pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminJobApproval from "./pages/AdminJobApproval";
import AdminUserList from "./pages/AdminUserList";
import AdminRoadmapList from "./pages/AdminRoadmapList";
=======
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
  const isAdminPath = location.pathname.startsWith("/admin");
>>>>>>> 5b1536d7ac1c656321ca57b17db09cba31bd30e3:frontend/src/App.jsx

function App() {
  return (
<<<<<<< HEAD:frontend/src/App.js
    <Routes>
      {/* Public routes with main layout */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<About />} />
        <Route path="roadmaps" element={<RoadmapsPage />} />
        <Route path="roadmaps/:id" element={<RoadmapDetailPage />} />
        <Route path="roadmaps/:id/lesson/:lessonId" element={<LessonDetailPage />} />
        <Route path="jobs" element={<JobsPage />} />
        <Route path="jobs/:id" element={<JobDetailPage />} />
        
        {/* User routes */}
        <Route path="hub" element={<HubPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="profile/edit" element={<ProfileEditPage />} />
        <Route path="skills" element={<SkillsPage />} />
      </Route>
=======
    <>
      {!isAdminPath && <Navbar />}
>>>>>>> 5b1536d7ac1c656321ca57b17db09cba31bd30e3:frontend/src/App.jsx

      {/* Auth routes with auth layout */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="forgot" element={<ForgotPasswordPage />} />
      </Route>

      {/* Admin routes */}
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/jobs" element={<AdminJobApproval />} />
      <Route path="/admin/users" element={<AdminUserList />} />
      <Route path="/admin/roadmaps" element={<AdminRoadmapList />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
