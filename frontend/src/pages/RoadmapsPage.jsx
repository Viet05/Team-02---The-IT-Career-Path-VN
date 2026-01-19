import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { mockRoadmaps } from "../data/mockRoadmaps";
import Card from "../components/Card";
import Pill from "../components/Pill";
import ProgressBar from "../components/ProgressBar";
import EmptyState from "../components/EmptyState";
import { useUserState } from "../store/useLocalStorage";
import "../styles/roadmaps-page.css";

export default function RoadmapsPage() {
  const location = useLocation();
  const { getProgressPercentage } = useUserState();
  const [filter, setFilter] = useState(location.state?.filter || "");

  useEffect(() => {
    if (location.state?.filter) {
      Promise.resolve().then(() => setFilter(location.state.filter));
    }
  }, [location.state]);

  const filteredRoadmaps = filter
    ? mockRoadmaps.filter((r) => r.category.toLowerCase().includes(filter.toLowerCase()))
    : mockRoadmaps;

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
          {["Frontend", "Backend", "Full Stack", "DevOps"].map((cat) => (
            <Pill
              key={cat}
              variant={filter === cat ? "primary" : "default"}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </Pill>
          ))}
        </div>

        {filteredRoadmaps.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="No roadmaps found"
            message="Try adjusting your filters"
          />
        ) : (
          <div className="roadmaps-grid">
            {filteredRoadmaps.map((roadmap) => {
              const progress = getProgressPercentage(roadmap.id, roadmap.totalSteps);
              return (
                <Card key={roadmap.id} className="roadmap-card" hover>
                  <Link to={`/roadmaps/${roadmap.id}`} className="roadmap-link">
                    <div className="roadmap-card-top">
                      <div className="roadmap-icon">{roadmap.icon}</div>
                      <div className="roadmap-info">
                        <h3>{roadmap.title}</h3>
                        <p>{roadmap.description}</p>
                      </div>
                    </div>
                    <div className="roadmap-stats">
                      <div className="roadmap-stat">
                        <span className="stat-value">{roadmap.totalSteps}</span>
                        <span className="stat-label">Steps</span>
                      </div>
                      <div className="roadmap-stat">
                        <span className="stat-value">{roadmap.totalLessons}</span>
                        <span className="stat-label">Lessons</span>
                      </div>
                      <div className="roadmap-stat">
                        <span className="stat-value">{roadmap.estimatedHours}h</span>
                        <span className="stat-label">Est. Time</span>
                      </div>
                    </div>
                    {progress > 0 && (
                      <div className="roadmap-progress">
                        <ProgressBar value={progress} max={100} showLabel={false} />
                        <span className="progress-text">{progress}% complete</span>
                      </div>
                    )}
                    <div className="roadmap-skills">
                      {roadmap.skills.slice(0, 4).map((skill) => (
                        <Pill key={skill} variant="default">
                          {skill}
                        </Pill>
                      ))}
                      {roadmap.skills.length > 4 && (
                        <span className="more-skills">+{roadmap.skills.length - 4}</span>
                      )}
                    </div>
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
