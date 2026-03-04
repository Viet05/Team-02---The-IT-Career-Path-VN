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

function App() {
  return (
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
