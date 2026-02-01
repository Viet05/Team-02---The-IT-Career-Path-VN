import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserState } from "../store/useLocalStorage";
import { http } from "../services/http";
import Card from "../components/Card";
import Button from "../components/Button";
import { toast } from "../components/Toast";
import "../styles/profile-edit-page.css";

export default function ProfileEditPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useUserState();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    dateOfBirth: user?.dateOfBirth || "",
    university: user?.university || "",
    major: user?.major || "",
    currentLevel: user?.currentLevel || "",
    careerGoal: user?.careerGoal || "",
    bio: user?.bio || "",
    avatarUrl: user?.avatarUrl || "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Kiểm tra user ID
    const userId = user?.id || user?.userId || user?.users_id;
    if (!userId) {
      toast.error("User ID not found. Please login again.");
      navigate("/auth/login");
      return;
    }
    
    setLoading(true);

    try {
      // Gửi dữ liệu lên backend API
      const res = await http.post(`/api/it-path/users/user_profile/${userId}`, {
        fullName: formData.fullName,
        dateOfBirth: formData.dateOfBirth,
        university: formData.university,
        major: formData.major,
        currentLevel: formData.currentLevel,
        careerGoal: formData.careerGoal,
        bio: formData.bio,
        avatarUrl: formData.avatarUrl,
      });

      console.log("✅ Profile updated:", res.data);

      // Cập nhật localStorage
      updateUser({
        fullName: formData.fullName,
        dateOfBirth: formData.dateOfBirth,
        university: formData.university,
        major: formData.major,
        currentLevel: formData.currentLevel,
        careerGoal: formData.careerGoal,
        bio: formData.bio,
        avatarUrl: formData.avatarUrl,
      });

      toast.success("Profile updated successfully!");
      navigate("/profile");
    } catch (error) {
      console.error("❌ Update failed:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-edit-page">
      <div className="profile-edit-container">
        <div className="profile-header">
          <div>
            <h1>Edit Profile</h1>
            <p>Update your profile information</p>
          </div>
          <Button variant="ghost" onClick={() => navigate("/profile")}>
            Cancel
          </Button>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="profile-form">
            {/* 1) Full Name */}
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Enter your full name"
              />
            </div>

            {/* 2) Date of Birth */}
            <div className="form-group">
              <label>Date of Birth</label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              />
            </div>

            {/* 3) University */}
            <div className="form-group">
              <label>University</label>
              <input
                type="text"
                value={formData.university}
                onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                placeholder="e.g. Duy Tan University"
              />
            </div>

            {/* 4) Major */}
            <div className="form-group">
              <label>Major</label>
              <input
                type="text"
                value={formData.major}
                onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                placeholder="e.g. CNTT"
              />
            </div>

            {/* 5) Current Level */}
            <div className="form-group">
              <label>Current Level</label>
              <select
                value={formData.currentLevel}
                onChange={(e) => setFormData({ ...formData, currentLevel: e.target.value })}
              >
                <option value="">Select your level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>

            {/* 6) Career Goal */}
            <div className="form-group">
              <label>Career Goal</label>
              <select
                value={formData.careerGoal}
                onChange={(e) => setFormData({ ...formData, careerGoal: e.target.value })}
              >
                <option value="">Select a role</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="DevOps Engineer">DevOps Engineer</option>
              </select>
            </div>

            {/* 7) Bio */}
            <div className="form-group">
              <label>Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows="4"
                placeholder="Tell something about yourself..."
              />
            </div>

            {/* 8) Avatar URL */}
            <div className="form-group">
              <label>Avatar URL</label>
              <input
                type="url"
                value={formData.avatarUrl}
                onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div className="form-actions">
              <Button variant="outline" type="button" onClick={() => navigate("/profile")} disabled={loading}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
