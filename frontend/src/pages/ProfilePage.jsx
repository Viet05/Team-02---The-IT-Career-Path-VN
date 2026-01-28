import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUserState } from "../store/useLocalStorage";
import Card from "../components/Card";
import Button from "../components/Button";
import ProgressBar from "../components/ProgressBar";
import { getRoadmapById } from "../data/mockRoadmaps";
import axios from "axios";
import "../styles/profile-page.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

export default function ProfilePage() {
  const { user, selectedRoadmap, getProgressPercentage } = useUserState();
  const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);
  const roadmap = selectedRoadmap ? getRoadmapById(selectedRoadmap) : null;
  const progress = roadmap ? getProgressPercentage(selectedRoadmap, roadmap.totalSteps) : 0;

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const res = await axios.get(
          `${API_BASE}/api/it-path/users/user_profile/${user.id}`
        );
        setProfile(res.data?.data ?? null);
      } catch (err) {
        console.error("Fetch profile error:", err);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.id]);

  if (!user) {
    return (
      <div className="profile-page">
        <Card>
          <p>Please log in to view your profile</p>
          <Button variant="primary" onClick={() => (window.location.href = "/auth/login")}>
            Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div>
            <h1>My Profile</h1>
            <p>Manage your account and learning preferences</p>
          </div>
          <Link to="/profile/edit">
            <Button variant="outline">Edit Profile</Button>
          </Link>
        </div>

        <div className="profile-grid">
          {loading && (
            <Card className="profile-card">
              <p>Loading profile...</p>
            </Card>
          )}
          {!loading && (
          <Card className="profile-card">
            <div className="profile-avatar">
              <div className="avatar-circle">
                {(user.name || "U").charAt(0).toUpperCase()}
              </div>
            </div>
            <h2>{user.name || "User"}</h2>
            <p className="profile-email">{user.email || "No email"}</p>

            <div className="profile-info-section">
              <div className="info-row">
                <span className="info-label">Full Name:</span>
                <span className="info-value">{profile?.fullName || user.fullName || "Not set"}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Date of Birth:</span>
                <span className="info-value">{profile?.dateOfBirth || user.dateOfBirth || "Not set"}</span>
              </div>
              <div className="info-row">
                <span className="info-label">University:</span>
                <span className="info-value">{profile?.university || user.university || "Not set"}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Major:</span>
                <span className="info-value">{profile?.major || user.major || "Not set"}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Current Level:</span>
                <span className="info-value">{profile?.currentLevel || user.currentLevel || "Not set"}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Career Goal:</span>
                <span className="info-value">{profile?.careerGoal || user.careerGoal || "Not set"}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Bio:</span>
                <span className="info-value">{profile?.bio || user.bio || "Not set"}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Goal Role:</span>
                <span className="info-value">{user.goalRole || "Not set"}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Hours per Week:</span>
                <span className="info-value">{user.hoursPerWeek || "Not set"}</span>
              </div>
            </div>
          </Card>
          )}

          {roadmap && (
            <Card className="profile-card">
              <h3>Current Roadmap</h3>
              <div className="roadmap-info">
                <div className="roadmap-icon">{roadmap.icon}</div>
                <div>
                  <h4>{roadmap.title}</h4>
                  <p>{roadmap.description}</p>
                </div>
              </div>
              <div className="progress-section">
                <ProgressBar value={progress} max={100} showLabel={true} size="lg" />
              </div>
              <Link to={`/roadmaps/${roadmap.id}`}>
                <Button variant="primary" fullWidth>
                  Continue Learning
                </Button>
              </Link>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
