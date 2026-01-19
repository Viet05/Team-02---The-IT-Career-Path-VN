import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserState } from "../store/useLocalStorage";
import { mockRoadmaps } from "../data/mockRoadmaps";
import Card from "../components/Card";
import Button from "../components/Button";
import { toast } from "../components/Toast";
import "../styles/profile-edit-page.css";

export default function ProfileEditPage() {
  const navigate = useNavigate();
  const { user, updateUser, setSelectedRoadmap, selectedRoadmap } = useUserState();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    goalRole: user?.goalRole || "",
    level: user?.level || "",
    hoursPerWeek: user?.hoursPerWeek || "",
    roadmapId: selectedRoadmap || null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser({
      name: formData.name,
      email: formData.email,
      goalRole: formData.goalRole,
      level: formData.level,
      hoursPerWeek: formData.hoursPerWeek,
    });
    if (formData.roadmapId !== selectedRoadmap) {
      setSelectedRoadmap(formData.roadmapId);
    }
    toast.success("Profile updated successfully!");
    navigate("/profile");
  };

  return (
    <div className="profile-edit-page">
      <div className="profile-edit-container">
        <div className="profile-header">
          <div>
            <h1>Edit Profile</h1>
            <p>Update your information and preferences</p>
          </div>
          <Button variant="ghost" onClick={() => navigate("/profile")}>
            Cancel
          </Button>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Goal Role</label>
              <select
                value={formData.goalRole}
                onChange={(e) => setFormData({ ...formData, goalRole: e.target.value })}
                required
              >
                <option value="">Select a role</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="DevOps Engineer">DevOps Engineer</option>
              </select>
            </div>

            <div className="form-group">
              <label>Current Level</label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                required
              >
                <option value="">Select your level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div className="form-group">
              <label>Hours per Week</label>
              <select
                value={formData.hoursPerWeek}
                onChange={(e) => setFormData({ ...formData, hoursPerWeek: e.target.value })}
                required
              >
                <option value="">Select hours</option>
                <option value="1-5">1-5 hours</option>
                <option value="5-10">5-10 hours</option>
                <option value="10-20">10-20 hours</option>
                <option value="20+">20+ hours</option>
              </select>
            </div>

            <div className="form-group">
              <label>Roadmap</label>
              <div className="roadmap-options">
                {mockRoadmaps.map((roadmap) => (
                  <div
                    key={roadmap.id}
                    className={`roadmap-option ${formData.roadmapId === roadmap.id ? "selected" : ""}`}
                    onClick={() => setFormData({ ...formData, roadmapId: roadmap.id })}
                  >
                    <div className="roadmap-option-icon">{roadmap.icon}</div>
                    <div>
                      <h4>{roadmap.title}</h4>
                      <p>{roadmap.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-actions">
              <Button variant="outline" type="button" onClick={() => navigate("/profile")}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
