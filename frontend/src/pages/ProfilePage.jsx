import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUserState } from "../store/useLocalStorage";
import { getUserProfile } from "../services/userProfileService";
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
        setError("Could not load your profile details");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          {/* Skeleton View */}
          <div className="profile-header-skeleton" style={{ height: 60, width: "30%", marginBottom: 30, background: "var(--color-border)", borderRadius: 12 }} />
          <div className="profile-content">
            <div className="profile-info-card" style={{ height: 400, background: "var(--color-surface)", borderRadius: 20 }} />
            <div className="profile-quick-links" style={{ height: 250, background: "var(--color-surface)", borderRadius: 20 }} />
          </div>
        </div>
      </div>
    );
  }

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

        {/* Header */}
        <div className="profile-header">
          <div>
            <h1>My Profile</h1>
            <p>Your personal details and career information</p>
          </div>
          <button className="profile-action-btn" onClick={() => navigate("/profile/edit")}>
            ✏️ Edit Profile
          </button>
        </div>

        {error && (
          <div style={{ padding: "12px 20px", background: "var(--color-error-bg)", color: "var(--color-error)", borderRadius: 12, marginBottom: 20 }}>
            ⚠️ {error}
          </div>
        )}

        <div className="profile-content">

          {/* Main Layout Card */}
          <div className="profile-info-card">

            {/* Avatar Row */}
            <div className="profile-avatar-section">
              {displayData.avatarUrl ? (
                <img src={displayData.avatarUrl} alt="Avatar" className="profile-avatar" />
              ) : (
                <div className="profile-avatar-placeholder">
                  {displayData.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h2>{displayData.name}</h2>
                <p className="profile-email">{displayData.email}</p>
                {displayData.currentLevel && (
                  <span className="profile-level-badge">{displayData.currentLevel}</span>
                )}
              </div>
            </div>

            {/* About Setion */}
            {displayData.bio && (
              <div className="profile-section">
                <h3>About Me</h3>
                <p>{displayData.bio}</p>
              </div>
            )}

            {/* Details Grid */}
            <div className="profile-section">
              <h3>Personal Details</h3>
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
                {/* Fallback empty message for Details rows */}
                {(!displayData.university && !displayData.major && !displayData.careerGoal && !displayData.city && !displayData.dateOfBirth) && (
                  <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>No additional details provided yet.</p>
                )}
              </div>
            </div>

            {/* Skills */}
            {displayData.skills && displayData.skills.length > 0 && (
              <div className="profile-section">
                <h3>Technical Skills</h3>
                <div className="skills-grid">
                  {displayData.skills.map((skill, idx) => (
                    <span key={idx} className="profile-skill-badge">
                      {skill.skillName || skill.name || skill}
                      {skill.level && <span className="skill-lvl-text"> · {skill.level}</span>}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Quick Links Column */}
          <div className="profile-quick-links">
            <h3>Quick Links</h3>
            <div className="quick-links-list">
              <Link to="/skills" className="quick-link-item">
                <span style={{ fontSize: "1.2rem" }}>🎯</span> Manage Skills
              </Link>
              <Link to="/roadmaps" className="quick-link-item">
                <span style={{ fontSize: "1.2rem" }}>🗺️</span> Learning Roadmaps
              </Link>
              <Link to="/hub" className="quick-link-item">
                <span style={{ fontSize: "1.2rem" }}>🎓</span> My Learning Hub
              </Link>
              <Link to="/jobs" className="quick-link-item" style={{ borderTop: "1px dashed var(--color-border)", borderRadius: 0, paddingTop: 18 }}>
                <span style={{ fontSize: "1.2rem" }}>👔</span> Explore Jobs
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
