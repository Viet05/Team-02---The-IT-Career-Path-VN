import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import { toast } from "../components/Toast";
import "../styles/profile.css";

const MOCK_PROFILE = {
  username: "student01",
  email: "student@example.com",
  fullName: "Nguyễn Văn A",
  avatar: "",
  bio: "Frontend Developer enthusiast",
  skills: [
    { id: 1, name: "JavaScript", level: "Intermediate" },
    { id: 2, name: "React", level: "Beginner" },
    { id: 3, name: "HTML/CSS", level: "Advanced" },
  ],
};

export default function StudentProfile() {
  const nav = useNavigate();
  const [profile, setProfile] = useState(MOCK_PROFILE);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: "",
    email: "",
    bio: "",
  });
  const [skillForm, setSkillForm] = useState({ name: "", level: "Beginner" });
  const [editingSkill, setEditingSkill] = useState(null);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState(null);

  useEffect(() => {
    setEditForm({
      fullName: profile.fullName,
      email: profile.email,
      bio: profile.bio,
    });
  }, [profile]);

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = () => {
    setProfile({ ...profile, ...editForm });
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const handleCancelEdit = () => {
    setEditForm({
      fullName: profile.fullName,
      email: profile.email,
      bio: profile.bio,
    });
    setIsEditing(false);
  };

  const handleAddSkill = () => {
    setEditingSkill(null);
    setSkillForm({ name: "", level: "Beginner" });
    setShowSkillModal(true);
  };

  const handleEditSkill = (skill) => {
    setEditingSkill(skill);
    setSkillForm({ name: skill.name, level: skill.level });
    setShowSkillModal(true);
  };

  const handleSaveSkill = () => {
    if (!skillForm.name.trim()) {
      toast.error("Please enter a skill name");
      return;
    }

    if (editingSkill) {
      setProfile({
        ...profile,
        skills: profile.skills.map((s) =>
          s.id === editingSkill.id ? { ...s, ...skillForm } : s
        ),
      });
      toast.success("Skill updated!");
    } else {
      const newSkill = {
        id: Date.now(),
        name: skillForm.name,
        level: skillForm.level,
      };
      setProfile({
        ...profile,
        skills: [...profile.skills, newSkill],
      });
      toast.success("Skill added!");
    }
    setShowSkillModal(false);
  };

  const handleDeleteSkill = (skill) => {
    setSkillToDelete(skill);
    setShowDeleteModal(true);
  };

  const confirmDeleteSkill = () => {
    setProfile({
      ...profile,
      skills: profile.skills.filter((s) => s.id !== skillToDelete.id),
    });
    toast.success("Skill deleted!");
    setShowDeleteModal(false);
    setSkillToDelete(null);
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1>Student Profile</h1>
          {!isEditing && (
            <button className="btn btn-primary" onClick={handleEditProfile}>
              Edit Profile
            </button>
          )}
        </div>

        <div className="profile-card">
          <div className="profile-avatar-section">
            <div className="profile-avatar">
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.fullName} />
              ) : (
                <div className="avatar-placeholder">
                  {profile.fullName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="profile-info">
              <h2>{profile.fullName}</h2>
              <p className="profile-username">@{profile.username}</p>
              <p className="profile-email">{profile.email}</p>
            </div>
          </div>

          {isEditing ? (
            <div className="profile-edit-form">
              <label className="field">
                <span>Full Name</span>
                <input
                  className="input"
                  value={editForm.fullName}
                  onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                />
              </label>

              <label className="field">
                <span>Email</span>
                <input
                  className="input"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                />
              </label>

              <label className="field">
                <span>Bio</span>
                <textarea
                  className="input"
                  rows="3"
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                />
              </label>

              <div className="form-actions">
                <button className="btn btn-primary" onClick={handleSaveProfile}>
                  Save
                </button>
                <button className="btn btn-outline" onClick={handleCancelEdit}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="profile-bio">
              <p>{profile.bio || "No bio yet."}</p>
            </div>
          )}
        </div>

        <div className="profile-card">
          <div className="profile-section-header">
            <h3>Skills</h3>
            <button className="btn btn-primary" onClick={handleAddSkill}>
              + Add Skill
            </button>
          </div>

          {profile.skills.length === 0 ? (
            <p className="empty-state">No skills added yet.</p>
          ) : (
            <div className="skills-list">
              {profile.skills.map((skill) => (
                <div key={skill.id} className="skill-item">
                  <div className="skill-info">
                    <span className="skill-name">{skill.name}</span>
                    <span className={`skill-level skill-${skill.level.toLowerCase()}`}>
                      {skill.level}
                    </span>
                  </div>
                  <div className="skill-actions">
                    <button
                      className="btn-icon"
                      onClick={() => handleEditSkill(skill)}
                      aria-label="Edit skill"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-icon"
                      onClick={() => handleDeleteSkill(skill)}
                      aria-label="Delete skill"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={showSkillModal}
        onClose={() => setShowSkillModal(false)}
        title={editingSkill ? "Edit Skill" : "Add Skill"}
      >
        <div className="skill-form">
          <label className="field">
            <span>Skill Name</span>
            <input
              className="input"
              value={skillForm.name}
              onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
              placeholder="e.g., JavaScript, React, Python"
            />
          </label>

          <label className="field">
            <span>Level</span>
            <select
              className="input"
              value={skillForm.level}
              onChange={(e) => setSkillForm({ ...skillForm, level: e.target.value })}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
          </label>

          <div className="form-actions">
            <button className="btn btn-primary" onClick={handleSaveSkill}>
              {editingSkill ? "Update" : "Add"}
            </button>
            <button className="btn btn-outline" onClick={() => setShowSkillModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Skill"
        size="small"
      >
        <p>Are you sure you want to delete the skill "{skillToDelete?.name}"?</p>
        <div className="form-actions">
          <button className="btn btn-danger" onClick={confirmDeleteSkill}>
            Delete
          </button>
          <button className="btn btn-outline" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
}
