import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getRoadmapDetails } from "../services/roadmapService";
import { startProgress, completeProgress, resetProgress } from "../services/progressService";
import { useUserState } from "../store/useLocalStorage";
import ProgressBar from "../components/ProgressBar";
import EmptyState from "../components/EmptyState";
import "../styles/roadmap-detail-page.css";

export default function RoadmapDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, updateProgress: updateLocalProgress, getProgress } = useUserState();

  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedStep, setExpandedStep] = useState(null);
  const [progressLoading, setProgressLoading] = useState({});

  useEffect(() => {
    if (!user) {
      navigate("/auth/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchRoadmapDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const userId = user?.id || user?.userId || 0;
        const data = await getRoadmapDetails(Number(id), userId);
        setRoadmap(data);
      } catch (err) {
        console.error("Failed to fetch roadmap details:", err);
        setError("Không thể tải chi tiết roadmap.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRoadmapDetails();
    }
  }, [id, user?.id]);

  const localProgress = getProgress(id);
  const nodes = roadmap?.roadmapNodes || [];

  const nodeCompletedMap = {};
  nodes.forEach(node => {
    if (localProgress[node.id] !== undefined) {
      nodeCompletedMap[node.id] = localProgress[node.id];
    } else {
      nodeCompletedMap[node.id] = (node.status === "COMPLETED");
    }
  });

  const totalNodes = nodes.length;
  const completedSteps = Object.values(nodeCompletedMap).filter(Boolean).length;
  const progressPercentage = totalNodes > 0 ? Math.round((completedSteps / totalNodes) * 100) : 0;
  const nextNode = nodes.find((n) => !nodeCompletedMap[n.id]);

  const handleToggleComplete = async (node) => {
    const nodeId = node.id;
    const isCompleted = !!nodeCompletedMap[nodeId];

    setProgressLoading((prev) => ({ ...prev, [nodeId]: true }));
    try {
      if (!isCompleted) {
        if (user) await completeProgress(nodeId);
        updateLocalProgress(id, nodeId, true);
      } else {
        if (user) await resetProgress(nodeId);
        updateLocalProgress(id, nodeId, false);
      }
    } catch (err) {
      console.error("Failed to update progress:", err);
      updateLocalProgress(id, nodeId, !isCompleted);
    } finally {
      setProgressLoading((prev) => ({ ...prev, [nodeId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="roadmap-detail-page">
        <div className="roadmap-detail-container">
          <div className="roadmap-loading">
            <div className="skeleton-header"></div>
            <div className="skeleton-box"></div>
            <div className="skeleton-box"></div>
            <div className="skeleton-box"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !roadmap) {
    return (
      <div className="roadmap-detail-page">
        <div className="roadmap-detail-container">
          <button className="back-btn" onClick={() => navigate("/roadmaps")}>
            ← Back to Roadmaps
          </button>
          <div className="roadmap-card-wrapper mt-4">
            <EmptyState
              icon="❌"
              title="Roadmap not found"
              message={error || "The roadmap you're looking for doesn't exist"}
              actionLabel="Back to Roadmaps"
              onAction={() => navigate("/roadmaps")}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="roadmap-detail-page">
      <div className="roadmap-detail-container">

        {/* ── Top Navigation ── */}
        <button className="back-btn" onClick={() => navigate("/roadmaps")}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to Roadmaps
        </button>

        {/* ── Main Header Card ── */}
        <div className="roadmap-header-card">
          <div className="roadmap-header-main">
            <div className="roadmap-hero-icon">{roadmap.icon || "🗺️"}</div>
            <div className="roadmap-hero-content">
              <h1>{roadmap.title}</h1>
              <p>{roadmap.description}</p>
            </div>
          </div>

          <div className="roadmap-progress-widget">
            <div className="progress-widget-header">
              <span className="progress-title">Your Progress</span>
              <span className="progress-text">{completedSteps} of {totalNodes} steps</span>
            </div>
            <ProgressBar value={progressPercentage} max={100} showLabel={true} size="lg" />
            {progressPercentage === 100 && (
              <div className="completion-message">
                🎉 Congratulations! You have completed this roadmap!
              </div>
            )}
          </div>
        </div>

        {/* ── Continue Learning ── */}
        {nextNode && progressPercentage > 0 && progressPercentage < 100 && (
          <div className="continue-learning-widget">
            <div className="continue-learning-content">
              <h3>Continue Learning</h3>
              <p>Next up: <strong>{nextNode.title}</strong></p>
            </div>
            <button
              className="btn-continue"
              onClick={async () => {
                if (user) {
                  try { await startProgress(nextNode.id); } catch (e) { }
                }
                updateLocalProgress(id, nextNode.id, false);
                // Scroll to step
                const el = document.getElementById(`step-${nextNode.id}`);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
            >
              Resume Journey
            </button>
          </div>
        )}

        {/* ── Steps Timeline ── */}
        <div className="roadmap-steps-container">
          <div className="steps-title-row">
            <h2>Learning Path</h2>
          </div>

          <div className="steps-timeline">
            {nodes.length === 0 && (
              <div className="roadmap-card-wrapper">
                <EmptyState
                  icon="📭"
                  title="No steps yet"
                  message="This roadmap doesn't have any learning steps yet"
                />
              </div>
            )}

            {nodes.map((node, index) => {
              const isCompleted = !!nodeCompletedMap[node.id];
              const isExpanded = expandedStep === node.id;
              const isLoading = !!progressLoading[node.id];

              return (
                <div key={node.id} id={`step-${node.id}`} className={`timeline-step ${isCompleted ? "step-completed" : ""}`}>

                  {/* Circle Indicator */}
                  <div className="step-indicator">
                    <div className="step-circle">
                      {isCompleted ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        index + 1
                      )}
                    </div>
                    {/* Line connection (except last item) */}
                    {index < nodes.length - 1 && <div className="step-line" />}
                  </div>

                  {/* Step Card Content */}
                  <div className="step-content-card">
                    <div className="step-content-header">
                      <div className="step-main-info">
                        <h3>{node.title}</h3>
                        {node.nodeType && (
                          <span className="node-type-badge">{node.nodeType}</span>
                        )}
                      </div>
                      <label className="custom-checkbox">
                        <input
                          type="checkbox"
                          checked={isCompleted}
                          disabled={isLoading}
                          onChange={() => handleToggleComplete(node)}
                          aria-label={`Mark ${node.title} as complete`}
                        />
                        <span className="checkmark">
                          {isLoading ? (
                            <span className="checkbox-spinner" />
                          ) : (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </span>
                        <span className="checkbox-label">
                          {isCompleted ? "Completed" : "Mark as complete"}
                        </span>
                      </label>
                    </div>

                    {node.description && <p className="step-desc">{node.description}</p>}

                    {node.resources && node.resources.length > 0 && (
                      <div className="step-resources-section">
                        <button
                          className="toggle-resources-btn"
                          onClick={() => setExpandedStep(isExpanded ? null : node.id)}
                        >
                          <svg className={`chevron ${isExpanded ? "rotated" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                          {isExpanded ? "Hide" : "Show"} Resources ({node.resources.length})
                        </button>

                        {isExpanded && (
                          <div className="resources-list">
                            {node.resources.map((resource, rIdx) => (
                              <a
                                key={rIdx}
                                href={resource.url || "#"}
                                target={resource.url ? "_blank" : "_self"}
                                rel="noopener noreferrer"
                                className="resource-item"
                              >
                                <div className="resource-icon">
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                                  </svg>
                                </div>
                                <div className="resource-detail">
                                  <span className="resource-title">{resource.title || resource.url}</span>
                                  {resource.type && <span className="resource-type">{resource.type}</span>}
                                </div>
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
