import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getJobById } from "../data/mockJobs";
import { mockRoadmaps } from "../data/mockRoadmaps";
import { useUserState } from "../store/useLocalStorage";
import Card from "../components/Card";
import Button from "../components/Button";
import Pill from "../components/Pill";
import EmptyState from "../components/EmptyState";
import "../styles/job-detail-page.css";

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const job = getJobById(id);
  const { user, selectedRoadmap, isJobSaved, toggleSavedJob } = useUserState();

  if (!job) {
    return (
      <div className="job-detail-page">
        <EmptyState
          icon="❌"
          title="Job not found"
          message="The job you're looking for doesn't exist"
          actionLabel="Back to Jobs"
          onAction={() => navigate("/jobs")}
        />
      </div>
    );
  }

  const isSaved = isJobSaved(job.id);
  const getMissingSkills = () => {
    if (!user || !selectedRoadmap) return [];
    const roadmap = mockRoadmaps.find(
      (r) => r.id === selectedRoadmap
    );
    if (!roadmap) return [];
    return job.tags.filter((tag) => !roadmap.skills.includes(tag));
  };

  const missingSkills = getMissingSkills();

  return (
    <div className="job-detail-page">
      <div className="job-detail-container">
        <Button variant="ghost" onClick={() => navigate("/jobs")}>
          ← Back to Jobs
        </Button>

        <div className="job-detail-layout">
          <main className="job-detail-main">
            <Card>
              <div className="job-header">
                <div>
                  <h1>{job.title}</h1>
                  <p className="job-company">{job.company}</p>
                  <div className="job-meta">
                    <span>{job.location}</span>
                    <span>•</span>
                    <span>{job.type}</span>
                    <span>•</span>
                    <span>{job.level}</span>
                    {job.salary && (
                      <>
                        <span>•</span>
                        <span>{job.salary}</span>
                      </>
                    )}
                  </div>
                </div>
                <button
                  className={`job-save-btn-large ${isSaved ? "saved" : ""}`}
                  onClick={() => toggleSavedJob(job.id)}
                >
                  {isSaved ? "★ Saved" : "☆ Save Job"}
                </button>
              </div>

              <div className="job-description">
                {job.description.split("\n").map((line, idx) => {
                  if (line.startsWith("**") && line.endsWith("**")) {
                    return (
                      <h3 key={idx} className="description-heading">
                        {line.replace(/\*\*/g, "")}
                      </h3>
                    );
                  }
                  return (
                    <p key={idx} className={line.trim() ? "" : "empty-line"}>
                      {line || "\u00A0"}
                    </p>
                  );
                })}
              </div>

              <div className="job-tags-section">
                <h3>Required Skills</h3>
                <div className="job-tags">
                  {job.tags.map((tag) => (
                    <Pill key={tag} variant="default">
                      {tag}
                    </Pill>
                  ))}
                </div>
              </div>

              {missingSkills.length > 0 && (
                <div className="missing-skills-section">
                  <h3>Missing Skills</h3>
                  <p>You're missing these skills for this job. Consider learning them!</p>
                  <div className="job-tags">
                    {missingSkills.map((skill) => (
                      <Pill key={skill} variant="default">
                        {skill}
                      </Pill>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </main>

          <aside className="job-detail-sidebar">
            <Card>
              <h3>Job Details</h3>
              <div className="detail-row">
                <span className="detail-label">Location:</span>
                <span className="detail-value">{job.location}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Type:</span>
                <span className="detail-value">{job.type}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Level:</span>
                <span className="detail-value">{job.level}</span>
              </div>
              {job.salary && (
                <div className="detail-row">
                  <span className="detail-label">Salary:</span>
                  <span className="detail-value">{job.salary}</span>
                </div>
              )}
              <div className="detail-row">
                <span className="detail-label">Posted:</span>
                <span className="detail-value">{job.posted}</span>
              </div>
            </Card>

            <Card>
              <Button variant="primary" fullWidth size="lg">
                Apply Now
              </Button>
              <Button variant="outline" fullWidth onClick={() => navigate("/jobs")}>
                Browse More Jobs
              </Button>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
