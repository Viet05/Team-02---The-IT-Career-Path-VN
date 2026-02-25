import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUserState } from "../store/useLocalStorage";
import { getUserProfile } from "../services/userProfileService";
import Card from "../components/Card";
import Button from "../components/Button";
import Pill from "../components/Pill";
import "../styles/profile-page.css";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useUserState();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/auth/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getUserProfile();
        setProfile(data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setError("Không thể tải thông tin hồ sơ.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  if (loading) {
    return (
      <div className="profile-page">
        <div style={{ padding: "40px", textAlign: "center" }}>Đang tải hồ sơ...</div>
      </div>
    );
  }

  // Kết hợp dữ liệu từ auth store và profile API
  const displayData = {
    name: profile?.fullName || user?.name || user?.userName || "Unknown User",
    email: user?.email || "",
    dateOfBirth: profile?.dateOfBirth || "",
    university: profile?.university || "",
    major: profile?.major || "",
    currentLevel: profile?.currentLevel || "",
    careerGoal: profile?.careerGoal || "",
    bio: profile?.bio || "",
    avatarUrl: profile?.avatarUrl || user?.avatarUrl || "",
    city: profile?.city || "",
    skills: profile?.skills || [],
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div>
            <h1>My Profile</h1>
            <p>Your personal information and career goals</p>
          </div>
          <Button variant="primary" onClick={() => navigate("/profile/edit")}>
            Edit Profile
          </Button>
        </div>

        {error && (
          <Card style={{ marginBottom: "16px", background: "var(--color-error-subtle, #fef2f2)" }}>
            <p style={{ color: "var(--color-error, #ef4444)" }}>⚠️ {error}</p>
          </Card>
        )}

        <div className="profile-content">
          {/* Profile Info Card */}
          <Card className="profile-info-card">
            <div className="profile-avatar-section">
              {displayData.avatarUrl ? (
                <img
                  src={displayData.avatarUrl}
                  alt="Avatar"
                  className="profile-avatar"
                />
              ) : (
                <div className="profile-avatar-placeholder">
                  {displayData.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h2>{displayData.name}</h2>
                <p className="profile-email">{displayData.email}</p>
                {displayData.currentLevel && (
                  <Pill variant="primary">{displayData.currentLevel}</Pill>
                )}
              </div>
            </div>

            {displayData.bio && (
              <div className="profile-section">
                <h3>About</h3>
                <p>{displayData.bio}</p>
              </div>
            )}

            <div className="profile-section">
              <h3>Details</h3>
              <div className="profile-details">
                {displayData.university && (
                  <div className="detail-row">
                    <span className="detail-label">🏫 University</span>
                    <span>{displayData.university}</span>
                  </div>
                )}
                {displayData.major && (
                  <div className="detail-row">
                    <span className="detail-label">📚 Major</span>
                    <span>{displayData.major}</span>
                  </div>
                )}
                {displayData.careerGoal && (
                  <div className="detail-row">
                    <span className="detail-label">🎯 Career Goal</span>
                    <span>{displayData.careerGoal}</span>
                  </div>
                )}
                {displayData.city && (
                  <div className="detail-row">
                    <span className="detail-label">📍 City</span>
                    <span>{displayData.city}</span>
                  </div>
                )}
                {displayData.dateOfBirth && (
                  <div className="detail-row">
                    <span className="detail-label">🎂 Date of Birth</span>
                    <span>{new Date(displayData.dateOfBirth).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>

            {displayData.skills && displayData.skills.length > 0 && (
              <div className="profile-section">
                <h3>Skills</h3>
                <div className="skills-grid">
                  {displayData.skills.map((skill, idx) => (
                    <Pill key={idx} variant="default">
                      {skill.skillName || skill.name || skill}
                      {skill.level && ` (${skill.level})`}
                    </Pill>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Quick Links */}
          <Card className="profile-quick-links">
            <h3>Quick Links</h3>
            <div className="quick-links-list">
              <Link to="/skills" className="quick-link-item">
                🎯 Manage Skills
              </Link>
              <Link to="/roadmaps" className="quick-link-item">
                🗺️ Learning Roadmaps
              </Link>
              <Link to="/hub" className="quick-link-item">
                🏠 My Learning Hub
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
