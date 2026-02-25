import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUserState } from "../store/useLocalStorage";
import { getFavouriteJobs } from "../services/jobService";
import { getRecommendations } from "../services/recommendationService";
import { getUserProgress, getCompletedCount } from "../services/progressService";
import { getRoadmapDetails } from "../services/roadmapService";
import Card from "../components/Card";
import Button from "../components/Button";
import ProgressBar from "../components/ProgressBar";
import EmptyState from "../components/EmptyState";
import "../styles/hub-page.css";

export default function HubPage() {
  const { user, selectedRoadmap } = useUserState();
  const [savedJobs, setSavedJobs] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [roadmap, setRoadmap] = useState(null);
  const [completedCount, setCompletedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchAll = async () => {
      setLoading(true);

      // Fetch tất cả data song song
      const [favResult, recResult, progressResult] = await Promise.allSettled([
        getFavouriteJobs(),
        getRecommendations(6),
        getCompletedCount(),
      ]);

      if (favResult.status === "fulfilled" && Array.isArray(favResult.value)) {
        setSavedJobs(favResult.value);
      }
      if (recResult.status === "fulfilled" && Array.isArray(recResult.value)) {
        setRecommendedJobs(recResult.value);
      }
      if (progressResult.status === "fulfilled") {
        setCompletedCount(Number(progressResult.value) || 0);
      }

      // Fetch roadmap nếu user đang chọn
      if (selectedRoadmap) {
        try {
          const userId = user?.id || user?.userId || 0;
          const roadmapData = await getRoadmapDetails(Number(selectedRoadmap), userId);
          setRoadmap(roadmapData);
        } catch (err) {
          console.error("Failed to load roadmap details:", err);
        }
      }

      setLoading(false);
    };

    fetchAll();
  }, [user, selectedRoadmap]);

  if (!user) {
    return (
      <div className="hub-page">
        <EmptyState
          icon="🔐"
          title="Please log in"
          message="You need to be logged in to see your learning hub"
          actionLabel="Log In"
          onAction={() => window.location.href = "/auth/login"}
        />
      </div>
    );
  }

  const totalNodes = roadmap?.nodes?.length || 0;
  const progressPercent = totalNodes > 0 ? Math.round((completedCount / totalNodes) * 100) : 0;

  // Find next node in roadmap (assume front-end progress tracking here)
  const nextNode = roadmap?.nodes?.[0] || null;

  return (
    <div className="hub-page">
      <div className="hub-container">
        <div className="hub-header">
          <div>
            <h1>👋 Welcome back, {user?.name || user?.userName || "Learner"}!</h1>
            <p>Continue your learning journey</p>
          </div>
        </div>

        <div className="hub-grid">
          {/* Continue Learning */}
          <Card className="hub-card continue-learning-card">
            <h2>📚 Continue Learning</h2>
            {!selectedRoadmap ? (
              <EmptyState
                icon="🗺️"
                title="No roadmap selected"
                message="Pick a roadmap to start learning"
                actionLabel="Browse Roadmaps"
                onAction={() => window.location.href = "/roadmaps"}
              />
            ) : loading ? (
              <p style={{ color: "var(--color-text-secondary)" }}>Loading...</p>
            ) : roadmap ? (
              <>
                <div className="roadmap-progress">
                  <div className="roadmap-title">{roadmap.title}</div>
                  <ProgressBar value={progressPercent} max={100} showLabel={true} />
                  <p style={{ color: "var(--color-text-secondary)", marginTop: "8px" }}>
                    {completedCount} of {totalNodes} steps completed
                  </p>
                </div>
                {nextNode && (
                  <div style={{ marginTop: "12px" }}>
                    <p>Next step: <strong>{nextNode.title}</strong></p>
                    <Link to={`/roadmaps/${selectedRoadmap}`}>
                      <Button variant="primary" style={{ marginTop: "8px" }}>
                        Continue Learning →
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <EmptyState icon="⚠️" title="Could not load roadmap" message="Please try again" />
            )}
          </Card>

          {/* Saved Jobs */}
          <Card className="hub-card saved-jobs-card">
            <div className="card-header-row">
              <h2>💼 Saved Jobs</h2>
              <Link to="/jobs" className="see-all-link">See all →</Link>
            </div>
            {loading ? (
              <p style={{ color: "var(--color-text-secondary)" }}>Loading...</p>
            ) : savedJobs.length === 0 ? (
              <EmptyState
                icon="💼"
                title="No saved jobs"
                message="Save jobs you're interested in"
                actionLabel="Browse Jobs"
                onAction={() => window.location.href = "/jobs"}
              />
            ) : (
              <div className="job-list">
                {savedJobs.slice(0, 4).map((fav) => {
                  const job = fav.jobPosting || fav;
                  return (
                    <Link key={fav.id} to={`/jobs/${job.id || job.jobPostingId}`} className="job-item">
                      <div className="job-item-title">{job.jobTitle || job.title}</div>
                      <div className="job-item-meta">{job.companyName || job.company}</div>
                    </Link>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Recommended Jobs */}
          <Card className="hub-card recommended-jobs-card">
            <div className="card-header-row">
              <h2>⭐ Recommended Jobs</h2>
              <Link to="/jobs" className="see-all-link">See all →</Link>
            </div>
            {loading ? (
              <p style={{ color: "var(--color-text-secondary)" }}>Loading...</p>
            ) : recommendedJobs.length === 0 ? (
              <EmptyState
                icon="⭐"
                title="No recommendations yet"
                message="Update your profile and skills for better recommendations"
                actionLabel="Update Profile"
                onAction={() => window.location.href = "/profile/edit"}
              />
            ) : (
              <div className="job-list">
                {recommendedJobs.map((job, idx) => (
                  <Link key={job.jobPostingId || idx} to={`/jobs/${job.jobPostingId || job.id}`} className="job-item">
                    <div className="job-item-title">{job.jobTitle || job.title}</div>
                    <div className="job-item-meta">
                      {job.companyName || job.company}
                      {job.matchScore !== undefined && (
                        <span style={{ marginLeft: "8px", color: "var(--color-primary)", fontSize: "12px" }}>
                          {Math.round(job.matchScore * 100)}% match
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
