<<<<<<< Updated upstream:frontend/src/App.js
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ForgotPassword from "./pages/ForgotPassword";
import AboutPage from "./pages/About";
import JobsPage from "./pages/Job";
=======
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
>>>>>>> Stashed changes:frontend/src/App.jsx

// Public pages
import HomePage from "./pages/HomePage";
import About from "./pages/About";
import RoadmapsPage from "./pages/RoadmapsPage";
import RoadmapDetailPage from "./pages/RoadmapDetailPage";
import LessonDetailPage from "./pages/LessonDetailPage";
import JobsPage from "./pages/JobsPage";
import JobDetailPage from "./pages/JobDetailPage";

<<<<<<< Updated upstream:frontend/src/App.js
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
=======
// User pages
import HubPage from "./pages/HubPage";
import ProfilePage from "./pages/ProfilePage";
import ProfileEditPage from "./pages/ProfileEditPage";
import SkillsPage from "./pages/SkillsPage";

// Auth pages
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

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

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
>>>>>>> Stashed changes:frontend/src/App.jsx
  );
}

export default App;
