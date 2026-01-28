import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import Card from "./Card";
import { useUserState } from "../store/useLocalStorage";
import { mockRoadmaps } from "../data/mockRoadmaps";
import "../styles/onboarding.css";

export default function Onboarding() {
  const navigate = useNavigate();
  const { completeOnboarding } = useUserState();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    goalRole: "",
    level: "",
    hoursPerWeek: "",
    roadmapId: null,
  });

  const handleNext = () => {
    if (step === 1) {
      if (!formData.name || !formData.email) {
        alert("Please fill in your name and email");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!formData.goalRole || !formData.level || !formData.hoursPerWeek) {
        alert("Please complete all fields");
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!formData.roadmapId) {
        alert("Please select a roadmap");
        return;
      }
      completeOnboarding(formData);
      navigate("/hub");
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSkip = () => {
    navigate("/");
  };

  return (
    <div className="onboarding">
      <Card className="onboarding-card">
        <div className="onboarding-header">
          <h1>Welcome to DevRoadMap! 🚀</h1>
          <p>Let's set up your learning journey</p>
        </div>

        <div className="onboarding-progress">
          <div className={`progress-step ${step >= 1 ? "active" : ""}`}>1</div>
          <div className={`progress-line ${step >= 2 ? "active" : ""}`} />
          <div className={`progress-step ${step >= 2 ? "active" : ""}`}>2</div>
          <div className={`progress-line ${step >= 3 ? "active" : ""}`} />
          <div className={`progress-step ${step >= 3 ? "active" : ""}`}>3</div>
        </div>

        {step === 1 && (
          <div className="onboarding-step">
            <h2>Tell us about yourself</h2>
            <div className="form-group">
              <label>Your Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="onboarding-step">
            <h2>What's your goal?</h2>
            <div className="form-group">
              <label>Goal Role</label>
              <select
                value={formData.goalRole}
                onChange={(e) => setFormData({ ...formData, goalRole: e.target.value })}
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
              >
                <option value="">Select your level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div className="form-group">
              <label>Hours per week you can dedicate</label>
              <select
                value={formData.hoursPerWeek}
                onChange={(e) => setFormData({ ...formData, hoursPerWeek: e.target.value })}
              >
                <option value="">Select hours</option>
                <option value="1-5">1-5 hours</option>
                <option value="5-10">5-10 hours</option>
                <option value="10-20">10-20 hours</option>
                <option value="20+">20+ hours</option>
              </select>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="onboarding-step">
            <h2>Choose your roadmap</h2>
            <div className="roadmap-options">
              {mockRoadmaps.map((roadmap) => (
                <div
                  key={roadmap.id}
                  className={`roadmap-option ${formData.roadmapId === roadmap.id ? "selected" : ""}`}
                  onClick={() => setFormData({ ...formData, roadmapId: roadmap.id })}
                >
                  <div className="roadmap-option-icon">{roadmap.icon}</div>
                  <div className="roadmap-option-content">
                    <h3>{roadmap.title}</h3>
                    <p>{roadmap.description}</p>
                    <div className="roadmap-option-meta">
                      <span>{roadmap.totalSteps} steps</span>
                      <span>•</span>
                      <span>{roadmap.estimatedHours} hours</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="onboarding-actions">
          {step > 1 && (
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
          )}
          <div style={{ flex: 1 }} />
          <Button variant="ghost" onClick={handleSkip}>
            Skip
          </Button>
          <Button variant="primary" onClick={handleNext}>
            {step === 3 ? "Get Started" : "Next"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
