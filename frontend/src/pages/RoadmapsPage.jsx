import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { getAllRoadmaps } from "../services/roadmapService";
import ProgressBar from "../components/ProgressBar";
import EmptyState from "../components/EmptyState";
import { useUserState } from "../store/useLocalStorage";
import "../styles/roadmaps-page.css";

const CATEGORIES = ["Frontend", "Backend", "Full Stack", "DevOps", "Data", "Mobile"];

const matchesCategory = (roadmap, filter) => {
  if (!filter) return true;
  const title = (roadmap.title || "").toLowerCase();
  const description = (roadmap.description || "").toLowerCase();
  return title.includes(filter.toLowerCase()) || description.includes(filter.toLowerCase());
};

const LEVEL_META = {
  BEGINNER: { label: "Beginner", color: "#10b981", bg: "rgba(16,185,129,0.12)", icon: "🌱" },
  INTERMEDIATE: { label: "Intermediate", color: "#f59e0b", bg: "rgba(245,158,11,0.12)", icon: "⚡" },
  ADVANCED: { label: "Advanced", color: "#6366f1", bg: "rgba(99,102,241,0.12)", icon: "🔥" },
};

export default function RoadmapsPage() {
  const location = useLocation();
  const { getProgressPercentage } = useUserState();
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (location.state?.filter) {
      setFilter(location.state.filter);
    }
  }, [location.state]);

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

  const filteredRoadmaps = roadmaps.filter((r) => {
    const matchesCat = matchesCategory(r, filter);
    const matchesSearch =
      (r.title || "").toLowerCase().includes(search.toLowerCase()) ||
      (r.description || "").toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const getLocalProgress = (roadmapId, totalSteps) => {
    if (!totalSteps) return 0;
    return getProgressPercentage(roadmapId, totalSteps);
  };

  return (
    <div className="roadmaps-page">
      <div className="roadmaps-container">
        {/* ── Header ── */}
        <div className="roadmaps-header">
          <div className="roadmaps-header-text">
            <h1>Learning Roadmaps</h1>
            <p>Choose a path, master new skills, and advance your career</p>
          </div>
          <div className="roadmaps-stats">
            <div className="stat-badge">
              <span className="stat-num">{roadmaps.length}</span>
              <span className="stat-label">Paths Available</span>
            </div>
          </div>
        </div>

        {/* ── Filters & Search ── */}
        <div className="roadmaps-controls">
          <div className="search-box">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search roadmaps..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-pills">
            <button
              className={`filter-pill ${filter === "" ? "filter-pill--active" : ""}`}
              onClick={() => setFilter("")}
            >
              All Paths
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`filter-pill ${filter === cat ? "filter-pill--active" : ""}`}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ── Content ── */}
        {loading && (
          <div className="roadmaps-loading">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="roadmap-skeleton" style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        )}

        {error && !loading && (
          <div className="roadmaps-card-wrapper">
            <EmptyState
              icon="⚠️"
              title="Failed to Load Roadmaps"
              message={error}
              actionLabel="Try Again"
              onAction={() => window.location.reload()}
            />
          </div>
        )}

        {!loading && !error && filteredRoadmaps.length === 0 && (
          <div className="roadmaps-card-wrapper">
            <EmptyState
              icon="🔍"
              title="No roadmaps found"
              message={search || filter ? "Try adjusting your filters or search term." : "No roadmaps available at the moment."}
              actionLabel={search || filter ? "Clear Filters" : null}
              onAction={search || filter ? () => { setFilter(""); setSearch(""); } : null}
            />
          </div>
        )}

        {!loading && !error && filteredRoadmaps.length > 0 && (
          <div className="roadmaps-grid">
            {filteredRoadmaps.map((roadmap) => {
              const totalSteps = roadmap.totalNodes || roadmap.totalSteps || 0;
              const localProgress = getLocalProgress(roadmap.roadmapId, totalSteps);
              const meta = LEVEL_META[roadmap.level] || { label: roadmap.level || "All Levels", color: "#6b7280", bg: "#f3f4f6", icon: "📌" };

              return (
                <Link to={`/roadmaps/${roadmap.roadmapId}`} key={roadmap.roadmapId} className="roadmap-card">
                  <div className="roadmap-card-header">
                    <div className="roadmap-icon-wrapper">
                      <span className="roadmap-icon">{roadmap.icon || "🗺️"}</span>
                    </div>
                    {localProgress === 100 && (
                      <div className="roadmap-completed-badge">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Done
                      </div>
                    )}
                  </div>

                  <div className="roadmap-card-body">
                    <h3>{roadmap.title}</h3>
                    <p>{roadmap.description}</p>
                  </div>

                  <div className="roadmap-card-footer">
                    <div className="roadmap-meta">
                      <div className="roadmap-meta-item" style={{ color: meta.color, background: meta.bg }}>
                        {meta.icon} {meta.label}
                      </div>
                      {totalSteps > 0 && (
                        <div className="roadmap-meta-item steps-meta">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          {totalSteps} Steps
                        </div>
                      )}
                    </div>

                    {localProgress > 0 && (
                      <div className="roadmap-progress-wrapper">
                        <div className="roadmap-progress-header">
                          <span className="progress-label">Progress</span>
                          <span className="progress-value">{localProgress}%</span>
                        </div>
                        <ProgressBar value={localProgress} max={100} showLabel={false} height="6px" />
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
