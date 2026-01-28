import React from "react";
import { Link } from "react-router-dom";
import { useUserState } from "../store/useLocalStorage";
import Card from "../components/Card";
import Button from "../components/Button";
import ProgressBar from "../components/ProgressBar";
import { getRoadmapById } from "../data/mockRoadmaps";
import "../styles/profile-page.css";

export default function ProfilePage() {
  const { user, selectedRoadmap, getProgressPercentage } = useUserState();
  const roadmap = selectedRoadmap ? getRoadmapById(selectedRoadmap) : null;
  const progress = roadmap ? getProgressPercentage(selectedRoadmap, roadmap.totalSteps) : 0;

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
                <span className="info-label">Goal Role:</span>
                <span className="info-value">{user.goalRole || "Not set"}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Current Level:</span>
                <span className="info-value">{user.level || "Not set"}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Hours per Week:</span>
                <span className="info-value">{user.hoursPerWeek || "Not set"}</span>
              </div>
            </div>
          </Card>

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
