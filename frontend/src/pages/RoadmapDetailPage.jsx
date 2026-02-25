import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getRoadmapDetails } from "../services/roadmapService";
import { startProgress, completeProgress, resetProgress } from "../services/progressService";
import { useUserState } from "../store/useLocalStorage";
import Card from "../components/Card";
import Button from "../components/Button";
import ProgressBar from "../components/ProgressBar";
import EmptyState from "../components/EmptyState";
import "../styles/roadmap-detail-page.css";

export default function RoadmapDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, updateProgress: updateLocalProgress, getProgress, getProgressPercentage } = useUserState();

  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedStep, setExpandedStep] = useState(null);
  const [progressLoading, setProgressLoading] = useState({});

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
  const totalNodes = roadmap?.nodes?.length || roadmap?.totalSteps || 0;
  const progressPercentage = getProgressPercentage(id, totalNodes);
  const completedSteps = Object.values(localProgress).filter(Boolean).length;

  const handleToggleComplete = async (node) => {
    const nodeId = node.id;
    const isCompleted = !!localProgress[nodeId];

    setProgressLoading((prev) => ({ ...prev, [nodeId]: true }));
    try {
      if (!isCompleted) {
        // Nếu chưa hoàn thành → đánh dấu hoàn thành
        if (user) {
          await completeProgress(nodeId);
        }
        updateLocalProgress(id, nodeId, true);
      } else {
        // Nếu đã hoàn thành → reset
        if (user) {
          await resetProgress(nodeId);
        }
        updateLocalProgress(id, nodeId, false);
      }
    } catch (err) {
      console.error("Failed to update progress:", err);
      // Vẫn update localStorage dù API lỗi (offline mode)
      updateLocalProgress(id, nodeId, !isCompleted);
    } finally {
      setProgressLoading((prev) => ({ ...prev, [nodeId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="roadmap-detail-page">
        <div style={{ padding: "40px", textAlign: "center" }}>
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error || !roadmap) {
    return (
      <div className="roadmap-detail-page">
        <EmptyState
          icon="❌"
          title="Roadmap not found"
          message={error || "The roadmap you're looking for doesn't exist"}
          actionLabel="Back to Roadmaps"
          onAction={() => navigate("/roadmaps")}
        />
      </div>
    );
  }

  // Backend trả về roadmap với nodes[] (mảng các node)
  const nodes = roadmap.nodes || [];

  // Tìm node tiếp theo chưa hoàn thành
  const nextNode = nodes.find((n) => !localProgress[n.id]);

  return (
    <div className="roadmap-detail-page">
      <div className="roadmap-detail-container">
        <div className="roadmap-header">
          <Button variant="ghost" onClick={() => navigate("/roadmaps")}>
            ← Back to Roadmaps
          </Button>
          <div className="roadmap-header-content">
            <div className="roadmap-title-section">
              <div className="roadmap-icon-large">{roadmap.icon || "🗺️"}</div>
              <div>
                <h1>{roadmap.title}</h1>
                <p>{roadmap.description}</p>
              </div>
            </div>
            <div className="roadmap-progress-overview">
              <ProgressBar value={progressPercentage} max={100} showLabel={true} size="lg" />
              <div className="progress-stats">
                <span>
                  {completedSteps} of {totalNodes} steps completed
                </span>
              </div>
            </div>
          </div>
        </div>

        {nextNode && (
          <Card className="continue-learning-card">
            <div className="continue-content">
              <div>
                <h3>Continue Learning</h3>
                <p>Your next step: {nextNode.title}</p>
                {nextNode.description && <p style={{ color: 'var(--color-text-secondary)', marginTop: '4px' }}>{nextNode.description}</p>}
              </div>
              <Button
                variant="primary"
                onClick={async () => {
                  if (user) {
                    try { await startProgress(nextNode.id); } catch (e) { /* ignore */ }
                  }
                  updateLocalProgress(id, nextNode.id, false);
                }}
              >
                Start Learning
              </Button>
            </div>
          </Card>
        )}

        <div className="steps-section">
          <h2>Learning Path</h2>
          <div className="steps-list">
            {nodes.length === 0 && (
              <EmptyState
                icon="📭"
                title="No steps yet"
                message="This roadmap doesn't have any learning steps yet"
              />
            )}
            {nodes.map((node, index) => {
              const isCompleted = !!localProgress[node.id];
              const isExpanded = expandedStep === node.id;
              const isLoading = !!progressLoading[node.id];

              return (
                <Card key={node.id} className="step-card">
                  <div className="step-header">
                    <div className="step-number" style={{ background: isCompleted ? 'var(--color-success, #22c55e)' : undefined }}>
                      {isCompleted ? "✓" : index + 1}
                    </div>
                    <div className="step-content">
                      <div className="step-title-row">
                        <h3 style={{ textDecoration: isCompleted ? 'line-through' : 'none', opacity: isCompleted ? 0.6 : 1 }}>
                          {node.title}
                        </h3>
                        <label className="step-checkbox">
                          <input
                            type="checkbox"
                            checked={isCompleted}
                            disabled={isLoading}
                            onChange={() => handleToggleComplete(node)}
                          />
                          <span>{isLoading ? "Saving..." : "Mark as complete"}</span>
                        </label>
                      </div>
                      {node.description && <p>{node.description}</p>}
                      {node.nodeType && (
                        <div className="step-meta">
                          <span style={{ background: 'var(--color-surface-secondary)', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>
                            {node.nodeType}
                          </span>
                        </div>
                      )}
                      {/* Resources nếu backend cung cấp */}
                      {node.resources && node.resources.length > 0 && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setExpandedStep(isExpanded ? null : node.id)}
                            className="toggle-lessons-btn"
                          >
                            {isExpanded ? "Hide" : "Show"} Resources ({node.resources.length})
                          </Button>
                          {isExpanded && (
                            <div className="lessons-list">
                              {node.resources.map((resource, rIdx) => (
                                <div key={rIdx} className="lesson-item">
                                  <div className="lesson-content">
                                    <div className="lesson-title">
                                      {resource.url ? (
                                        <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                          {resource.title || resource.url}
                                        </a>
                                      ) : (
                                        resource.title
                                      )}
                                    </div>
                                    {resource.type && (
                                      <div className="lesson-meta">
                                        <span>{resource.type}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
