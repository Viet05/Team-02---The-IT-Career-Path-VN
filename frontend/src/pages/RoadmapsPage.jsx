import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { getAllRoadmaps } from "../services/roadmapService";
import Card from "../components/Card";
import Pill from "../components/Pill";
import ProgressBar from "../components/ProgressBar";
import EmptyState from "../components/EmptyState";
import { useUserState } from "../store/useLocalStorage";
import "../styles/roadmaps-page.css";

const CATEGORIES = ["Frontend", "Backend", "Full Stack", "DevOps", "Data", "Mobile"];

// Map category filter keywords to roadmap titles
const matchesCategory = (roadmap, filter) => {
  if (!filter) return true;
  const title = (roadmap.title || "").toLowerCase();
  const description = (roadmap.description || "").toLowerCase();
  return title.includes(filter.toLowerCase()) || description.includes(filter.toLowerCase());
};

export default function RoadmapsPage() {
  const location = useLocation();
  const { getProgressPercentage, progress } = useUserState();
  const [filter, setFilter] = useState(location.state?.filter || "");
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        setLoading(true);
        const data = await getAllRoadmaps();
        setRoadmaps(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch roadmaps:", err);
        setError("Không thể tải danh sách roadmap. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmaps();
  }, []);

  useEffect(() => {
    if (location.state?.filter) {
      Promise.resolve().then(() => setFilter(location.state.filter));
    }
  }, [location.state]);

  const filteredRoadmaps = filter
    ? roadmaps.filter((r) => matchesCategory(r, filter))
    : roadmaps;

  // Tính progress từ localStorage (progress stored by roadmapId -> nodeId -> boolean)
  const getLocalProgress = (roadmapId, totalSteps) => {
    if (!totalSteps) return 0;
    return getProgressPercentage(roadmapId, totalSteps);
  };

  // Map level text
  const getLevelBadge = (level) => {
    const map = {
      BEGINNER: "Beginner",
      INTERMEDIATE: "Intermediate",
      ADVANCED: "Advanced",
    };
    return map[level] || level || "";
  };

  return (
    <div className="roadmaps-page">
      <div className="roadmaps-container">
        <div className="page-header">
          <div>
            <h1>Learning Roadmaps</h1>
            <p>Choose a path and start your journey</p>
          </div>
        </div>

        <div className="filters-section">
          <Pill
            variant={filter === "" ? "primary" : "default"}
            onClick={() => setFilter("")}
          >
            All
          </Pill>
          {CATEGORIES.map((cat) => (
            <Pill
              key={cat}
              variant={filter === cat ? "primary" : "default"}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </Pill>
          ))}
        </div>

        {loading && (
          <div className="loading-state">
            <p>Đang tải roadmaps...</p>
          </div>
        )}

        {error && !loading && (
          <EmptyState
            icon="⚠️"
            title="Lỗi tải dữ liệu"
            message={error}
            actionLabel="Thử lại"
            onAction={() => window.location.reload()}
          />
        )}

        {!loading && !error && filteredRoadmaps.length === 0 && (
          <EmptyState
            icon="🔍"
            title="No roadmaps found"
            message="Try adjusting your filters"
          />
        )}

        {!loading && !error && filteredRoadmaps.length > 0 && (
          <div className="roadmaps-grid">
            {filteredRoadmaps.map((roadmap) => {
              // Backend totalSteps = số node trong roadmap (nếu có)
              const totalSteps = roadmap.totalNodes || roadmap.totalSteps || 0;
              const localProgress = getLocalProgress(roadmap.roadmapId, totalSteps);

              return (
                <Card key={roadmap.roadmapId} className="roadmap-card" hover>
                  <Link to={`/roadmaps/${roadmap.roadmapId}`} className="roadmap-link">

                    <div className="roadmap-card-top">
                      <div className="roadmap-icon">
                        {roadmap.icon || "🗺️"}
                      </div>
                      <div className="roadmap-info">
                        <h3>{roadmap.title}</h3>
                        <p>{roadmap.description}</p>
                      </div>
                    </div>
                    <div className="roadmap-stats">
                      {totalSteps > 0 && (
                        <div className="roadmap-stat">
                          <span className="stat-value">{totalSteps}</span>
                          <span className="stat-label">Steps</span>
                        </div>
                      )}
                      {roadmap.level && (
                        <div className="roadmap-stat">
                          <span className="stat-value">{getLevelBadge(roadmap.level)}</span>
                          <span className="stat-label">Level</span>
                        </div>
                      )}
                    </div>
                    {localProgress > 0 && (
                      <div className="roadmap-progress">
                        <ProgressBar value={localProgress} max={100} showLabel={false} />
                        <span className="progress-text">{localProgress}% complete</span>
                      </div>
                    )}
                  </Link>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
