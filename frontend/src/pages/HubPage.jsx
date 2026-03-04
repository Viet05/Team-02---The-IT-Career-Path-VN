import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUserState } from "../store/useLocalStorage";
import { getFavouriteJobs } from "../services/jobService";
import { getRecommendations } from "../services/recommendationService";
import { getCompletedCount } from "../services/progressService";
import { getRoadmapDetails } from "../services/roadmapService";
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
      const [favResult, recResult, progressResult] = await Promise.allSettled([
        getFavouriteJobs(),
        getRecommendations(6),
        getCompletedCount(),
      ]);
      if (favResult.status === "fulfilled" && Array.isArray(favResult.value))
        setSavedJobs(favResult.value);
      if (recResult.status === "fulfilled" && Array.isArray(recResult.value))
        setRecommendedJobs(recResult.value);
      if (progressResult.status === "fulfilled")
        setCompletedCount(Number(progressResult.value) || 0);

      if (selectedRoadmap) {
        try {
          const userId = user?.id || user?.userId || 0;
          const roadmapData = await getRoadmapDetails(Number(selectedRoadmap), userId);
          setRoadmap(roadmapData);
        } catch (err) {
          console.error("Failed to load roadmap:", err);
        }
      }
      setLoading(false);
    };
    fetchAll();
  }, [user, selectedRoadmap]);

  if (!user) {
    return (
      <div className="hub-page">
        <EmptyState icon="🔐" title="Please log in"
          message="You need to be logged in to see your hub"
          actionLabel="Log In" onAction={() => window.location.href = "/auth/login"} />
      </div>
    );
  }

  const nodes = roadmap?.roadmapNodes || [];
  const totalNodes = nodes.length;
  const actualCompletedCount = nodes.filter(n => n.status === "COMPLETED").length;
  const progressPercent = totalNodes > 0 ? Math.round((actualCompletedCount / totalNodes) * 100) : 0;
  const nextNode = nodes.find((n) => n.status !== "COMPLETED") || nodes[0];
  const displayName = user?.name || user?.userName || user?.username || "Learner";

  return (
    <div className="hub-page">
      <div className="hub-container">

        {/* ── Welcome Banner ── */}
        <div className="hub-welcome">
          <div className="hub-welcome-text">
            <h1>👋 Welcome back, <span className="hub-username">{displayName}</span>!</h1>
            <p>Here's your learning dashboard. Keep up the great work!</p>
          </div>
          <div className="hub-quick-links">
            <Link to="/roadmaps" className="quick-link-btn">📚 Roadmaps</Link>
            <Link to="/skills" className="quick-link-btn">🧠 Skills</Link>
            <Link to="/jobs" className="quick-link-btn">💼 Jobs</Link>
          </div>
        </div>

        {/* ── Top Row: Continue Learning + Saved Jobs ── */}
        <div className="hub-top-grid">

          {/* Continue Learning */}
          <div className="hub-card hub-card--learn">
            <div className="hub-card-header">
              <span className="hub-card-icon">📚</span>
              <h2>Continue Learning</h2>
            </div>

            {!selectedRoadmap ? (
              <div className="hub-empty-inner">
                <span className="hub-empty-icon">🗺️</span>
                <p>No roadmap selected</p>
                <Link to="/roadmaps" className="hub-action-btn">Browse Roadmaps</Link>
              </div>
            ) : loading ? (
              <div className="hub-skeleton-group">
                <div className="hub-skeleton" style={{ height: 16, width: "60%" }} />
                <div className="hub-skeleton" style={{ height: 10 }} />
                <div className="hub-skeleton" style={{ height: 36, width: 140 }} />
              </div>
            ) : roadmap ? (
              <>
                <div className="learn-roadmap-title">{roadmap.title}</div>
                <div className="learn-progress-area">
                  <div className="learn-progress-header">
                    <span className="learn-progress-label">Progress</span>
                    <span className="learn-progress-val">{progressPercent}%</span>
                  </div>
                  <ProgressBar value={progressPercent} max={100} showLabel={false} />
                  <p className="learn-steps-text">{actualCompletedCount} of {totalNodes} steps completed</p>
                </div>
                {nextNode && (
                  <div className="learn-next">
                    <p>Next step: <strong>{nextNode.title}</strong></p>
                    <Link to={`/roadmaps/${selectedRoadmap}`} className="hub-action-btn hub-action-btn--primary">
                      Continue Learning →
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <div className="hub-empty-inner">
                <span className="hub-empty-icon">⚠️</span>
                <p>Could not load roadmap</p>
              </div>
            )}
          </div>

          {/* Saved Jobs */}
          <div className="hub-card hub-card--saved">
            <div className="hub-card-header">
              <span className="hub-card-icon">💼</span>
              <h2>Saved Jobs</h2>
              <Link to="/jobs" className="hub-see-all">See all →</Link>
            </div>

            {loading ? (
              <div className="hub-skeleton-group">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="hub-skeleton" style={{ height: 52, borderRadius: 10 }} />
                ))}
              </div>
            ) : savedJobs.length === 0 ? (
              <div className="hub-empty-inner">
                <span className="hub-empty-icon">💼</span>
                <p>No saved jobs yet</p>
                <Link to="/jobs" className="hub-action-btn">Browse Jobs</Link>
              </div>
            ) : (
              <div className="hub-job-list">
                {savedJobs.slice(0, 4).map((fav) => {
                  const job = fav.jobPosting || fav;
                  const favId = fav.userFavouriteJobId || fav.id;
                  const jobId = job.jobPostingId || job.id;
                  return (
                    <Link key={favId} to={`/jobs/${jobId}`} className="hub-job-item">
                      <div className="hub-job-title">{job.title || job.jobTitle}</div>
                      <div className="hub-job-meta">{job.companyName || job.company}</div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── Recommended Jobs ── */}
        <div className="hub-card hub-card--rec">
          <div className="hub-card-header">
            <span className="hub-card-icon">⭐</span>
            <h2>Recommended Jobs</h2>
            <Link to="/jobs" className="hub-see-all">See all →</Link>
          </div>

          {loading ? (
            <div className="hub-rec-grid">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="hub-skeleton" style={{ height: 80, borderRadius: 12 }} />
              ))}
            </div>
          ) : recommendedJobs.length === 0 ? (
            <div className="hub-empty-inner">
              <span className="hub-empty-icon">⭐</span>
              <p>No recommendations yet. Update your profile and skills!</p>
              <Link to="/profile/edit" className="hub-action-btn">Update Profile</Link>
            </div>
          ) : (
            <div className="hub-rec-grid">
              {recommendedJobs.map((job, idx) => {
                const matchRaw = job.matchScore;
                const match = matchRaw !== undefined
                  ? (matchRaw > 1 ? Math.round(matchRaw) : Math.round(matchRaw * 100))
                  : null;
                return (
                  <Link key={job.jobPostingId || idx} to={`/jobs/${job.jobPostingId || job.id}`} className="hub-rec-card">
                    <div className="hub-rec-title">{job.jobTitle || job.title}</div>
                    <div className="hub-rec-meta">
                      <span>{job.companyName || job.company}</span>
                      {match !== null && (
                        <span className="hub-match-badge">{match}% match</span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
