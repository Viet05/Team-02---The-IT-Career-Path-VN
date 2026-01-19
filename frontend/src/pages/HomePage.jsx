import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserState } from "../store/useLocalStorage";
// import { mockRoadmaps } from "../data/mockRoadmaps";
import { mockJobs } from "../data/mockJobs";
import Card from "../components/Card";
import Button from "../components/Button";
import Pill from "../components/Pill";
import ProgressBar from "../components/ProgressBar";
import Onboarding from "../components/Onboarding";
import "../styles/home-page.css";

export default function HomePage() {
  const navigate = useNavigate();
  const { onboarding } = useUserState();
  const [showOnboarding, setShowOnboarding] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState(null);
  const [selectedSkill, setSelectedSkill] = React.useState(null);

  useEffect(() => {
    if (onboarding === false) {
      const timer = setTimeout(() => {
        setShowOnboarding(true);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [onboarding]);

  if (showOnboarding) {
    return <Onboarding />;
  }

  const roles = ["Frontend", "Backend", "Full Stack", "DevOps", "Data Science", "Mobile", "AI Engineer", "Android", "iOS", "Software Architect", "Technical Writer", "MLOps"];
  const skills = ["HTML/CSS", "JavaScript", "React", "Java", "Spring", "MySQL", "Docker", "Linux", "REST API", "GraphQL", "Python", "Node.js"];
  
  const recommendedJobs = mockJobs.slice(0, 3);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Your IT Career Journey Starts Here</h1>
          <p>
            Choose a roadmap, track your progress, and discover jobs matched to your skills
          </p>
          <div className="hero-actions">
            <Button variant="primary" size="lg" onClick={() => navigate("/roadmaps")}>
              Explore Roadmaps
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate("/jobs")}>
              Browse Jobs
            </Button>
          </div>
        </div>
      </section>

      <div className="home-container">
        <div className="home-layout">
          {/* Left Column: Roadmaps Panel */}
          <div className="home-left">
            <Card className="roadmaps-panel">
              {/* Role-based Roadmaps */}
              <div className="roadmaps-section">
                <h3 className="roadmaps-title">Role-based Roadmaps</h3>
                <div className="roadmaps-grid">
                  {roles.map((role) => (
                    <button
                      key={role}
                      className={`roadmap-card-btn ${selectedRole === role ? 'active' : ''}`}
                      onClick={() => setSelectedRole(role)}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {/* Skill-based Roadmaps */}
              <div className="roadmaps-section">
                <h3 className="roadmaps-title">Skill-based Roadmaps</h3>
                <div className="roadmaps-grid">
                  {skills.map((skill) => (
                    <button
                      key={skill}
                      className={`roadmap-card-btn ${selectedSkill === skill ? 'active' : ''}`}
                      onClick={() => setSelectedSkill(skill)}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Recommended Jobs (Sticky) */}
          <div className="home-right">
            <div className="jobs-sidebar">
              <div className="section-header">
                <h3>Recommended Jobs</h3>
                <p>Jobs matched to your skills</p>
              </div>
              <div className="jobs-list">
                {recommendedJobs.map((job) => (
                  <Card key={job.id} className="job-sidebar-card">
                    <h4>{job.title}</h4>
                    <p className="job-company-name">{job.company}</p>
                    <div className="job-sidebar-meta">
                      <span>{job.location}</span>
                      <span>{job.type}</span>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      fullWidth
                      onClick={() => navigate(`/jobs/${job.id}`)}
                    >
                      View Details
                    </Button>
                  </Card>
                ))}
              </div>
              <Button
                variant="outline"
                fullWidth
                onClick={() => navigate("/jobs")}
              >
                View All Jobs
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
